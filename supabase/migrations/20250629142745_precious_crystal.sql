/*
  # Initial Schema for Blood Connect Application

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches Supabase auth.users id
      - `email` (text, unique)
      - `name` (text)
      - `role` (text) - donor, recipient, admin
      - `blood_type` (text) - A+, A-, B+, B-, AB+, AB-, O+, O-
      - `phone` (text)
      - `address` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `status` (text) - active, inactive, pending
      - `last_donation` (date)
      - `donation_count` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `blood_requests`
      - `id` (uuid, primary key)
      - `recipient_id` (uuid, foreign key to users)
      - `blood_type` (text)
      - `urgency` (text) - normal, urgent, emergency
      - `patient_name` (text)
      - `hospital` (text)
      - `details` (text)
      - `status` (text) - active, completed, expired
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `donations`
      - `id` (uuid, primary key)
      - `donor_id` (uuid, foreign key to users)
      - `date` (date)
      - `location` (text)
      - `blood_amount` (integer) - in ml
      - `status` (text) - completed, cancelled
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('donor', 'recipient', 'admin')),
  blood_type text CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  phone text,
  address text,
  latitude numeric,
  longitude numeric,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  last_donation date,
  donation_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blood_requests table
CREATE TABLE IF NOT EXISTS blood_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blood_type text NOT NULL CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  urgency text NOT NULL DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent', 'emergency')),
  patient_name text NOT NULL,
  hospital text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  location text NOT NULL,
  blood_amount integer NOT NULL DEFAULT 450,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Anyone can insert user profile during registration" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read donor profiles" ON users
  FOR SELECT USING (role = 'donor' OR auth.uid() = id);

CREATE POLICY "Authenticated users can read user profiles" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for blood_requests table
CREATE POLICY "Recipients can manage own requests" ON blood_requests
  FOR ALL USING (auth.uid() = recipient_id);

CREATE POLICY "Authenticated users can read active requests" ON blood_requests
  FOR SELECT USING (status = 'active' AND auth.role() = 'authenticated');

-- Create policies for donations table
CREATE POLICY "Donors can manage own donations" ON donations
  FOR ALL USING (auth.uid() = donor_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_blood_type ON users(blood_type);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_blood_requests_blood_type ON blood_requests(blood_type);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blood_requests_updated_at BEFORE UPDATE ON blood_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();