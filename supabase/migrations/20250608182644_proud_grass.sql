/*
  # Initial REVOA Database Schema

  1. New Tables
    - `profiles` - User profiles with role-based access
    - `properties` - Property listings with all details
    - `property_images` - Property image storage
    - `subscriptions` - Premium subscription tracking
    - `property_amenities` - Property amenities junction table
    - `amenities` - Available amenities list

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure property management for owners only
    - Admin access to all data

  3. Functions
    - Handle user registration with profile creation
    - Manage subscription status updates
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('guest', 'owner', 'admin');
CREATE TYPE property_type AS ENUM ('apartment', 'house', 'villa', 'studio', 'loft');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'cancelled', 'expired');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  role user_role DEFAULT 'guest',
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id text UNIQUE,
  status subscription_status DEFAULT 'inactive',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Amenities table
CREATE TABLE IF NOT EXISTS amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  price_per_night integer NOT NULL,
  property_type property_type NOT NULL,
  bedrooms integer DEFAULT 1,
  bathrooms integer DEFAULT 1,
  max_guests integer DEFAULT 2,
  address text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Property images table
CREATE TABLE IF NOT EXISTS property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Property amenities junction table
CREATE TABLE IF NOT EXISTS property_amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id uuid REFERENCES amenities(id) ON DELETE CASCADE,
  UNIQUE(property_id, amenity_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions"
  ON subscriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Amenities policies
CREATE POLICY "Amenities are viewable by everyone"
  ON amenities FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage amenities"
  ON amenities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Properties policies
CREATE POLICY "Properties are viewable by everyone"
  ON properties FOR SELECT
  USING (true);

CREATE POLICY "Owners can manage own properties"
  ON properties FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all properties"
  ON properties FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Property images policies
CREATE POLICY "Property images are viewable by everyone"
  ON property_images FOR SELECT
  USING (true);

CREATE POLICY "Property owners can manage their property images"
  ON property_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE id = property_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all property images"
  ON property_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Property amenities policies
CREATE POLICY "Property amenities are viewable by everyone"
  ON property_amenities FOR SELECT
  USING (true);

CREATE POLICY "Property owners can manage their property amenities"
  ON property_amenities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE id = property_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all property amenities"
  ON property_amenities FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert default amenities
INSERT INTO amenities (name, icon) VALUES
  ('WiFi', 'wifi'),
  ('Parking', 'car'),
  ('Air Conditioning', 'snowflake'),
  ('Kitchen', 'chef-hat'),
  ('Pool', 'waves'),
  ('Gym', 'dumbbell'),
  ('Beach Access', 'umbrella'),
  ('Hot Tub', 'bath'),
  ('Fireplace', 'flame'),
  ('Mountain View', 'mountain'),
  ('Laundry', 'washing-machine'),
  ('Historic Building', 'landmark')
ON CONFLICT (name) DO NOTHING;