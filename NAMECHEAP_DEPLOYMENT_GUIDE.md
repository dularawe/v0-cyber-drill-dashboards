# Cyber Drill Dashboards - Deployment on Namecheap cPanel (No SSH)

## OVERVIEW
- **Backend:** Node.js app on Namecheap cPanel using Node.js app manager
- **Frontend:** Next.js on Vercel
- **Database:** MySQL on Namecheap cPanel
- **Domain:** Single domain with subdomain routing

---

## PART 1: BACKEND DEPLOYMENT (cPanel Node.js App Manager)

### Step 1: Prepare Backend for Upload

1. **Clone/Download the backend code** locally if you don't have it
2. **Create a production build:**
   ```bash
   cd backend
   npm install
   npm run build
   ```

3. **Create .env file for production:**
   ```
   # Database
   DB_HOST=localhost
   DB_USER=your_cpanel_db_user
   DB_PASSWORD=your_cpanel_db_password
   DB_NAME=your_cpanel_db_name
   
   # Server
   PORT=5000
   NODE_ENV=production
   
   # JWT (generate a secure random string)
   JWT_SECRET=your_super_secure_random_string_here
   
   # CORS
   CORS_ORIGIN=https://yourdomain.com
   ```

4. **Compress the backend folder:**
   - Select `backend` folder
   - Right-click → Compress as ZIP
   - Name it `cyber-drill-backend.zip`

### Step 2: Upload Backend via cPanel File Manager

1. **Login to Namecheap cPanel:**
   - Go to cPanel dashboard
   - Click "File Manager"

2. **Navigate to public_html folder:**
   - You should see `public_html` and `public_html/node_app`
   - Create new folder called `api` inside `public_html`

3. **Upload backend ZIP file:**
   - Click "Upload Files" button
   - Select `cyber-drill-backend.zip`
   - Wait for upload to complete

4. **Extract the ZIP file:**
   - Right-click on `cyber-drill-backend.zip`
   - Click "Extract"
   - Choose destination as current folder
   - Click "Extract File(s)"

5. **Wait for extraction** (may take a few minutes)

### Step 3: Setup Node.js App in cPanel

1. **Go to cPanel → Node.js Applications**
   - Or search for "Node.js" in cPanel search bar

2. **Click "Create Application":**
   - **Node.js version:** Select latest (18.x or 20.x)
   - **Application name:** `cyber-drill-api`
   - **Application path:** `/home/yourusername/public_html/api/backend` (adjust path based on where you extracted)
   - **Application startup file:** `dist/server.js`
   - **Application URL:** Select your domain
   - **Port:** 5000

3. **Click "Create"**

4. **cPanel will automatically:**
   - Install npm packages
   - Build your application
   - Start the Node.js application
   - Set up reverse proxy

### Step 4: Verify Backend is Running

1. **In Node.js Applications section**, you should see your app with status "Running"

2. **Test API connection:**
   - Open browser
   - Visit `https://api.yourdomain.com/api/sessions` (or your API endpoint)
   - Should see JSON response or {"message": "OK"}

3. **If not working:**
   - Check error logs in Node.js app section
   - Verify .env file exists with correct database credentials
   - Restart the application

### Step 5: Update Environment Variables in cPanel

1. **Go to Node.js Applications section**
2. **Click your app → Edit**
3. **Click "Environment Variables"**
4. **Add variables:**
   - `DB_HOST` = localhost
   - `DB_USER` = your database user
   - `DB_PASSWORD` = your database password
   - `DB_NAME` = your database name
   - `JWT_SECRET` = secure random string
   - `CORS_ORIGIN` = https://yourdomain.com

5. **Click Save and Restart Application**

---

## PART 2: DATABASE SETUP (cPanel MySQL)

### Step 1: Create Database in cPanel

1. **Go to cPanel → MySQL Databases**
2. **Create New Database:**
   - Database name: `cyber_drill_db`
   - Click "Create Database"

3. **Create New User:**
   - Username: `cyber_drill_user`
   - Password: Generate strong password
   - Click "Create User"

4. **Add User to Database:**
   - Select user and database
   - Check "ALL PRIVILEGES"
   - Click "Add User to Database"

### Step 2: Import Database Schema

1. **In cPanel → MySQL Databases**
2. **Click "phpMyAdmin"**
3. **Select your database** from left sidebar
4. **Click "Import" tab**
5. **Upload your schema.sql file:**
   - Click "Choose File"
   - Select `backend/database/schema.sql`
   - Click "Import"

6. **Wait for import to complete**

### Step 3: Verify Database

1. **In phpMyAdmin, check tables exist:**
   - Should see: sessions, users, questions, leaderboard, etc.
   - Click each table to verify data

---

## PART 3: FRONTEND DEPLOYMENT (Vercel)

### Step 1: Prepare Frontend Code

1. **Update environment variables for production:**
   - Edit `.env.production` file:
   ```
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://yourdomain.com
   ```

2. **Update next.config.mjs** for API routing:
   ```javascript
   const nextConfig = {
     reactCompiler: true,
     async rewrites() {
       return {
         beforeFiles: [
           {
             source: '/api/:path*',
             destination: 'https://api.yourdomain.com/:path*',
           },
         ],
       };
     },
   };
   export default nextConfig;
   ```

### Step 2: Push to GitHub

1. **Initialize Git (if not already):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vercel deployment"
   ```

2. **Create GitHub repository**

3. **Push code:**
   ```bash
   git remote add origin https://github.com/yourusername/cyber-drill-frontend.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy on Vercel

