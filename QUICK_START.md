# 🚀 Quick Start Guide

Your Supabase credentials are configured! Follow these steps to get started:

## Step 1: Install Dependencies

```bash
npm install
```

This will install Supabase client and all other dependencies.

## Step 2: Set Up Database Tables

**IMPORTANT**: You must run the database schema in Supabase before the app will work.

1. Open your Supabase dashboard: https://app.supabase.com/project/sqibkguqftnndtefqbnu
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the file `database/schema.sql` in this project
5. Copy **ALL** the SQL code and paste it into the Supabase SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned" - this means the tables were created!

The schema creates:
- ✅ `packages` table (for travel packages)
- ✅ `cars` table (for car rentals)
- ✅ `contact_messages` table (for contact form)
- ✅ Security policies (Row Level Security)
- ✅ Sample data (3 packages, 3 cars)

## Step 3: Configure Authentication (Quick Setup)

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Set **Site URL**: `http://localhost:5173`
3. Add to **Redirect URLs**: `http://localhost:5173/**`
4. (Optional for development) Disable email confirmation:
   - Go to **Authentication** → **Providers** → **Email**
   - Toggle OFF "Confirm email" (for development only)

## Step 4: Start the Development Server

```bash
npm run dev
```

Your app will be available at: **http://localhost:5173**

## ✅ Verify Everything Works

1. **Test Home Page**: Visit `/` - should show featured packages and cars
2. **Test Authentication**: 
   - Go to `/register` and create an account
   - Log in at `/login`
   - Check Supabase → Authentication → Users to see your account
3. **Test CMS**:
   - Go to `/cms` (requires login)
   - Try adding a new package or car
   - Check Supabase → Table Editor to see the data
4. **Test Contact Form**:
   - Go to `/contact` and submit a message
   - Check `contact_messages` table in Supabase

## 🔗 Useful Links

- **Your Supabase Project**: https://app.supabase.com/project/sqibkguqftnndtefqbnu
- **SQL Editor**: https://app.supabase.com/project/sqibkguqftnndtefqbnu/sql
- **Table Editor**: https://app.supabase.com/project/sqibkguqftnndtefqbnu/editor
- **Authentication**: https://app.supabase.com/project/sqibkguqftnndtefqbnu/auth/users

## 🐛 Common Issues

**"Invalid API key" error**
- Make sure `.env` file exists with correct values
- Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

**"relation does not exist" error**
- You need to run the SQL schema first (Step 2)
- Check that tables exist in Supabase → Table Editor

**Can't create account/login**
- Check Supabase → Authentication → Settings → Site URL is set
- Verify Redirect URLs include `http://localhost:5173/**`

---

**That's it!** You're ready to build! 🎉



