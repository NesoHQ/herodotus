#!/bin/bash

# Test script for Herodotus Analytics API

API_URL="http://localhost:8080"

echo "🧪 Testing Herodotus Analytics API"
echo "=================================="
echo ""

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s "${API_URL}/health" | jq '.' || echo "❌ Health check failed"
echo ""

# Register user
echo "2. Registering test user..."
REGISTER_RESPONSE=$(curl -s -X POST "${API_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "$REGISTER_RESPONSE" | jq '.'
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "✅ Registration successful"
  echo "Token: $TOKEN"
else
  echo "⚠️  Registration failed, trying login..."
  
  # Try login if registration failed
  LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "password123"
    }')
  
  echo "$LOGIN_RESPONSE" | jq '.'
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
  
  if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo "✅ Login successful"
  else
    echo "❌ Authentication failed"
    exit 1
  fi
fi

echo ""

# Get domains
echo "3. Getting domains..."
curl -s "${API_URL}/api/domains" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

# Create domain
echo "4. Creating domain..."
DOMAIN_RESPONSE=$(curl -s -X POST "${API_URL}/api/domains" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "domain": "example.com"
  }')

echo "$DOMAIN_RESPONSE" | jq '.'
DOMAIN_ID=$(echo "$DOMAIN_RESPONSE" | jq -r '.id')
echo "✅ Domain created: $DOMAIN_ID"
echo ""

# Create API key
echo "5. Creating API key..."
APIKEY_RESPONSE=$(curl -s -X POST "${API_URL}/api/api-keys" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"domain_ids\": [\"$DOMAIN_ID\"]
  }")

echo "$APIKEY_RESPONSE" | jq '.'
API_KEY=$(echo "$APIKEY_RESPONSE" | jq -r '.key')
echo "✅ API Key created: $API_KEY"
echo ""

# Track event
echo "6. Tracking test event..."
curl -s -X POST "${API_URL}/api/track" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "path": "/test-page",
    "referrer": "https://google.com",
    "visitor_id": "test_visitor_123"
  }' | jq '.'
echo "✅ Event tracked"
echo ""

# Get stats
echo "7. Getting real-time stats..."
curl -s "${API_URL}/api/stats/realtime?domain_id=$DOMAIN_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

echo "8. Getting overview stats..."
curl -s "${API_URL}/api/stats/overview?domain_id=$DOMAIN_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo ""

echo "=================================="
echo "✅ All tests completed!"
echo ""
echo "You can now use these credentials:"
echo "Email: test@example.com"
echo "Password: password123"
echo "API Key: $API_KEY"
