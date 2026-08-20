# 📜 Commands Reference – Pork Retail Shop Survey Portal

## 1️⃣ Local Development Commands

| Context | Command | Explanation |
|---|---|---|
| **Start Backend** | `cd backend && npm install && npm start` | Runs Express API on `http://localhost:5001`. |
| **Start Frontend (Vite dev server)** | `cd frontend && npm install && npm run dev` | Serves React app on `http://localhost:5173` with hot‑module reload. |
| **Build Frontend for Production** | `cd frontend && npm run build` | Creates optimized static files in `frontend/dist`. |
| **Run Linter** | `npm run lint` (in either `frontend` or `backend`) | Checks code style & potential errors. |
| **Run Tests** | `npm test` | Executes any Jest/Mocha test suite (if present). |
| **Watch Files (auto‑restart)** | `pm2 start backend/server.js --watch --name pork-survey-api` | PM2 will restart the API when source changes. |
| **Open MySQL locally** | `mysql -u root -p` (password is `root`) | Opens MySQL client to inspect local DB. |
| **Export Local DB to SQL** | `mysqldump -u root -proot pork_survey_db > backup_local_$(date +%Y-%m-%d).sql` | Creates a backup file in the current directory. |

---

## 2️⃣ Hostinger VPS (Production) Commands

| Purpose | Command | Notes |
|---|---|---|
| **SSH into VPS** | `ssh root@193.203.161.145` | Use the VPS password (`Porkbusiness@123`). |
| **Navigate to project** | `cd /var/www/pork-survey-portal` | All operations are run from this directory. |
| **Pull latest code** | `git pull origin main` | Fetches latest commit (CI/CD also does this). |
| **Install / update dependencies** | `cd backend && npm ci && cd .. && cd frontend && npm ci && npm run build` | Guarantees a clean install. |
| **Restart API via PM2** | `pm2 restart pork-survey-api` | If the process isn’t running: `pm2 start backend/server.js --name pork-survey-api` |
| **Check PM2 status** | `pm2 status` | Shows running processes, memory, uptime. |
| **View API logs** | `pm2 logs pork-survey-api` | Real‑time log output. |
| **Check Nginx config** | `sudo nginx -t && sudo systemctl restart nginx` | Validate config before restarting. |
| **Obtain/renew SSL (first time)** | `sudo certbot --nginx -d intellectualparadiseservices.com -d www.intellectualparadiseservices.com --non-interactive --agree-tos -m admin@intellectualparadiseservices.com` | Certbot creates/renews certificates; a systemd timer handles auto‑renewal. |
| **Test HTTPS endpoint** | `curl -I https://intellectualparadiseservices.com` | Should return `200 OK` and security headers. |
| **Run a manual DB backup** | `mysqldump -u root -proot pork_survey_db > /root/backup_$(date +%Y-%m-%d_%H-%M).sql` | Stores the dump in `/root/`. |
| **List recent backups** | `ls -lh /root/backup_*.sql` | Verify backup files exist. |
| **Restore from backup** | `mysql -u root -proot pork_survey_db < /root/backup_2026-08-21_03-00.sql` | Use the appropriate file name. |
| **Show daily backup cron entry** | `crontab -l` | Should contain `0 23 * * * mysqldump …`. |
| **Add/Update daily backup cron** | `(crontab -l 2>/dev/null; echo "0 23 * * * mysqldump -u root -proot pork_survey_db > /root/backup_$(date +\%Y-\%m-\%d).sql") | crontab -` | Appends the job if missing. |
| **Check server disk usage** | `df -h` | Ensure enough space for backups. |
| **Tail Nginx error log** | `sudo tail -f /var/log/nginx/error.log` | Useful for 500/404 debugging. |
| **Tail application error log (PM2)** | `pm2 logs pork-survey-api --lines 100` | Shows recent error traces. |

---

## 3️⃣ Database Queries (Useful for Validation)

| Goal | MySQL Command |
|---|---|
| **List latest 5 surveys** | `SELECT id, shop_name, country, state, district, taluk, village, pincode FROM surveys ORDER BY id DESC LIMIT 5;` |
| **Count total surveys** | `SELECT COUNT(*) AS total FROM surveys;` |
| **Show distinct districts** | `SELECT DISTINCT district FROM surveys ORDER BY district;` |
| **Check column existence** | `DESCRIBE surveys;` |
| **Verify new columns** | `SELECT country, state, taluk, village FROM surveys LIMIT 1;` |
| **Export all data to CSV (manual)** | `SELECT * FROM surveys INTO OUTFILE '/tmp/surveys.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';` |

---

## 4️⃣ Git & CI/CD Commands

| Action | Command |
|---|---|
| **Stage all changes** | `git add .` |
| **Commit with message** | `git commit -m "Your description"` |
| **Push to remote (triggers CI/CD)** | `git push origin main` |
| **View GitHub Actions logs** | Open the repository on GitHub → **Actions** tab → select the latest workflow run. |
| **Rollback to previous commit** | `git checkout <previous‑sha>` then push again or reset: `git reset --hard <sha>` + `git push -f`. |

---

## 5️⃣ Miscellaneous Handy Commands

- **Reload Vite page without cache:** Press **Ctrl+Shift+R** in the browser.
- **Clear PM2 list:** `pm2 delete all` (use with caution).
- **Update Node.js LTS:** `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`.
- **Check which port your API is listening on:** `sudo lsof -i -P -n | grep LISTEN`.
- **View environment variables:** `cat .env` (backend) or `printenv` for the whole shell.

---

## 6️⃣ Quick Trouble‑shooting Checklist
1. **API returns 500?**
   - `pm2 logs pork-survey-api` → look for stack trace.
   - Verify DB connection (`DB_HOST`, `DB_USER`, `DB_PASSWORD`).
2. **Frontend shows blank page?**
   - Open browser dev tools → check console for JS errors.
   - Ensure Nginx is serving `frontend/dist` (`nginx -t`).
3. **Pincode auto‑fill not working?**
   - Open DevTools → Network tab → see request to `https://api.postalpincode.in/pincode/XXXXX`.
   - If blocked, check outbound firewall or internet connectivity.
4. **Backup missing?**
   - Verify cron job (`crontab -l`).
   - Check `/root/` for `.sql` files.
5. **SSL certificate expired?**
   - Run `sudo certbot renew --dry-run`.
   - Look at `/etc/letsencrypt/live/` for renewed files.

---

*Save this file as `COMMANDS_REFERENCE.md` in the repository root. It will be a handy cheat‑sheet for any future developer or operations engineer.*
