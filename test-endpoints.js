// Test file to verify API endpoints
// This file can be used for manual testing of the attendance system

const API_BASE = 'http://localhost:8080/api/v1';

// Test endpoints configuration
const endpoints = {
  // Authentication
  register: `${API_BASE}/auth/register`,
  login: `${API_BASE}/auth/login`,
  
  // Events for attendees
  attendeeEvents: `${API_BASE}/attendee/events`,
  
  // Attendance management
  startAttendance: (eventId) => `${API_BASE}/events/${eventId}/attendance/start`,
  markAttendance: (eventId) => `${API_BASE}/events/${eventId}/attendance/mark`,
  manualOverride: (eventId) => `${API_BASE}/events/${eventId}/attendance/manual-override`,
  
  // Admin endpoints
  events: `${API_BASE}/events`,
  eventDetails: (eventId) => `${API_BASE}/events/${eventId}`,
  venues: `${API_BASE}/venues`,
  groups: `${API_BASE}/groups`,
  users: `${API_BASE}/users`,
};

// Sample test data
const testData = {
  attendanceCode: 'A1B2C3',
  location: {
    latitude: 40.7128,
    longitude: -74.0060
  },
  eventId: 'sample-event-id'
};

console.log('API Endpoints Configuration:');
console.log('============================');
console.log('Attendee Events:', endpoints.attendeeEvents);
console.log('Mark Attendance:', endpoints.markAttendance(testData.eventId));
console.log('Start Attendance:', endpoints.startAttendance(testData.eventId));

console.log('\nExpected API Call for Attendance Marking:');
console.log('==========================================');
console.log('Method: POST');
console.log('URL:', endpoints.markAttendance(testData.eventId));
console.log('Headers: Authorization: Bearer <jwt_token>');
console.log('Body:', JSON.stringify({
  attendanceCode: testData.attendanceCode,
  latitude: testData.location.latitude,
  longitude: testData.location.longitude
}, null, 2));

export { endpoints, testData };
