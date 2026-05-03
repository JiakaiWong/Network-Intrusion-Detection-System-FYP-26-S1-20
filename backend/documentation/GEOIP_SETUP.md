# MaxMind GeoIP Setup Guide

This document explains how to set up MaxMind GeoLite2 geolocation lookup for alerts in the IDS backend.

## Overview

The geolocation service automatically enriches alerts with location information from destination IPs. This is useful for:
- Finding the geographic origin of suspicious traffic
- Identifying geographically anomalous connections
- Adding context to Telegram alert notifications

## Setup Steps

### 1. Install the Package

The `geoip2` package has been added to `requirements.txt`. Install it:

```bash
pip install -r requirements.txt
```

### 2. Download MaxMind GeoLite2 Database

MaxMind offers **free GeoLite2 databases** with registration. You have two options:

#### Option A: Manual Download (Easiest for Testing)

1. Go to https://www.maxmind.com/en/geolite2/signup
2. Create a free account and verify your email
3. Download **GeoLite2-City** (MMDB format)
4. Extract the `.mmdb` file

#### Option B: Automated Download Script

Create a script to download the database (requires an API key):

```bash
# Get your license key from MaxMind account
# Then create a download script or use their tools
```

### 3. Place the Database File

Place the downloaded `GeoLite2-City.mmdb` file in the backend directory:

```
backend/
├── geoip/
│   └── GeoLite2-City.mmdb
└── ...
```

### 4. Configure the Path (Optional)

The default path is `geoip/GeoLite2-City.mmdb`. To customize:

```bash
# In your .env file:
GEOIP_DB_PATH=/path/to/your/GeoLite2-City.mmdb
```

Or in your environment:

```bash
export GEOIP_DB_PATH=/path/to/your/GeoLite2-City.mmdb
```

## Usage

Once set up, the alert ingestion automatically:
1. Looks up the destination IP in the GeoIP database
2. Stores location data in the alert (if found):
   ```json
   {
     "dest_ip": "8.8.8.8",
     "dest_location": {
       "country": "US",
       "country_name": "United States",
       "region": "CA",
       "city": "Los Angeles",
       "latitude": 34.0522,
       "longitude": -118.2437,
       "timezone": "America/Los_Angeles",
       "accuracy_radius": 10
     }
   }
   ```
3. Includes location in Telegram notifications:
   ```
   🚨 Alert: Suspicious Traffic from 192.168.1.10 to 8.8.8.8 (Los Angeles, US), severity high
   ```

## How It Works

### Location Lookup

- **Query Types**: Supports IPv4 and IPv6 addresses
- **Private Networks**: Private IPs (10.x.x.x, 192.168.x.x, etc.) return `None` (not found in database)
- **Caching**: The database connection is cached in memory for performance

## Updating Alert Locations

**Geolocation is automatically calculated during alert ingestion**, but you can also update existing alerts:

### API Endpoint: Update Alert
```
PATCH /api/alerts/{alert_id}
```

**Request Body:**
```json
{
  "dest_ip": "5.5.5.5",
  "src_ip": "192.168.1.100",
  "signature": "Updated alert signature",
  "severity": 1
}
```

**Features:**
- ✅ **Automatic geolocation recalculation** when IPs change
- ✅ Updates `dest_location` and `src_location` fields
- ✅ All fields are optional - only send what you want to update
- ✅ Returns updated alert with new location data

**Example:** Change destination IP to German server
```bash
curl -X PATCH http://localhost:8000/api/alerts/69d0ebc6b4e455674ef49753 \
  -H "Content-Type: application/json" \
  -d '{"dest_ip": "5.5.5.5"}'
```

**Response:**
```json
{
  "ok": true,
  "item": {
    "dest_ip": "5.5.5.5",
    "dest_location": {
      "country": "DE",
      "country_name": "Germany",
      "latitude": 51.2993,
      "longitude": 9.491,
      "timezone": "Europe/Berlin"
    }
  }
}
```

## Refreshing Locations

**Geolocation data can be refreshed on-demand to ensure accuracy:**

### Refresh Single Alert Location
```
POST /api/alerts/{alert_id}/refresh-location
```

**Features:**
- ✅ **Recalculates location** for current IPs
- ✅ **Updates stored data** in database
- ✅ **Returns updated alert**

### Refresh All Alert Locations
```
POST /api/alerts/refresh-all-locations
```

**Features:**
- ✅ **Batch refresh** all alerts in database
- ✅ **Returns count** of updated alerts
- ✅ **Fast processing** with database caching

### Frontend Integration

**Alert Details Page:**
- 🔄 **Auto-refresh** location when page loads
- 🗺️ **Manual refresh button** for on-demand updates

**Alerts List Page:**
- 🗺️ **"Refresh Locations" button** to update all alerts
- 📊 **Real-time updates** in the table

**Example:** Auto-refresh on page load ensures location data is always current!

### Alert Fields

Stored alert fields:
- `dest_location`: Full geolocation object for destination IP
- `src_location`: Geolocation for source IP (if publicly routable)

Query by location in MongoDB:
```javascript
// Find alerts from a specific country
db.alerts.find({ "dest_location.country": "CN" })

// Find alerts originating from a specific city
db.alerts.find({ "dest_location.city": "Moscow" })

// Geographic queries (latitude/longitude)
db.alerts.find({
  "dest_location.latitude": { $gt: 34, $lt: 35 },
  "dest_location.longitude": { $gt: -119, $lt: -118 }
})
```

## Performance Considerations

- **Database Size**: ~100-200 MB for the City database
- **Lookup Speed**: ~1-5ms per lookup (memory-resident)
- **Memory Usage**: ~200-300 MB loaded in memory

## Updating the Database

MaxMind releases updated databases monthly. To update:

1. Download the latest GeoLite2-City database
2. Replace the existing `.mmdb` file
3. Restart your backend service

The service will automatically reload the database on next initialization.

## Troubleshooting

### Database Not Found Warning

```
Warning: GeoIP database not found at geoip/GeoLite2-City.mmdb
```

**Solution**: Ensure the database file exists at the configured path

### IP Address Not Found

Private IP ranges will return `None`:
- 10.0.0.0 - 10.255.255.255
- 172.16.0.0 - 172.31.255.255
- 192.168.0.0 - 192.168.255.255
- 127.0.0.1 (localhost)

This is expected behavior.

### Database Connection Issues

Ensure the `.mmdb` file:
- Has read permissions
- Is not corrupted
- Is the correct GeoLite2-City format (not GeoLite2-Country)

## Privacy & Legal

- **Data**: MaxMind GeoLite2 is provided under the Creative Commons Attribution-ShareAlike 4.0 International License
- **Accuracy**: City-level accuracy is ~80% for most regions
- **Updates**: Database updates are released on the first Tuesday of each month

See: https://www.maxmind.com/en/geolite2/release-notes
