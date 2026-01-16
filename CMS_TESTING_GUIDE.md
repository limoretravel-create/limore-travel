# 🧪 How to Test the Database via CMS

This guide will walk you through testing the database integration by using the Content Management System (CMS).

## Prerequisites

1. ✅ Development server is running (`npm run dev`)
2. ✅ Database schema has been set up in Supabase
3. ✅ Browser is open at http://localhost:5173

## Step-by-Step Instructions

### Step 1: Register/Login (Required for CMS Access)

1. **Option A: Register a New Account**
   - Go to: http://localhost:5173/register
   - Fill in:
     - Name: Your name
     - Email: your-email@example.com
     - Password: (at least 6 characters)
     - Confirm Password: (same password)
   - Click **"Sign Up"**
   - You'll be redirected to the dashboard

2. **Option B: Login (if you already have an account)**
   - Go to: http://localhost:5173/login
   - Enter your email and password
   - Click **"Sign In"**

### Step 2: Access the CMS

1. Once logged in, you can access the CMS in two ways:
   - **Via Navigation**: Click on "CMS" in the header (if visible)
   - **Direct URL**: Go to http://localhost:5173/cms

### Step 3: Add a New Package

1. In the CMS page, you'll see a form at the top: **"Add New Content"**
2. Fill in the fields:
   - **Title**: Enter a package name (e.g., "Tokyo Adventure")
   - **Type**: Select "Package" from the dropdown
   - **Status**: Choose "Published" or "Draft"
   - Click **"Add"** button
3. The new package will appear in the table below

⚠️ **Note**: The current CMS form only adds basic info. Full details (price, destination, etc.) need to be added via Supabase directly or by expanding the CMS form.

### Step 4: Add a New Car

1. In the same **"Add New Content"** form:
   - **Title**: Enter car name (e.g., "Tesla Model 3")
   - **Type**: Select "Car" from the dropdown
   - **Status**: Choose "Published" or "Draft"
   - Click **"Add"** button
2. The new car will appear in the table

### Step 5: View Your Data in Supabase

1. Open a new tab and go to your Supabase dashboard:
   - https://app.supabase.com/project/sqibkguqftnndtefqbnu/editor
2. In the left sidebar, you'll see your tables:
   - Click on **"packages"** to see travel packages
   - Click on **"cars"** to see car rentals
3. You should see the items you just added!

### Step 6: Edit an Item

1. In the CMS table, find the item you want to edit
2. Click the **pencil icon (Edit)** button
3. Currently, editing is limited - you'd need to edit directly in Supabase Table Editor for full details

### Step 7: Delete an Item

1. In the CMS table, find the item you want to delete
2. Click the **trash icon (Delete)** button
3. Confirm the deletion when prompted
4. The item will be removed from the database
5. Refresh the Supabase Table Editor to see it's gone

### Step 8: Verify Data is Live

1. Go back to the homepage: http://localhost:5173
2. Published packages and cars should appear in the sections
3. Go to http://localhost:5173/packages to see all packages
4. Go to http://localhost:5173/cars to see all cars

## What Each Action Does

| Action | What Happens | Database Impact |
|--------|-------------|-----------------|
| **Add Package** | Creates a new row in `packages` table | New record with status, title, etc. |
| **Add Car** | Creates a new row in `cars` table | New record with status, name, etc. |
| **Edit** | Updates the item (currently limited) | Updates the `updated_at` timestamp |
| **Delete** | Removes the item from database | Permanently deletes the row |
| **Change Status** | Updates published/draft status | Updates the `status` field |

## Full Data Management in Supabase

For complete control, you can also manage data directly in Supabase:

1. Go to: https://app.supabase.com/project/sqibkguqftnndtefqbnu/editor
2. Click on a table (e.g., "packages")
3. Use the **"Insert row"** button to add complete data
4. Click on a row to edit individual fields
5. Click the trash icon to delete rows

## Troubleshooting

### "Navigate to /login" when accessing /cms
- You need to be logged in first
- Go to /register or /login and authenticate

### No data showing in CMS
- Check if database schema was run successfully
- Verify tables exist in Supabase Table Editor
- Check browser console for errors (F12)

### Can't add items
- Make sure you're logged in
- Check browser console for error messages
- Verify Supabase credentials in `.env` are correct

### Items not appearing on homepage
- Make sure status is set to "published" (not "draft")
- Check that database connection is working
- Verify Row Level Security policies are set correctly

## Quick Test Checklist

- [ ] Registered/Logged in successfully
- [ ] Can access /cms page
- [ ] Added a new package via CMS
- [ ] Added a new car via CMS
- [ ] Verified data appears in Supabase Table Editor
- [ ] Deleted an item via CMS
- [ ] Verified deletion in Supabase
- [ ] Published items appear on homepage

---

**That's it!** You've successfully tested the full database integration. 🎉



