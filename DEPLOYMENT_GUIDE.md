# 📦 Deployment Guide – Pork Retail Shop Survey Portal

## 1️⃣ Overview
- **Live URL:** https://intellectualparadiseservices.com
- **Server:** Hostinger VPS (Ubuntu 24.04) – IP `193.203.161.145`
- **Domain registrar:** BigRock (A record → VPS IP, CNAME `www` → root domain)
- **Process manager:** `pm2`
- **Web server / reverse proxy:** `nginx`
- **SSL:** LetsEncrypt (certbot) – auto‑renewed every 60 days
- **CI/CD:** GitHub Actions (`.github/workflows/deploy.yml`) – pushes auto‑deploy.

---

## 2️⃣ One‑Time Server Bootstrap (`deploy/setup-vps.sh`)
```bash
#!/usr/bin/env bash
set -e

# -------------------------------------------------
# 1. Update & install required packages
# -------------------------------------------------
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl gnupg2 ca-certificates lsb-release software-properties-common

# Node.js (18 LTS) & npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# MySQL Server 8.0
sudo apt-get install -y mysql-server
# Secure installation (default root password is empty – we set it below)
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root'; FLUSH PRIVILEGES;"

# PM2 (global)
sudo npm install -g pm2

# Nginx
sudo apt install -y nginx

# Certbot for SSL
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# -------------------------------------------------
# 2. Clone repository
# -------------------------------------------------
cd /var/www && sudo git clone https://github.com/porkbusiness-KA/pork-survey-portal.git
cd pork-survey-portal

# -------------------------------------------------
# 3. Install dependencies & build frontend
# -------------------------------------------------
cd backend && npm ci && cd ..
cd frontend && npm ci && npm run build && cd ..

# -------------------------------------------------
# 4. MySQL schema import
# -------------------------------------------------
sudo mysql -u root -proot < backend/schema.sql

# -------------------------------------------------
# 5. PM2 process setup
# -------------------------------------------------
pm2 start backend/server.js --name pork-survey-api
pm2 save
pm2 startup

# -------------------------------------------------
# 6. Nginx configuration (create /etc/nginx/sites-available/pork-survey)
# -------------------------------------------------
cat <<'EOF' | sudo tee /etc/nginx/sites-available/pork-survey
server {
    listen 80;
    server_name intellectualparadiseservices.com www.intellectualparadiseservices.com;

    # Redirect all HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name intellectualparadiseservices.com www.intellectualparadiseservices.com;

    ssl_certificate /etc/letsencrypt/live/intellectualparadiseservices.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/intellectualparadiseservices.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Frontend static files
    root /var/www/pork-survey-portal/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API reverse‑proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# Enable site and test config
sudo ln -s /etc/nginx/sites-available/pork-survey /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# -------------------------------------------------
# 7. Obtain SSL certificate (first‑time only)
# -------------------------------------------------
sudo certbot --nginx -d intellectualparadiseservices.com -d www.intellectualparadiseservices.com --non-interactive --agree-tos -m admin@intellectualparadiseservices.com

# -------------------------------------------------
# 8. Automatic daily DB backup (cron at 23:00)
# -------------------------------------------------
(crontab -l 2>/dev/null; echo "0 23 * * * mysqldump -u root -proot pork_survey_db > /root/backup_$(date +\%Y-\%m-\%d).sql") | crtab -

# -------------------------------------------------
# 9. Auto‑renew SSL (certbot already adds a systemd timer)
# -------------------------------------------------
# Done! 🎉
```

---

## 3️⃣ Ongoing CI/CD (GitHub Actions)
**File:** `.github/workflows/deploy.yml`
```yaml
name: Deploy to Hostinger VPS
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      - name: Setup SSH
        uses: webfactory/ssh-agent@v0.5.4
        with:
          ssh-private-key: ${{ secrets.VPS_SSH_KEY }}
      - name: Run remote deployment script
        run: |
          ssh -o StrictHostKeyChecking=no ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} <<'EOF'
            cd /var/www/pork-survey-portal
            git pull origin main
            cd backend && npm ci && cd ..
            cd frontend && npm ci && npm run build && cd ..
            pm2 restart pork-survey-api || pm2 start backend/server.js --name pork-survey-api
          EOF
```
> Every push to `main` triggers the above, pulling the latest code, rebuilding the frontend, reinstalling backend deps, and restarting the API.

---

## 4️⃣ Verifying Deployment
```bash
# 1. Check that Nginx is serving the frontend
curl -I https://intellectualparadiseservices.com
# 2. Ensure the API is reachable
curl https://intellectualparadiseservices.com/api/surveys/stats
# 3. Verify PM2 status
ssh root@193.203.161.145 "pm2 status"
# 4. Look at the latest DB backup
ssh root@193.203.161.145 "ls -lh /root/backup_*.sql"
```
If anything fails, check logs:
- Nginx: `sudo journalctl -u nginx -f`
- PM2: `pm2 logs pork-survey-api`
- GitHub Actions: workflow run logs in the GitHub UI.

---

## 5️⃣ Rollback Procedure (if a bad deploy lands)
1. SSH to the VPS.
2. Reset repository to previous commit:
   ```bash
   cd /var/www/pork-survey-portal
   git log   # note previous commit SHA
   git checkout <SHA>
   ```
3. Re‑install deps & rebuild:
   ```bash
   cd backend && npm ci && cd ..
   cd frontend && npm ci && npm run build && cd ..
   ```
4. Restart PM2:
   ```bash
   pm2 restart pork-survey-api
   ```
5. Clear browser cache & verify the old version works.

---

## 6️⃣ Maintenance Checklist (monthly)
- ✅ Verify SSL renewal (`sudo certbot renew --dry-run`).
- ✅ Inspect backup folder (`/root/backup_*.sql`) – keep at least 7 days.
- ✅ Update Node.js LTS version if a new LTS is released.
- ✅ Run `npm audit` in both `frontend` & `backend` and patch any vulnerabilities.
- ✅ Review Nginx access/error logs for abnormal traffic.

---

*Keep this file in the repository root as `DEPLOYMENT_GUIDE.md`.*
