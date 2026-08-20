# 📚 Development Work Plan – Pork Retail Shop Survey Portal

## 1️⃣ Project Overview
- **Name:** Pork Retail Shop Outlet Survey Portal
- **Domain:** https://intellectualparadiseservices.com
- **GitHub:** https://github.com/porkbusiness-KA/pork-survey-portal
- **Purpose:** Collect structured data about pork retail shops across Karnataka (location, licensing, sales, etc.)
- **Target Users:** Field surveyors, franchise managers, analytics team.

## 2️⃣ Architecture Diagram (textual)
```
client (browser) ⇄ Nginx (HTTPS) ⇄ PM2‑managed Node.js Express API ⇄ MySQL 8.0 (Hostinger VPS)
    │                                 │
    │                                 ├─ `backend/` (controllers, routes, DB config)
    │                                 └─ `frontend/` (React + Vite, served as static assets)
    └─ Static assets built by Vite → `dist/` → Nginx `root` directory
```

## 3️⃣ Technology Stack
| Layer | Tech | Reason |
|------|------|--------|
| Frontend | **React 18**, **Vite**, **Vanilla CSS**, **Lucide‑React** | Fast UI, hot‑module reloading, lightweight icons |
| Backend | **Node.js 18 LTS**, **Express**, **MySQL2**, **Multer**, **csv‑writer** | Simple REST API, file upload support, CSV export |
| DB | **MySQL 8.0** | Reliable relational storage, easy indexing |
| DevOps | **GitHub Actions**, **PM2**, **Nginx**, **Certbot (Let's Encrypt)** | CI/CD, process management, HTTPS |
| Server | **Hostinger VPS (Ubuntu 24.04)** | Affordable cloud VM with root access |

## 4️⃣ Key Features Implemented
1. **Full location auto‑fetch** from 6‑digit Indian PIN code
   - Retrieves Country, State, District, Taluk/Block, Village (via offline cache → India Post API)
   - Shows clickable village chips for sub‑localities.
2. **Dynamic district handling** – no hard‑coded dropdown; districts are derived from DB records.
3. **Image upload** (Multer) – shop photos stored in `uploads/` and referenced in DB.
4. **Analytics Dashboard** – live stats (total surveys, average meat price, rating distribution, etc.).
5. **Export CSV** – one‑click download of the entire `surveys` table.
6. **Responsive glass‑morphism UI** with Kannada translations.

## 5️⃣ Database Schema (critical columns)
```sql
CREATE TABLE surveys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  country VARCHAR(100) DEFAULT 'India',
  state   VARCHAR(100) DEFAULT 'Karnataka',
  district VARCHAR(100) NOT NULL,
  taluk   VARCHAR(150) DEFAULT '',
  village VARCHAR(255) DEFAULT '',
  place   VARCHAR(255) NOT NULL,
  pincode VARCHAR(20) NOT NULL,
  shop_name VARCHAR(255) NOT NULL,
  owner_name VARCHAR(255) NOT NULL,
  ... other business fields ...,
  location_link TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  shop_images JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
> All new columns (`country`, `state`, `taluk`, `village`) were added via an `ALTER TABLE` migration and reflected in the code.

## 6️⃣ Development Workflow (What you run locally)
```bash
# Backend
cd backend && npm install && npm start   # http://localhost:5001

# Frontend
cd ../frontend && npm install && npm run dev   # http://localhost:5173
```
- **Hot reload**: changes in `src/` instantly refresh the browser.
- **Run tests** (if any): `npm test` inside each folder.
- **Lint**: `npm run lint`.

## 7️⃣ CI/CD Process
1. **Push** to `main` → GitHub Action `deploy.yml` fires.
2. Action SSH‑connects to the VPS (using secrets `VPS_HOST`, `VPS_USER`, `VPS_PASSWORD`).
3. Runs `git pull`, `npm ci`, `npm run build` (frontend) and restarts PM2.
4. Deploy completes in < 1 minute; you can verify by refreshing the live URL.

## 8️⃣ Testing Checklist Before Going Live
- [ ] `npm run build` succeeds (no compile errors).
- [ ] API `POST /api/surveys` stores a record (verify via MySQL query).
- [ ] Pincode auto‑fill works for multiple pincodes (e.g., 562123, 560051, 577201).
- [ ] CSV export returns a valid file.
- [ ] Dashboard charts display correct numbers.
- [ ] Daily backup cron job is active (`crontab -l`).

---

*Keep this file in your repository root as `DEVELOPMENT_PLAN.md` for future reference.*