1. **Go to https://vercel.com**
2. **Sign up with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure:**
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

6. **Add Environment Variables:**
   - `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
   - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://yourdomain.com`

7. **Click "Deploy"**

### Step 4: Connect Custom Domain to Vercel

1. **In Vercel project settings → Domains**
2. **Add your domain** (e.g., yourdomain.com)
3. **Add DNS records** as shown:
   - Type: CNAME
   - Name: (empty or @)
   - Value: `cname.vercel-dns.com`

4. **Update Namecheap DNS records:**
   - Login to Namecheap account
   - Go to Domain settings
   - Update Name Servers or A records to point to Vercel

5. **Wait 5-15 minutes for propagation**

---

## PART 4: CONFIGURE DOMAIN ROUTING

### Option A: Subdomain Routing (RECOMMENDED)

**Setup:**
- `yourdomain.com` → Vercel (frontend)
- `api.yourdomain.com` → Namecheap cPanel (backend)

**Steps:**
1. **In Namecheap DNS settings, add CNAME record:**
   ```
   Host: api
   Type: CNAME
   Value: yourdomain.com
   TTL: 3600
   ```

2. **In cPanel Node.js app, set URL to:**
   - `api.yourdomain.com`

3. **In Vercel, add both domains:**
   - yourdomain.com (main)
   - www.yourdomain.com (alias)

4. **Update frontend .env:**
   ```
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   ```

### Option B: Path Routing

**Setup:**
- `yourdomain.com/*` → Vercel (frontend)
- `yourdomain.com/api/*` → Namecheap cPanel (backend)

**Steps:**
1. **In cPanel Node.js app, set Application URL to custom path**
2. **In Vercel next.config.mjs, add rewrite:**
   ```javascript
   rewrites() {
     return {
       beforeFiles: [
         {
           source: '/api/:path*',
           destination: 'https://yourdomain.com/api/:path*',
         },
       ],
     };
   }
   ```

---

## PART 5: TESTING & VERIFICATION

### Test Backend API
```bash
# Test sessions endpoint
curl https://api.yourdomain.com/api/sessions

# Test login
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Test Frontend
1. Visit `https://yourdomain.com`
2. Should load Next.js app
3. Try to login
4. Should connect to backend successfully

### Check Database
1. In cPanel → phpMyAdmin
2. View your database tables
3. Verify users table has login records

---

## PART 6: UPDATES & MAINTENANCE (No SSH)

### Update Backend Code

1. **Modify code locally:**
   ```bash
   cd backend
   npm run build
   ```

2. **Create ZIP file of updated backend**

3. **In cPanel File Manager:**
   - Navigate to api/backend folder
   - Delete old files (keep node_modules and .env)
   - Upload new files

4. **In cPanel Node.js app:**
   - Click "Restart"
   - App will automatically restart with new code

### Update Frontend Code

1. **Push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```

2. **Vercel automatically redeploys** (5-10 minutes)

---

## PART 7: TROUBLESHOOTING

### Backend Not Starting
**Check:**
- In cPanel Node.js Applications, click app to view error logs
- Verify .env file has correct database credentials
- Check database is running and accessible
- Verify port 5000 is available

**Fix:**
- Update .env with correct values
- Click "Restart" in cPanel
- Wait 2-3 minutes for restart

### Cannot Connect to Database
**Check in cPanel:**
- MySQL Databases section shows database exists
- Database user has ALL PRIVILEGES
- Credentials in .env match database user credentials
- Database name is spelled correctly

**Fix:**
- Re-create database and user if needed
- Update .env
- Restart Node.js app

### Frontend Cannot Reach Backend API
**Check:**
- Backend is running (test URL in browser)
- `NEXT_PUBLIC_API_URL` is set correctly
- CORS settings allow frontend domain
- Domain DNS is propagated (wait 15+ minutes)

**Fix:**
- Verify backend is running in cPanel
- Check .env variables in backend
- Wait for DNS propagation
- Restart backend app

### Custom Domain Not Working
**Check:**
- In Namecheap, verify DNS records are added
- In Vercel, domain shows "Valid"
- Wait for full DNS propagation (can take 24 hours)

**Fix:**
- Manually verify DNS with: `nslookup yourdomain.com`
- Check if using Nameservers or A records in Namecheap
- May need to wait full 24 hours for propagation

---

## PRODUCTION CHECKLIST

- [ ] Node.js app running in cPanel
- [ ] Database created and schema imported
- [ ] Backend API responding at api.yourdomain.com
- [ ] Frontend deployed on Vercel
- [ ] Custom domain configured in Vercel
- [ ] DNS records added to Namecheap
- [ ] Environment variables set in both cPanel and Vercel
- [ ] API calls working from frontend to backend
- [ ] Login functionality tested
- [ ] Database backups configured in cPanel
- [ ] SSL certificates enabled (automatic on Vercel, check cPanel)
- [ ] Team members have cPanel/Vercel access for updates

---

## IMPORTANT NOTES

✅ **What works without SSH:**
- Upload files via File Manager
- Create/manage Node.js apps
- View error logs
- Restart applications
- Manage databases in phpMyAdmin
- Update environment variables

⚠️ **Limitations without SSH:**
- Cannot run npm commands directly
- Cannot view live application logs in real-time
- Cannot do advanced debugging
- Cannot install system packages

🔧 **If you need SSH later:**
- Contact Namecheap support to enable SSH
- Use PuTTY or Terminal to connect
- Much faster deployment and debugging
