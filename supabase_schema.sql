-- SmartAgri Database Schema for Supabase / PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Farms Table
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL DEFAULT 'My Smart Farm',
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Selected Crops Table
CREATE TABLE IF NOT EXISTS crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    crop_id VARCHAR(100) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    planting_date DATE,
    growth_stage VARCHAR(50) DEFAULT 'Vegetative',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Sensor Readings Table (Raspberry Pi & Simulated telemetry)
CREATE TABLE IF NOT EXISTS sensor_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    soil_moisture NUMERIC(5,2) NOT NULL,
    temperature NUMERIC(5,2) NOT NULL,
    humidity NUMERIC(5,2) NOT NULL,
    light NUMERIC(8,2) NOT NULL,
    water_level NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Camera Images Table
CREATE TABLE IF NOT EXISTS camera_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    storage_path TEXT,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Crop Disease Analysis Table
CREATE TABLE IF NOT EXISTS crop_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_id UUID REFERENCES camera_images(id) ON DELETE CASCADE,
    detected_crop VARCHAR(100),
    condition VARCHAR(50) NOT NULL,
    possible_disease VARCHAR(150),
    confidence NUMERIC(5,2),
    severity VARCHAR(50),
    symptoms JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL,
    action VARCHAR(255) NOT NULL,
    current_value VARCHAR(50),
    ideal_value VARCHAR(50),
    why_it_matters TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. System Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_sensor_readings_created_at ON sensor_readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_camera_images_captured_at ON camera_images(captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_read_status ON alerts(read_status, created_at DESC);
