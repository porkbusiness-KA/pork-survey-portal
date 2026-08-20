#!/bin/bash
# ============================================================
# PORK SURVEY PORTAL - FIRST TIME VPS SETUP WITH GITHUB
# Run this ONCE on your fresh Ubuntu 24.04 VPS as root
# Usage: bash setup-vps.sh yourdomain.com your-github-username your-repo-name
# Example: bash setup-vps.sh portalsurvey.com hemanth pork-survey-portal
# ============================================================

DOMAIN=${1:-"yourdomain.com"}
GITHUB_USER=${2:-"your-github-username"}
GITHUB_REPO=${3:-"pork-survey-portal"}
APP_DIR="/var/www/pork-survey"

echo "================================================"
echo "  PORK SURVEY PORTAL - VPS SETUP"
echo "  Domain  : $DOMAIN"
echo "  GitHub  : github.com/$GITHUB_USER/$GITHUB_REPO"
echo "================================================"

# ---- 1. UPDATE SYSTEM ----
echo "[1/9] Updating system..."
apt update -y && apt upgrade -y

# ---- 2. INSTALL NODE.JS 20 LTS ----
echo "[2/9] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
echo "Node: $(node --version), npm: $(npm --version)"

# ---- 3. INSTALL MYSQL 8.0 ----
echo "[3/9] Installing MySQL..."
apt install -y mysql-server
systemctl start mysql
systemctl enable mysql

# Configure MySQL
mysql -u root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
CREATE DATABASE IF NOT EXISTS pork_survey_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
FLUSH PRIVILEGES;
EOF
echo "✅ MySQL configured - DB: pork_survey_db"

# ---- 4. INSTALL NGINX ----
echo "[4/9] Installing Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# ---- 5. INSTALL PM2 ----
echo "[5/9] Installing PM2..."
npm install -g pm2

# ---- 6. INSTALL CERTBOT (SSL) ----
echo "[6/9] Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# ---- 7. CLONE REPO FROM GITHUB ----
echo "[7/9] Cloning repo from GitHub..."
mkdir -p $APP_DIR
git clone https://github.com/$GITHUB_USER/$GITHUB_REPO.git $APP_DIR
mkdir -p $APP_DIR/backend/uploads
chmod 755 $APP_DIR/backend/uploads

# Install dependencies
cd $APP_DIR/backend && npm ci --production
cd $APP_DIR/frontend && npm ci && npm run build

# Import database schema
mysql -u root -proot pork_survey_db < $APP_DIR/backend/schema.sql
echo "✅ Database schema imported!"

# ---- 8. CONFIGURE NGINX ----
echo "[8/9] Configuring Nginx..."
cat > /etc/nginx/sites-available/pork-survey << NGINX_CONF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # React Frontend (static)
    root $APP_DIR/frontend/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Node.js API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_cache_bypass \$http_upgrade;
    }

    # Uploaded Photos
    location /uploads {
        alias $APP_DIR/backend/uploads;
        expires 30d;
    }

    client_max_body_size 50M;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
NGINX_CONF

ln -sf /etc/nginx/sites-available/pork-survey /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
echo "✅ Nginx configured!"

# ---- 9. START BACKEND & ENABLE SSL ----
echo "[9/9] Starting backend & enabling SSL..."

# Start Node.js backend
cd $APP_DIR/backend
pm2 start server.js --name "pork-survey-api"
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash

# Free SSL certificate
certbot --nginx -d $DOMAIN -d www.$DOMAIN \
  --non-interactive --agree-tos \
  --email admin@$DOMAIN \
  --redirect

echo ""
echo "================================================"
echo "  🎉 SETUP COMPLETE!"
echo ""
echo "  ✅ Portal Live: https://$DOMAIN"
echo "  ✅ API:         https://$DOMAIN/api/surveys"
echo "  ✅ MySQL DB:    pork_survey_db (root/root)"
echo "  ✅ PM2:         pm2 status"
echo "  ✅ Logs:        pm2 logs pork-survey-api"
echo ""
echo "  Now push code changes from your PC:"
echo "  git add . && git commit -m 'update' && git push"
echo "  → GitHub Actions auto-deploys to this server!"
echo "================================================"
