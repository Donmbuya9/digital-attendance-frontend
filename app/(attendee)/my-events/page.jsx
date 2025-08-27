"use client";

import { useState, useEffect } from "react";
import { attendanceService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function MyEventsPage() {
  const [myEvents, setMyEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogError, setDialogError] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('checking'); // 'checking', 'in-range', 'out-of-range', 'error'
  const [successMessage, setSuccessMessage] = useState(''); // Success message state
  const [markedEvents, setMarkedEvents] = useState(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('markedEvents');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });

  // Utility function to calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Distance in meters
  };

  const fetchMyEvents = async () => {
    try {
      const data = await attendanceService.getMyEvents();
      setMyEvents(data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    if (!selectedEventId || !userLocation) {
      setDialogError('Location is required for attendance marking.');
      return;
    }
    
    console.log('Starting attendance submission for event:', selectedEventId);
    console.log('Attendance code:', code);
    
    setIsSubmitting(true);
    setDialogError('');

    try {
      console.log('Submitting to API with location:', userLocation);
      const response = await attendanceService.markAttendance(
        selectedEventId,
        code,
        userLocation.latitude,
        userLocation.longitude
      );
      
      console.log('Attendance marked successfully:', response);
      
      // Mark this event as completed locally
      setMarkedEvents(prev => {
        const newSet = new Set([...prev, selectedEventId]);
        // Persist to localStorage
        localStorage.setItem('markedEvents', JSON.stringify([...newSet]));
        return newSet;
      });
      
      // Show success message
      setSuccessMessage('Attendance marked successfully!');
      
      // Success! Refresh the events list
      await fetchMyEvents();
      
      // Close the dialog and reset form
      setIsDialogOpen(false);
      setCode('');
      setSelectedEventId(null);
      setSelectedEvent(null);
      setUserLocation(null);
      setLocationStatus('checking');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error("Attendance marking failed:", err);
      setDialogError(err.response?.data?.message || "Failed to mark attendance. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEventActive = (event) => {
    const now = new Date();
    const startTime = new Date(event.startTime);
    // Let's pretend an event is "active" 15 mins before it starts
    return now > new Date(startTime.getTime() - 15 * 60000);
  };

  const openAttendanceDialog = (eventId) => {
    const event = myEvents.find(e => e.id === eventId);
    setSelectedEventId(eventId);
    setSelectedEvent(event);
    setIsDialogOpen(true);
    setDialogError('');
    setCode('');
    setUserLocation(null);
    setLocationStatus('checking');
    
    // Get user location immediately when dialog opens
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          
          // Check if user is in range (note: attendee events may not have venue coordinates)
          if (event?.venue?.latitude && event?.venue?.longitude && event?.venue?.radius) {
            const distance = calculateDistance(
              latitude, 
              longitude, 
              event.venue.latitude, 
              event.venue.longitude
            );
            
            if (distance <= event.venue.radius) {
              setLocationStatus('in-range');
            } else {
              setLocationStatus('out-of-range');
            }
          } else {
            // If venue coordinates aren't available, just show location detected
            setLocationStatus('location-detected');
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationStatus('error');
          setDialogError('Could not get your location. Please enable location services.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      setLocationStatus('error');
      setDialogError('Geolocation is not supported by your browser.');
    }
  };

  const closeAttendanceDialog = () => {
    setIsDialogOpen(false);
    setSelectedEventId(null);
    setSelectedEvent(null);
    setCode('');
    setDialogError('');
    setUserLocation(null);
    setLocationStatus('checking');
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading your events...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Events</h1>
        <Button 
          variant="outline" 
          onClick={fetchMyEvents}
          disabled={isLoading}
          className="text-sm"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800 font-semibold flex items-center gap-2">
            <span className="text-green-600">✓</span>
            {successMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {myEvents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500 mb-4">You are not enrolled in any events yet.</p>
            <p className="text-sm text-gray-400">Contact your administrator to be added to a group.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {myEvents.map(event => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      {event.venue?.name || 'No venue specified'}
                    </CardDescription>
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {markedEvents.has(event.id) ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        <div className="text-green-700 font-semibold flex items-center gap-2">
                          <span className="text-green-600 text-lg">✓</span>
                          <span>Attendance Marked</span>
                        </div>
                        <div className="text-green-600 text-xs mt-1">You're all set!</div>
                      </div>
                    ) : (
                      isEventActive(event) ? (
                        <Button onClick={() => openAttendanceDialog(event.id)}>
                          Mark Attendance
                        </Button>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          {new Date() < new Date(event.startTime) ? 'Not yet active' : 'Expired'}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.startTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {' '}
                      {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Attendance Marking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmitAttendance}>
            <DialogHeader>
              <DialogTitle>Mark Attendance</DialogTitle>
              <DialogDescription>
                Enter the attendance code provided by your administrator.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Location Status Alert */}
              {locationStatus === 'checking' && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription>📍 Checking your location...</AlertDescription>
                </Alert>
              )}
              
              {locationStatus === 'in-range' && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription>✅ You are within range of the venue</AlertDescription>
                </Alert>
              )}
              
              {locationStatus === 'out-of-range' && (
                <Alert variant="destructive">
                  <AlertDescription>⚠️ You are outside the venue range. Move closer to mark attendance.</AlertDescription>
                </Alert>
              )}
              
              {locationStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertDescription>❌ Could not detect your location. Please enable location services.</AlertDescription>
                </Alert>
              )}
              
              {locationStatus === 'location-detected' && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertDescription>📍 Location detected. Server will validate your proximity to the venue.</AlertDescription>
                </Alert>
              )}
              
              {locationStatus === 'no-venue-data' && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertDescription>⚠️ Venue location data unavailable. Contact administrator.</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-2">
                <Label htmlFor="code">Attendance Code</Label>
                <Input 
                  id="code" 
                  value={code} 
                  onChange={(e) => setCode(e.target.value.toUpperCase())} 
                  placeholder="304-898 or A1B2C3" 
                  className="text-2xl text-center tracking-widest h-14 font-mono"
                  maxLength={7}
                  required
                />
              </div>
              {dialogError && (
                <Alert variant="destructive">
                  <AlertDescription>{dialogError}</AlertDescription>
                </Alert>
              )}
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Make sure you are at the event location</p>
                <p>• Allow location access when prompted</p>
                <p>• Enter the code exactly as shown</p>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={closeAttendanceDialog}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={
                  isSubmitting || 
                  (code.length !== 6 && code.length !== 7) ||
                  locationStatus === 'checking' ||
                  locationStatus === 'out-of-range' ||
                  locationStatus === 'error'
                }
                className="min-w-[100px]"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
