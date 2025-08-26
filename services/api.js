import apiClient from './apiClient';

// Auth service functions
export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// User service functions (for admin operations)
export const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  },
};

// Venue service functions (admin only)
export const venueService = {
  // Get all venues
  getAllVenues: async () => {
    const response = await apiClient.get('/venues');
    return response.data;
  },

  // Create new venue
  createVenue: async (venueData) => {
    const response = await apiClient.post('/venues', venueData);
    return response.data;
  },

  // Update venue
  updateVenue: async (venueId, venueData) => {
    const response = await apiClient.put(`/venues/${venueId}`, venueData);
    return response.data;
  },

  // Delete venue
  deleteVenue: async (venueId) => {
    const response = await apiClient.delete(`/venues/${venueId}`);
    return response.data;
  },
};

// Group service functions (admin only)
export const groupService = {
  // Get all groups
  getAllGroups: async () => {
    const response = await apiClient.get('/groups');
    return response.data;
  },

  // Create new group
  createGroup: async (groupData) => {
    const response = await apiClient.post('/groups', groupData);
    return response.data;
  },

  // Update group
  updateGroup: async (groupId, groupData) => {
    const response = await apiClient.put(`/groups/${groupId}`, groupData);
    return response.data;
  },

  // Delete group
  deleteGroup: async (groupId) => {
    const response = await apiClient.delete(`/groups/${groupId}`);
    return response.data;
  },

  // Add member to group
  addMember: async (groupId, userId) => {
    const response = await apiClient.post(`/groups/${groupId}/members`, { userId });
    return response.data;
  },

  // Remove member from group
  removeMember: async (groupId, userId) => {
    const response = await apiClient.delete(`/groups/${groupId}/members/${userId}`);
    return response.data;
  },
};

// Event service functions (admin only)
export const eventService = {
  // Get all events
  getAllEvents: async () => {
    const response = await apiClient.get('/events');
    return response.data;
  },

  // Create new event
  createEvent: async (eventData) => {
    const response = await apiClient.post('/events', eventData);
    return response.data;
  },

  // Update event
  updateEvent: async (eventId, eventData) => {
    const response = await apiClient.put(`/events/${eventId}`, eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (eventId) => {
    const response = await apiClient.delete(`/events/${eventId}`);
    return response.data;
  },

  // Get event by ID
  getEventById: async (eventId) => {
    const response = await apiClient.get(`/events/${eventId}`);
    return response.data;
  },
};

// Attendance service functions
export const attendanceService = {
  // Check in to an event
  checkIn: async (eventId, latitude, longitude) => {
    const response = await apiClient.post(`/attendance/checkin`, {
      eventId,
      latitude,
      longitude,
    });
    return response.data;
  },

  // Get attendance for an event
  getEventAttendance: async (eventId) => {
    const response = await apiClient.get(`/attendance/events/${eventId}`);
    return response.data;
  },

  // Get user's attendance history
  getUserAttendance: async () => {
    const response = await apiClient.get('/attendance/my-attendance');
    return response.data;
  },
};
