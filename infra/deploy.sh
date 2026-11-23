#!/bin/bash
set -e

APP_DIR="/var/www/bookio"
cd "$APP_DIR"

echo "=========================================="
echo "🚀 [Deploy] Starting Bookio Deployment..."
echo "=========================================="

# 1. Update source code if Git repo exists
if [ -d ".git" ]; then
  echo "📥 [Deploy] Pulling latest changes from git..."
  git pull origin main || echo "Git pull skipped or failed, using existing files"
fi

# 2. Setup & run Backend
echo "📦 [Deploy] Setting up Backend..."
cd "$APP_DIR/backend"
mkdir -p logs
npm install --omit=dev

# Check and seed database with books
echo "🌱 [Deploy] Seeding database with initial catalog..."
npm run addbooks || echo "Database seeding completed or skipped"

# PM2 restart or start
echo "🔄 [Deploy] Managing Backend process with PM2..."
if pm2 list | grep -q "bookio-backend"; then
  echo "Reloading existing PM2 process..."
  pm2 reload ecosystem.config.cjs --env production --update-env
else
  echo "Starting new PM2 process..."
  pm2 start ecosystem.config.cjs --env production
fi
pm2 save

# 3. Setup & build Frontend
echo "⚛️ [Deploy] Building Frontend..."
cd "$APP_DIR/frontend"
npm install
npm run build

# 4. Configure & Reload Nginx
echo "🌐 [Deploy] Updating Nginx configuration..."
sudo cp "$APP_DIR/infra/nginx.conf" /etc/nginx/sites-available/bookio
sudo ln -sf /etc/nginx/sites-available/bookio /etc/nginx/sites-enabled/bookio

# Remove default nginx site if present
if [ -f /etc/nginx/sites-enabled/default ]; then
  sudo rm -f /etc/nginx/sites-enabled/default
fi

# Test Nginx syntax and reload
echo "Testing Nginx configuration..."
sudo nginx -t
sudo systemctl reload nginx

echo "=========================================="
echo "✅ [Deploy] Deployment completed successfully!"
echo "Server Status:"
echo "- Nginx: $(systemctl is-active nginx)"
echo "- MongoDB: $(systemctl is-active mongod)"
echo "- PM2 Status:"
pm2 status
echo "=========================================="
