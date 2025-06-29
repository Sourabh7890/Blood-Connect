# Blood Connect - Complete Setup Instructions

## Step 1: Set Up Supabase Database

### 1. Create Supabase Account & Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Choose your organization
4. Enter project name: "blood-connect"
5. Enter a strong database password
6. Select a region close to you
7. Click "Create new project"

### 2. Get Your Project Credentials
Once your project is created:
1. Go to Settings → API
2. Copy these values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### 3. Create Environment File
Create a `.env` file in your project root with:
```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Run Database Migration
1. In your Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Copy and paste the SQL code from `supabase/migrations/20250629131305_nameless_garden.sql`
4. Click "Run" to execute the SQL
5. You should see "Success. No rows returned" message

### 5. Fix RLS Policies for Registration
**IMPORTANT**: After running the initial setup, run this additional SQL:

1. Go back to "SQL Editor" in your Supabase dashboard
2. Click "New Query"
3. Copy and paste the SQL code from `supabase/migrations/20250629131306_fix_rls_policies.sql`
4. Click "Run" to execute this SQL
5. You should see "Success. No rows returned" message

### 6. Disable Email Confirmation (Optional but Recommended for Testing)
1. In your Supabase dashboard, go to "Authentication" → "Settings"
2. Scroll down to "Email Auth"
3. **Uncheck** "Enable email confirmations"
4. Click "Save"

This allows users to register and login immediately without email verification.

## Step 2: Install Dependencies and Start the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Open Your Browser
Navigate to `http://localhost:5173`

## Step 3: Test the Application

### Test Registration:
1. Go to the registration page
2. Try registering with:
   - **Name**: `John Doe` (letters only, at least 2 characters)
   - **Email**: `john@gmail.com` (valid email format)
   - **Password**: `Password123!` (uppercase, lowercase, number, special character)
   - **Phone**: `1234567890` (exactly 10 digits)
   - **Blood Type**: Select any type
   - **Address**: `123 Main St, City, State`

### Test Login:
1. Use the same credentials you registered with
2. Should login successfully and redirect to appropriate dashboard

## Features Implemented:

### ✅ Complete Validation System:
- **Email**: Must be valid format (e.g., sourabh@gmail.com)
- **Phone**: Must be exactly 10 digits
- **Password**: Must contain uppercase, lowercase, number, and special character
- **Name**: Must be at least 2 characters, letters only
- **Address**: Required field

### ✅ Real Database Integration:
- All user data is stored in Supabase
- Real-time authentication
- Proper user profiles with all fields
- Blood type matching for donors/recipients

### ✅ User Management:
- Registration with role selection (donor/recipient)
- Login/logout functionality
- Profile management with validation
- Password visibility toggle

### ✅ Blood Donation Features:
- Donor dashboard with donation tracking
- Recipient dashboard with blood search
- Real donor search by blood type
- Blood request management

### ✅ Security:
- Row Level Security (RLS) policies
- Proper authentication flow
- Secure password handling
- Data validation on both frontend and backend

## Database Tables Created:

1. **users**: Stores all user profiles (donors, recipients, admins)
2. **blood_requests**: Stores blood requests from recipients
3. **donations**: Stores donation history for donors

## Troubleshooting:

### If Registration Fails:
1. Check browser console (F12) for error messages
2. Verify `.env` file has correct Supabase credentials
3. Ensure both SQL migrations were run successfully
4. Check that email confirmation is disabled in Supabase settings

### If Login Fails:
1. Verify the user was created successfully in Supabase dashboard
2. Check "Authentication" → "Users" to see registered users
3. Ensure password meets all requirements

### If Search Shows No Results:
1. Register some donors first with different blood types
2. The search shows real data from the database
3. Try different blood types to see results

## Production Deployment:

When deploying to production:
1. Enable email confirmation in Supabase settings
2. Set up proper domain configuration
3. Update environment variables for production
4. Consider implementing additional security measures

Your Blood Connect application is now fully functional with real database integration!