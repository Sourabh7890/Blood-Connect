-- Fix RLS policies for proper registration and data access

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can read all donor profiles" ON users;

-- Create more permissive policies for registration and reading
CREATE POLICY "Anyone can insert user profile during registration" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read donor profiles" ON users
  FOR SELECT USING (role = 'donor' OR auth.uid() = id);

-- Also allow reading all user profiles for search functionality
CREATE POLICY "Authenticated users can read user profiles" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Ensure blood requests can be read by donors for matching
DROP POLICY IF EXISTS "Donors can read active requests" ON blood_requests;
CREATE POLICY "Authenticated users can read active requests" ON blood_requests
  FOR SELECT USING (status = 'active' AND auth.role() = 'authenticated');