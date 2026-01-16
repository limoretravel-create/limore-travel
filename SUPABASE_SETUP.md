# Supabase Setup Guide for Limore Travel

This guide will help you set up Supabase as the backend database and authentication system for the Limore Travel website.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. Node.js and npm installed on your machine

## Step 1: Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in your project details:
   - Name: `limore-travel` (or any name you prefer)
   - Database Password: (choose a strong password)
   - Region: (choose the closest region to your users)
4. Click "Create new project" and wait for it to be set up (this takes a few minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll need two values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys" → "anon public")

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and replace the placeholder values with your actual Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `database/schema.sql`
4. Click "Run" to execute the SQL script
5. This will create:
   - `packages` table
   - `cars` table
   - `contact_messages` table
   - Row Level Security (RLS) policies
   - Sample data

## Step 5: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following (optional but recommended):
   - **Site URL**: Your application URL (e.g., `http://localhost:5173` for development)
   - **Redirect URLs**: Add your production and development URLs
   - **Email Auth**: Enabled by default
   - **Email Templates**: Customize if needed

### Disable Email Confirmation (for development)

If you want to skip email confirmation during development:

1. Go to **Authentication** → **Settings** → **Email Auth**
2. Disable "Confirm email"

⚠️ **Note**: In production, you should enable email confirmation for security.

## Step 6: Install Dependencies and Run

1. Install npm packages:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The application should now be connected to Supabase!

## Step 7: Test the Integration

1. **Test Authentication**:
   - Go to `/register` and create a new account
   - Log in at `/login`
   - Check the Supabase dashboard → **Authentication** → **Users** to see the new user

2. **Test Database**:
   - Go to `/cms` (requires authentication)
   - Try adding, editing, or deleting packages/cars
   - Check the Supabase dashboard → **Table Editor** to see the data

3. **Test Contact Form**:
   - Go to `/contact` and submit a message
   - Check the `contact_messages` table in Supabase

## Database Tables

### packages
Stores travel package information:
- `id` (UUID, primary key)
- `title`, `destination`, `duration`
- `price`, `max_travelers`
- `image_url`, `description`
- `status` (published/draft)
- `created_at`, `updated_at`

### cars
Stores car rental information:
- `id` (UUID, primary key)
- `name`, `brand`, `model`
- `price_per_day`, `seats`
- `fuel_type`, `transmission`
- `features` (array)
- `image_url`
- `status` (published/draft)
- `created_at`, `updated_at`

### contact_messages
Stores contact form submissions:
- `id` (UUID, primary key)
- `name`, `email`, `message`
- `created_at`

## Security & Row Level Security (RLS)

The database uses Row Level Security (RLS) with the following policies:

- **Packages & Cars**: 
  - Everyone can read (SELECT)
  - Only authenticated users can create, update, or delete

- **Contact Messages**:
  - Anyone can insert (submit contact form)
  - Only authenticated users can read

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env` file has the correct values
- Ensure you're using the `anon` key, not the `service_role` key
- Restart your development server after changing `.env`

### "relation does not exist" error
- Make sure you've run the SQL schema script in Supabase SQL Editor
- Check that all tables were created successfully

### Authentication not working
- Check that email confirmation is disabled (for development) or check your email
- Verify your Site URL and Redirect URLs in Supabase settings
- Check the browser console for error messages

### Can't access CMS
- Make sure you're logged in
- Check that RLS policies are correctly set up
- Verify your user is authenticated in Supabase dashboard

## Next Steps

1. **Storage**: Set up Supabase Storage for image uploads
2. **Real-time**: Enable real-time subscriptions for live updates
3. **Email**: Configure SMTP settings for email notifications
4. **Backups**: Set up automatic database backups in Supabase
5. **Production**: Deploy your application and update environment variables

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

