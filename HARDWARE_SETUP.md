# InsuSafe Hardware Setup Guide

## ESP32 Firmware Installation

### Prerequisites
- Arduino IDE or PlatformIO
- ESP32 development board
- USB cable for programming
- Required libraries:
  - OneWire
  - DallasTemperature
  - Adafruit BME280
  - ArduinoJson

### Step 1: Install Arduino IDE
1. Download Arduino IDE from https://www.arduino.cc/en/software
2. Install ESP32 board support:
   - Go to File → Preferences
   - Add this URL to "Additional Boards Manager URLs":
     \`\`\`
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     \`\`\`
   - Go to Tools → Board → Boards Manager
   - Search for "ESP32" and install

### Step 2: Install Required Libraries
1. Go to Sketch → Include Library → Manage Libraries
2. Search and install:
   - OneWire (by Jim Studt)
   - DallasTemperature (by Miles Burton)
   - Adafruit BME280 (by Adafruit)
   - ArduinoJson (by Benoit Blanchon)

### Step 3: Configure WiFi Credentials
Edit the firmware file and update:
\`\`\`cpp
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
const char* apiEndpoint = "https://your-app.vercel.app/api/device-data";
const char* deviceId = "DEVICE_001";
\`\`\`

### Step 4: Upload Firmware
1. Connect ESP32 to computer via USB
2. Select Tools → Board → ESP32 Dev Module
3. Select the correct COM port
4. Click Upload
5. Wait for "Leaving... Hard resetting via RTS pin" message

### Step 5: Verify Connection
1. Open Serial Monitor (Tools → Serial Monitor)
2. Set baud rate to 115200
3. You should see:
   \`\`\`
   InsuSafe ESP32 Starting...
   DS18B20 initialized
   BME280 initialized
   Connecting to WiFi: YOUR_SSID
   WiFi connected!
   IP address: 192.168.x.x
   \`\`\`

## Hardware Connections

### Pin Configuration
\`\`\`
DS18B20 Temperature Sensor:
  - Data pin → GPIO 4
  - VCC → 3.3V
  - GND → GND
  - 4.7kΩ pull-up resistor between Data and VCC

BME280 Humidity/Pressure Sensor:
  - SDA → GPIO 21 (I2C)
  - SCL → GPIO 22 (I2C)
  - VCC → 3.3V
  - GND → GND

Peltier Module (TEC1-12706):
  - Positive → GPIO 5 (via MOSFET)
  - Negative → GND

Fan:
  - Positive → GPIO 18 (via MOSFET)
  - Negative → GND

Battery Voltage Monitor:
  - Analog input → GPIO 34 (ADC)
  - Voltage divider: Battery → 100kΩ → GPIO 34 → 100kΩ → GND
\`\`\`

## Testing the Device

### Test 1: Sensor Readings
1. Open Serial Monitor
2. Verify temperature readings from DS18B20
3. Verify humidity readings from BME280
4. Check battery level calculation

### Test 2: WiFi Connection
1. Verify WiFi connection in Serial Monitor
2. Check IP address assignment
3. Test with different WiFi networks

### Test 3: API Communication
1. Monitor Serial output for HTTP responses
2. Check backend API logs for incoming data
3. Verify data is being stored correctly

### Test 4: Peltier Control
1. Monitor temperature readings
2. Verify Peltier activates when temp > 4.5°C
3. Verify Peltier deactivates when temp < 3.5°C
4. Check fan operation

## Troubleshooting

### Device Not Connecting to WiFi
- Verify SSID and password are correct
- Check WiFi signal strength
- Restart ESP32
- Check Serial Monitor for error messages

### Sensor Not Reading
- Verify pin connections
- Check pull-up resistor for DS18B20
- Verify I2C address for BME280 (default 0x76)
- Check Serial Monitor for initialization messages

### API Not Receiving Data
- Verify API endpoint URL is correct
- Check internet connectivity
- Verify JSON payload format
- Check backend API logs

### Peltier Not Activating
- Verify GPIO pins are correct
- Check MOSFET connections
- Verify power supply to Peltier module
- Check temperature threshold values

## Production Deployment

### Before Going Live
1. Test all sensors in various conditions
2. Verify battery life (target: 48+ hours)
3. Test thermal performance
4. Verify Hedera integration
5. Load test the backend API

### Security Considerations
1. Use HTTPS for API communication
2. Implement API authentication
3. Encrypt WiFi credentials in firmware
4. Use secure Hedera wallet integration
5. Implement rate limiting on API endpoints
