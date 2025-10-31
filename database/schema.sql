-- Device table
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  serial_number VARCHAR(100) UNIQUE NOT NULL,
  hedera_topic_id VARCHAR(100),
  hedera_account_id VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Device readings table
CREATE TABLE device_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(50) NOT NULL,
  temperature DECIMAL(5, 2) NOT NULL,
  humidity DECIMAL(5, 2) NOT NULL,
  pressure DECIMAL(7, 2),
  battery_level INTEGER NOT NULL,
  peltier_active BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

-- Device locations table (for geolocation tracking)
CREATE TABLE device_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(50) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(7, 2),
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(device_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_device_readings_device_id ON device_readings(device_id);
CREATE INDEX idx_device_readings_timestamp ON device_readings(timestamp DESC);
CREATE INDEX idx_device_locations_device_id ON device_locations(device_id);
CREATE INDEX idx_devices_user_id ON devices(user_id);
