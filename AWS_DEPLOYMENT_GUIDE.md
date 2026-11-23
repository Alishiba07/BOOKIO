# BOOKIO — Production AWS EC2 Hosting & DevOps Deployment Guide
### Full-Stack MERN Deployment with CloudFormation, Nginx, PM2, MongoDB & GitHub Actions CI/CD

This document is the official, complete step-by-step deployment guide for hosting the **BOOKIO** MERN stack application on Amazon Web Services (AWS). It hosts all three tiers—**Frontend (React/Vite)**, **Backend (Node.js/Express)**, and **Database (MongoDB)**—on AWS EC2 with automated Infrastructure-as-Code (IaC) and push-to-deploy CI/CD.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites & Requirements](#2-prerequisites--requirements)
3. [The Infrastructure Files in Your Repository](#3-the-infrastructure-files-in-your-repository)
4. [Step-by-Step Deployment Walkthrough](#4-step-by-step-deployment-walkthrough)
   - [Step 1: Create an AWS EC2 Key Pair](#step-1-create-an-aws-ec2-key-pair)
   - [Step 2: Deploy Infrastructure via CloudFormation](#step-2-deploy-infrastructure-via-cloudformation)
   - [Step 3: Verification & Initial Server Inspection](#step-3-verification--initial-server-inspection)
   - [Step 4: Database Hosting & Seeding (MongoDB)](#step-4-database-hosting--seeding-mongodb)
   - [Step 5: Configure GitHub Actions CI/CD](#step-5-configure-github-actions-cicd)
   - [Step 6: Test Continuous Deployment](#step-6-test-continuous-deployment)
5. [Production Maintenance & Monitoring Cheat Sheet](#5-production-maintenance--monitoring-cheat-sheet)
6. [Optional: Adding a Custom Domain & Free SSL (HTTPS)](#6-optional-adding-a-custom-domain--free-ssl-https)
7. [Troubleshooting Common Issues](#7-troubleshooting-common-issues)

---

## 1. Architecture Overview

```
                      [ User Browser ]
                             │
                    HTTP Port 80 / HTTPS 443
                             ▼
                [ AWS Security Group (Firewall) ]
                             │
           ┌─────────────────┴─────────────────┐
           │     AWS EC2 (Ubuntu 22.04 LTS)    │
           │                                   │
           │        [ Nginx Web Server ]       │
           │           (Port 80/443)           │
           │          /             \          │
           │    /*   /               \  /api/* │
           │        ▼                 ▼        │
           │ [ React SPA ]       [ Node/Express]
           │ (frontend/dist)     (PM2 :8000)   │
           │                           │       │
           │                      Port 27017   │
           │                           ▼       │
           │                   [ MongoDB Server]
           │                   (Local Service) │
           └───────────────────────────────────┘
```

- **Frontend Tier**: Vite React Single Page Application compiled to static HTML, CSS, and JS (`frontend/dist`) and served directly by Nginx with gzip compression, browser caching, and client-side route fallback (`try_files $uri $uri/ /index.html`).
- **Backend Tier**: Node.js & Express API managed by **PM2** (Process Manager 2) daemon, running on port `8000`. PM2 handles automatic clustering, instant restarts on crash, memory protection, and system boot resurrection.
- **Database Tier**: **MongoDB Community Server 7.0** running directly as a secured system service (`mongod`) bound locally to `127.0.0.1:27017` on the EC2 instance, persisting data in `/var/lib/mongodb`. *(Alternatively, MongoDB Atlas connection strings are supported simply by updating `MONGO_URL`)*.
- **Reverse Proxy**: Nginx forwards all `/api/*` traffic to the backend, completely eliminating Cross-Origin Resource Sharing (CORS) issues in production.
- **CI/CD Pipeline**: GitHub Actions connects to the EC2 instance over encrypted SSH on every push to `main` and automatically pulls the code, installs dependencies, builds the frontend, seeds the DB, and reloads PM2 and Nginx with zero downtime.

---

## 2. Prerequisites & Requirements

Before starting, ensure you have:
1. **AWS Account**: An active AWS account ([Create free tier account](https://aws.amazon.com/free/)).
2. **GitHub Account & Repository**: Your code pushed to GitHub:
   ```
   https://github.com/Alishiba07/BOOKIO.git
   ```
3. **Local Terminal / SSH Client**: Windows PowerShell, macOS Terminal, or Linux terminal.

---

## 3. The Infrastructure Files in Your Repository

All necessary configuration files have been created in your project:

| File Path | Purpose |
| :--- | :--- |
| `infra/ec2-instance.yaml` | **CloudFormation Template**: Provisions the EC2 instance, Security Group (Ports 22, 80, 443), 20GB gp3 storage, 2GB swap space, installs Node.js 20, MongoDB 7, Nginx, PM2, and clones the repo. |
| `infra/nginx.conf` | **Web Server & Reverse Proxy**: Serves the React frontend, enables gzip compression, configures cache headers, and reverse proxies `/api/` to port `8000`. |
| `backend/ecosystem.config.cjs` | **PM2 Process Configuration**: Runs the Express backend under daemon management with automatic memory restart and environment variables. |
| `infra/deploy.sh` | **Automated Deployment Script**: Pulls latest code, installs backend & frontend dependencies, seeds books data, builds Vite, and reloads PM2 & Nginx. |
| `.github/workflows/deploy.yml` | **GitHub Actions CI/CD Pipeline**: Triggers automated deployment to EC2 upon every git push to `main`. |
| `frontend/src/config.js` | **Dynamic API Routing**: Automatically uses relative URL (`""`) in production via Nginx reverse proxy, and `http://localhost:8000` in local development. |

---

## 4. Step-by-Step Deployment Walkthrough

### Step 1: Create an AWS EC2 Key Pair

You need an SSH Key Pair to securely access your EC2 server.

1. Log in to the [AWS Management Console](https://console.aws.amazon.com/).
2. Select your preferred AWS Region in the top-right corner (e.g., `us-east-1` N. Virginia, `ap-south-1` Mumbai, or `eu-central-1` Frankfurt).
3. In the top search bar, type **EC2** and press Enter.
4. On the left navigation pane under **Network & Security**, click **Key Pairs**.
5. Click **Create key pair** (top right).
6. Fill in the details:
   - **Name**: `bookio-key`
   - **Key pair type**: `RSA`
   - **Private key file format**: `.pem` (for OpenSSH / PowerShell / macOS / Linux)
7. Click **Create key pair**.
8. A file named `bookio-key.pem` will download automatically to your computer. **Keep this file safe!**

> **Windows PowerShell Tip**: Move `bookio-key.pem` to `C:\Users\<YourUser>\.ssh\bookio-key.pem` or your project folder.

---

### Step 2: Deploy Infrastructure via CloudFormation

We will use the CloudFormation template `infra/ec2-instance.yaml` to spin up the entire server automatically.

#### Option A: Using AWS Web Console (Recommended for First-Time)

1. In the AWS Management Console search bar, type **CloudFormation** and open it.
2. Click **Create stack** -> **With new resources (standard)**.
3. Under **Prerequisite - Prepare template**, select **Template is ready**.
4. Under **Template source**, select **Upload a template file**.
5. Click **Choose file** and select `infra/ec2-instance.yaml` from your `BOOKIO/infra` folder.
6. Click **Next**.
7. In **Specify stack details**:
   - **Stack name**: `bookio-production`
   - **KeyName**: Select `bookio-key` from the dropdown.
   - **InstanceType**: Keep `t3.small` (recommended) or choose `t2.micro` (free tier eligible).
   - **GitRepoUrl**: `https://github.com/Alishiba07/BOOKIO.git`
   - **GitBranch**: `main`
   - **SSHLocation**: Keep `0.0.0.0/0` (or enter your specific IP with `/32` for tighter security).
8. Click **Next**, leave default options on the Configure stack options page, and click **Next**.
9. Review the parameters and click **Submit**.

#### Option B: Using AWS CLI (For Advanced Users)

```bash
aws cloudformation create-stack \
  --stack-name bookio-production \
  --template-body file://infra/ec2-instance.yaml \
  --parameters ParameterKey=KeyName,ParameterValue=bookio-key \
  --region us-east-1
```

---

### Step 3: Verification & Initial Server Inspection

1. In the CloudFormation console, monitor the **Events** tab. Wait until the status changes to **CREATE_COMPLETE** (approx. 2–3 minutes).
2. Click on the **Outputs** tab. You will see:
   - `PublicIP`: The public IP address of your EC2 server (e.g., `54.210.45.120`).
   - `WebsiteURL`: `http://<PublicIP>`
   - `BackendApiURL`: `http://<PublicIP>/api/books`
   - `SSHCommand`: `ssh -i bookio-key.pem ubuntu@<PublicIP>`

> **Note on Initial Boot**: When the EC2 instance first boots, the `UserData` script runs in the background to install Node.js, MongoDB, Nginx, PM2, clone your repo, and run the deployment script. Give it **2 to 3 minutes** after instance creation for the installation to finish.

3. Test SSH access from your local terminal:
   ```bash
   ssh -i /path/to/bookio-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
   ```

---

### Step 4: Database Hosting & Seeding (MongoDB)

Your database is hosted **directly on your EC2 instance** using **MongoDB Community Edition 7.0**:

- **System Service**: `mongod`
- **Listening Address**: `127.0.0.1:27017` (isolated locally on the server for maximum security)
- **Database Name**: `bookio`
- **Data Storage Path**: `/var/lib/mongodb`

#### Verifying MongoDB Status:
SSH into your server and run:
```bash
sudo systemctl status mongod
```
You should see `Active: active (running)`.

#### Seeding Book Data:
The automated `infra/deploy.sh` script automatically runs `npm run addbooks` which reads `books.json` and inserts all 50+ books into your MongoDB collection.

If you ever wish to manually re-seed the database:
```bash
cd /var/www/bookio/backend
npm run addbooks
```
You will see:
```
Connected to MongoDB...
Old books cleared.
Inserted 50 books into MongoDB
```

*(Note: If you ever prefer using cloud MongoDB Atlas instead of the local EC2 database, simply update `MONGO_URL` in `backend/ecosystem.config.cjs` to your Atlas `mongodb+srv://...` connection string and run `pm2 reload ecosystem.config.cjs --update-env`).*

---

### Step 5: Configure GitHub Actions CI/CD

Now set up automated deployment so every git push to `main` instantly updates the live website.

#### 1. Prepare Your Private SSH Key Content:
Open your `bookio-key.pem` file in a text editor (e.g., Notepad, VS Code) and copy the entire contents, including:
```
-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
```

#### 2. Add Repository Secrets in GitHub:
1. Go to your GitHub repository: `https://github.com/Alishiba07/BOOKIO`
2. Click **Settings** (top tabs) -> on the left sidebar, click **Secrets and variables** -> **Actions**.
3. Under **Repository secrets**, click **New repository secret** and add the following 3 secrets:

| Secret Name | Value | Description |
| :--- | :--- | :--- |
| `EC2_HOST` | `54.x.x.x` | The Public IPv4 address from your CloudFormation Outputs |
| `EC2_USERNAME` | `ubuntu` | The default username for Ubuntu instances |
| `EC2_SSH_KEY` | *(Paste full content of `bookio-key.pem`)* | Your private SSH key |

---

### Step 6: Test Continuous Deployment

1. Commit and push your changes to GitHub:
   ```bash
   git add .
   git commit -m "feat: add AWS infrastructure and CI/CD deployment pipeline"
   git push origin main
   ```
2. In your GitHub repository, click on the **Actions** tab.
3. You will see the **Deploy Bookio to AWS EC2** workflow running.
4. Click on it to watch the live logs:
   - Connects to EC2
   - Pulls latest code
   - Builds frontend with Vite
   - Restarts backend with PM2
   - Reloads Nginx
5. Once green (Successful), open `http://<YOUR_EC2_PUBLIC_IP>` in your browser!

---

## 5. Production Maintenance & Monitoring Cheat Sheet

Whenever you are connected to the EC2 server via SSH, use these commands to manage your services:

### PM2 (Node.js Backend Manager)
```bash
# Check status of running backend
pm2 status

# View live streaming logs (console.log & errors)
pm2 logs bookio-backend

# Restart backend process
pm2 restart bookio-backend

# View memory and CPU usage
pm2 monit
```

### Nginx (Web Server)
```bash
# Test Nginx configuration for syntax errors
sudo nginx -t

# Reload Nginx without downtime
sudo systemctl reload nginx

# View Nginx access & error logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### MongoDB (Database)
```bash
# Check MongoDB status
sudo systemctl status mongod

# Start / Restart MongoDB
sudo systemctl restart mongod

# View MongoDB server logs
sudo tail -f /var/log/mongodb/mongod.log
```

---

## 6. Optional: Adding a Custom Domain & Free SSL (HTTPS)

If you have a custom domain name (e.g., `bookio.yourdomain.com`):

### 1. Point Domain DNS to EC2 IP
In your domain registrar (GoDaddy, Namecheap, Route 53, Cloudflare):
- Create an **A Record**:
  - **Host**: `@` (or `bookio`)
  - **Value**: Your EC2 Public IP address

### 2. Update `server_name` in Nginx
SSH into the server and edit `/etc/nginx/sites-available/bookio`:
```bash
sudo nano /etc/nginx/sites-available/bookio
```
Change `server_name _;` to:
```nginx
server_name yourdomain.com www.yourdomain.com;
```
Save (`Ctrl+O`, `Enter`, `Ctrl+X`) and reload:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 3. Install Certbot for Free Automated SSL:
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Follow the interactive prompts. Certbot will automatically configure HTTPS on port 443, install Let's Encrypt certificates, and set up automated 90-day renewals!

---

## 7. Troubleshooting Common Issues

### Issue 1: Page shows "502 Bad Gateway" when opening `/api/...`
- **Cause**: Backend Express app is not running on port 8000.
- **Fix**: Run `pm2 status` and check logs with `pm2 logs bookio-backend`. Ensure MongoDB is running (`sudo systemctl status mongod`).

### Issue 2: Vite build runs out of memory (`JavaScript heap out of memory`) on `t2.micro`
- **Cause**: Free-tier t2.micro instances only have 1GB of physical RAM.
- **Fix**: The CloudFormation template automatically sets up **2GB of swap space** (`/swapfile`) which resolves this completely. You can verify swap is active with `free -h`.

### Issue 3: GitHub Actions fails with "Permission denied (publickey)"
- **Cause**: The `EC2_SSH_KEY` secret does not match or is missing header/footer lines.
- **Fix**: Ensure you copied the entire `.pem` file including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`.

---

**Congratulations! Your full-stack BOOKIO MERN application is now production-hosted on AWS with automated CI/CD!**
