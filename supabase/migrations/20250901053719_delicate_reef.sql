/*
  # Employee Management System Database Schema

  1. New Tables
    - `employee_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text)
      - `employee_id` (text, unique)
      - `cadre` (text)
      - `department` (text)
      - `division` (text) - Railway division
      - `designation` (text)
      - `date_of_birth` (date)
      - `date_of_joining` (date)
      - `phone_number` (text)
      - `address` (text)
      - `profile_image_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Storage
    - Create `employee-profiles` bucket for profile images

  3. Security
    - Enable RLS on `employee_profiles` table
    - Add policies for authenticated users to manage their own profiles
    - Set up storage policies for profile images
*/

-- Ensure pgcrypto is available for gen_random_uuid()
create extension if not exists pgcrypto;

-- Create employee_profiles table
CREATE TABLE IF NOT EXISTS employee_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  employee_id text UNIQUE NOT NULL,
  cadre text NOT NULL,
  department text NOT NULL,
  division text NOT NULL,
  designation text NOT NULL,
  date_of_birth date NOT NULL,
  date_of_joining date NOT NULL,
  phone_number text NOT NULL,
  address text NOT NULL,
  profile_image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE employee_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON employee_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON employee_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON employee_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public)
VALUES ('employee-profiles', 'employee-profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own profile images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'employee-profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view profile images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'employee-profiles');

CREATE POLICY "Users can update their own profile images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'employee-profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'employee-profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employee_profiles_user_id ON employee_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_employee_id ON employee_profiles(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_department ON employee_profiles(department);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_division ON employee_profiles(division);