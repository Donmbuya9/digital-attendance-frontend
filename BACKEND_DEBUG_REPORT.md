# Backend Debug Report - Location Validation Issue

## **CRITICAL ISSUE IDENTIFIED** 🚨

**Frontend shows "within range" but backend returns 409 error!**

## **Current Situation**

- ✅ Frontend location detection: WORKS
- ✅ Frontend distance calculation: Shows "within range"
- ❌ Backend validation: Returns "You are outside the allowed radius"
- 📍 User coordinates: -6.823500, 39.269500

## **Root Cause Analysis**

### **Hypothesis 1: Data Inconsistency** (Most Likely)

The `/attendee/events` endpoint may return incomplete or different venue data compared to what's stored in the backend database.

**API Contract says attendee events return:**

```json
{
  "venue": {
    "name": "Main Lecture Hall" // Only name, no coordinates!
  }
}
```

**But backend validation needs:**

```json
{
  "venue": {
    "name": "Main Lecture Hall",
    "latitude": -6.8235,
    "longitude": 39.2695,
    "radius": 50
  }
}
```

### **Hypothesis 2: Backend Algorithm Difference**

Our frontend calculation uses different algorithm/precision than backend.

## **Frontend Implementation Details**

### **What We're Sending:**

```javascript
// API Endpoint
POST /api/v1/events/{eventId}/attendance/mark

// Request Body
{
  "attendanceCode": "304-898", // or similar format
  "latitude": -6.823456,       // User's current latitude
  "longitude": 39.269789       // User's current longitude
}

// Headers
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

### **Our Distance Calculation (Frontend)**

```javascript
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Distance in meters
};
```

## **URGENT QUESTIONS for Backend Developer:**

### **1. API Contract vs Implementation**

**CRITICAL**: Does the `/attendee/events` endpoint return complete venue data (lat/lon/radius) or just venue name?

Looking at the API contract, it seems to only return:

```json
"venue": { "name": "Main Lecture Hall" }
```

But for frontend validation, we need:

```json
"venue": {
  "name": "Main Lecture Hall",
  "latitude": -6.823500,
  "longitude": 39.269500,
  "radius": 50
}
```

### **2. Event-Specific Venue Data**

- What are the **exact coordinates** of the venue for event ID `{eventId}`?
- What is the **exact radius** configured for this venue?
- Can you log the venue data when processing our attendance request?

### **3. Backend Validation Debug**

When you receive our request with coordinates `-6.823500, 39.269500`, please log:

```
- Event ID: {eventId}
- Received coordinates: -6.823500, 39.269500
- Venue coordinates from database: ?, ?
- Venue radius from database: ? meters
- Your calculated distance: ? meters
- Validation result: PASS/FAIL with reason
```

### **4. Data Type Validation**

- Are you expecting `latitude` and `longitude` as `Double` or `Float`?
- Do you need any specific precision (decimal places)?
- Are there any coordinate validation rules?

### **5. Test Scenario**

Can you create a test venue with:

- Known coordinates (e.g., -6.8235, 39.2695)
- Large radius (e.g., 1000 meters)
- And test if our request works with those exact coordinates?

## **Frontend Debug Features Added**

1. **Detailed Logging**: Console shows exact coordinates being sent
2. **Test Location**: Option to use venue center coordinates for testing
3. **Distance Display**: Shows calculated distance in frontend
4. **Coordinate Display**: Shows user's exact coordinates in UI

## **Next Steps**

1. **Backend Dev**: Please run our request with debug logging
2. **Frontend**: We'll test with the "test location" feature using venue center coordinates
3. **Compare**: Let's compare our frontend distance calculation with your backend calculation
4. **Identify**: Determine if it's a coordinate precision, algorithm, or data issue

## **Expected Backend Response**

If everything works correctly, we should get:

```json
{
  "message": "Attendance marked successfully."
}
```

Instead, we're getting:

```json
{
  "timestamp": "2025-08-27T...",
  "status": 409,
  "error": "Conflict",
  "message": "You are outside the allowed radius for this venue."
}
```
