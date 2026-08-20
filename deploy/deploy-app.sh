#!/bin/bash
# ============================================================
# PORK SURVEY PORTAL - APPLICATION DEPLOYMENT
# Run AFTER setup-vps.sh is complete
# Usage: bash deploy-app.sh yourdomain.com
# ============================================================

DOMAIN=${1:-"yourdomain.com"}
APP_DIR="/var/www/pork-survey"

echo "================================================"
echo "  DEPLOYING PORK SURVEY PORTAL"
echo "  Domain: $DOMAIN"
echo "================================================"

# ---- Create app directory ----
mkdir -p $APP_DIR
mkdir -p $APP_DIR/backend/uploads
cd $APP_DIR

# ---- Import MySQL Schema ----
echo "[1/5] Importing database schema..."
mysql -u root -proot pork_survey_db < /tmp/schema.sql
echo "✅ Database schema imported!"

# ---- Install Backend Dependencies ----
echo "[2/5] Installing backend dependencies..."
cd $APP_DIR/backend
npm install --production
echo "✅ Backend dependencies installed!"

# ---- Configure Nginx ----
echo "[3/5] Configuring Nginx..."
cat > /etc/nginx/sites-available/pork-survey << NGINX_CONF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Serve React frontend (static files)
    root /var/www/pork-survey/frontend/dist;
    index index.html;

    # Handle React Router (SPA)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API requests to Node.js backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
    }

    # Serve uploaded shop photos
    location /uploads {
        alias /var/www/pork-survey/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
NGINX_CONF

# Enable the site
ln -sf /etc/nginx/sites-available/pork-survey /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
echo "✅ Nginx configured!"

# ---- Start Backend with PM2 ----
echo "[4/5] Starting Node.js backend with PM2..."
cd $APP_DIR/backend
pm2 start server.js --name "pork-survey-api"
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash
echo "✅ Backend running with PM2!"

# ---- Enable Free SSL ----
echo "[5/5] Enabling Free SSL (HTTPS)..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
echo "✅ SSL certificate enabled!"

echo ""
echo "================================================"
echo "  🎉 DEPLOYMENT COMPLETE!"
echo "  Your portal is live at: https://$DOMAIN"
echo "  API running at: https://$DOMAIN/api/surveys"
echo "  PM2 Status: pm2 status"
echo "  View Logs: pm2 logs pork-survey-api"
echo "================================================"
