module.exports = {
  apps: [
    {
      name: "bookio-backend",
      script: "src/index.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
        PORT: 8000,
        MONGO_URL: "mongodb://127.0.0.1:27017/bookio",
        JWT_SECRET: "bookio_super_secret_jwt_key_2026_production"
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8000,
        MONGO_URL: "mongodb://127.0.0.1:27017/bookio",
        JWT_SECRET: "bookio_super_secret_jwt_key_2026_production"
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      merge_logs: true,
      time: true
    }
  ]
};
