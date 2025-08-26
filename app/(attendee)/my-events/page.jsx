"use client";

import { useState, useEffect } from "react";
import apiClient from "@/services/apiClient";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchMyEvents = async () => {
    try {
      const response = await apiClient.get("/attendee/events");
      setMyEvents(response.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      // For testing without backend, use mock data
      const mockEvents = [
        {
          id: '1',
          title: 'Weekly Team Meeting',
          description: 'Regular team sync-up session',
          startTime: new Date().toISOString(), // Current time - should be active
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          venue: { name: 'Conference Room A' },
          myAttendanceStatus: 'PENDING'
        },
        {
          id: '2',
          title: 'Project Review Session',
          description: 'Monthly project review',
          startTime: '2025-08-27T14:00:00Z',
          endTime: '2025-08-27T16:00:00Z',
          venue: { name: 'Main Auditorium' },
          myAttendanceStatus: 'PRESENT'
        }
      ];
      setMyEvents(mockEvents);
      setError('Using mock data - backend not available');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    if (!selectedEventId) return;
    
    console.log('Starting attendance submission for event:', selectedEventId);
    console.log('Attendance code:', code);
    
    setIsSubmitting(true);
    setDialogError('');

    if (!navigator.geolocation) {
      setDialogError("Geolocation is not supported by your browser.");
      setIsSubmitting(false);
      return;
    }

    console.log('Requesting geolocation...');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Got location:', { latitude, longitude });
        
        try {
          console.log('Submitting to API:', `/events/${selectedEventId}/attendance/mark`);
          const response = await apiClient.post(`/events/${selectedEventId}/attendance/mark`, {
            attendanceCode: code,
            latitude,
            longitude,
          });
          
          console.log('Attendance marked successfully:', response.data);
          
          // Success! Refresh the events list to show the 'PRESENT' status
          await fetchMyEvents();
          
          // Close the dialog and reset form
          setIsDialogOpen(false);
          setCode('');
          setSelectedEventId(null);
        } catch (err) {
          console.error("Attendance marking failed:", err);
          // For testing without backend, simulate success if code is "TEST123"
          if (code.toUpperCase() === 'TEST123') {
            console.log('Using test code - simulating success');
            setIsDialogOpen(false);
            setCode('');
            setSelectedEventId(null);
            // Update the event status locally for testing
            setMyEvents(prev => prev.map(event => 
              event.id === selectedEventId 
                ? { ...event, myAttendanceStatus: 'PRESENT' }
                : event
            ));
          } else {
            setDialogError(err.response?.data?.message || "Failed to mark attendance. Try code 'TEST123' for testing.");
          }
        } finally {
          setIsSubmitting(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Could not get your location. Please enable location services.";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please allow location access and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        setDialogError(errorMessage);
        setIsSubmitting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const isEventActive = (event) => {
    const now = new Date();
    const startTime = new Date(event.startTime);
    // Let's pretend an event is "active" 15 mins before it starts
    return now > new Date(startTime.getTime() - 15 * 60000);
  };

  const openAttendanceDialog = (eventId) => {
    setSelectedEventId(eventId);
    setIsDialogOpen(true);
    setDialogError('');
    setCode('');
  };

  const closeAttendanceDialog = () => {
    setIsDialogOpen(false);
    setSelectedEventId(null);
    setCode('');
    setDialogError('');
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
  
  if (error && !error.includes('mock data')) {
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
      {error && error.includes('mock data') && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertDescription>
            🧪 <strong>Test Mode:</strong> Using mock data since backend is not available. 
            Use code "TEST123" to simulate successful attendance marking.
          </AlertDescription>
        </Alert>
      )}
      
      <h1 className="text-3xl font-bold mb-6">My Events</h1>
      
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
                    {event.myAttendanceStatus === 'PRESENT' ? (
                      <div className="text-green-600 font-semibold flex items-center gap-2">
                        <span>Attendance Marked</span>
                        <span className="text-green-500">✓</span>
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
                Enter the 6-digit code provided by your administrator.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Attendance Code</Label>
                <Input 
                  id="code" 
                  value={code} 
                  onChange={(e) => setCode(e.target.value.toUpperCase())} 
                  placeholder="A1B2C3" 
                  className="text-2xl text-center tracking-widest h-14 font-mono"
                  maxLength={6}
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
                {error && error.includes('mock data') && (
                  <p className="text-blue-600">• 🧪 <strong>Test Mode:</strong> Use "TEST123" to test</p>
                )}
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
                disabled={isSubmitting || code.length !== 6}
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
