// InsuSafe ESP32 Firmware
// Reads DS18B20 temperature, BME280 humidity, and battery level
// Sends data via WiFi to backend API and publishes to Hedera

#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Adafruit_BME280.h>
#include <ArduinoJson.h>

// WiFi Configuration
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
const char* apiEndpoint = "https://your-app.vercel.app/api/device-data";
const char* deviceId = "DEVICE_001"; // Unique device identifier

// Pin Configuration
#define ONE_WIRE_BUS 4        // DS18B20 on GPIO4
#define BATTERY_PIN 34        // Battery voltage on ADC pin
#define PELTIER_PIN 5         // Peltier control pin
#define FAN_PIN 18            // Fan control pin

// Sensor Objects
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);
Adafruit_BME280 bme280;

// Device State
struct DeviceData {
  float temperature;
  float humidity;
  float pressure;
  int batteryLevel;
  bool peltierActive;
  unsigned long timestamp;
};

DeviceData currentData;
unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 5000; // Send data every 5 seconds

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\nInsuSafe ESP32 Starting...");
  
  // Initialize pins
  pinMode(PELTIER_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  digitalWrite(PELTIER_PIN, LOW);
  digitalWrite(FAN_PIN, LOW);
  
  // Initialize sensors
  initializeSensors();
  
  // Connect to WiFi
  connectToWiFi();
  
  Serial.println("Setup complete!");
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    connectToWiFi();
  }
  
  // Read sensor data
  readSensorData();
  
  // Control Peltier based on temperature
  controlPeltier();
  
  // Send data to backend
  if (millis() - lastSendTime >= SEND_INTERVAL) {
    sendDataToBackend();
    lastSendTime = millis();
  }
  
  delay(100);
}

void initializeSensors() {
  // Initialize DS18B20
  tempSensor.begin();
  Serial.println("DS18B20 initialized");
  
  // Initialize BME280
  if (!bme280.begin(0x76)) {
    Serial.println("BME280 not found!");
  } else {
    Serial.println("BME280 initialized");
  }
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFailed to connect to WiFi");
  }
}

void readSensorData() {
  // Read temperature from DS18B20
  tempSensor.requestTemperatures();
  currentData.temperature = tempSensor.getTempCByIndex(0);
  
  // Read humidity and pressure from BME280
  currentData.humidity = bme280.readHumidity();
  currentData.pressure = bme280.readPressure() / 100.0F;
  
  // Read battery level (0-100%)
  int rawBattery = analogRead(BATTERY_PIN);
  currentData.batteryLevel = map(rawBattery, 0, 4095, 0, 100);
  
  // Timestamp
  currentData.timestamp = millis();
  
  // Debug output
  Serial.print("Temp: ");
  Serial.print(currentData.temperature);
  Serial.print("C | Humidity: ");
  Serial.print(currentData.humidity);
  Serial.print("% | Battery: ");
  Serial.print(currentData.batteryLevel);
  Serial.println("%");
}

void controlPeltier() {
  // Target temperature: 4°C for insulin storage
  const float TARGET_TEMP = 4.0;
  const float TEMP_TOLERANCE = 0.5;
  
  if (currentData.temperature > TARGET_TEMP + TEMP_TOLERANCE) {
    // Temperature too high, activate Peltier
    digitalWrite(PELTIER_PIN, HIGH);
    digitalWrite(FAN_PIN, HIGH);
    currentData.peltierActive = true;
  } else if (currentData.temperature < TARGET_TEMP - TEMP_TOLERANCE) {
    // Temperature too low, deactivate Peltier
    digitalWrite(PELTIER_PIN, LOW);
    digitalWrite(FAN_PIN, LOW);
    currentData.peltierActive = false;
  }
}

void sendDataToBackend() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected, skipping data send");
    return;
  }
  
  HTTPClient http;
  
  // Create JSON payload
  StaticJsonDocument<256> doc;
  doc["deviceId"] = deviceId;
  doc["temperature"] = currentData.temperature;
  doc["humidity"] = currentData.humidity;
  doc["pressure"] = currentData.pressure;
  doc["batteryLevel"] = currentData.batteryLevel;
  doc["peltierActive"] = currentData.peltierActive;
  doc["timestamp"] = currentData.timestamp;
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Send POST request
  http.begin(apiEndpoint);
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String response = http.getString();
    Serial.println(response);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  
  http.end();
}
