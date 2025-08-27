"use client";

import { useState, useEffect, useCallback } from "react";
import { attendanceService } from "@/services/api";
import apiClient from "@/services/apiClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function LiveAttendancePage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [attendanceCode, setAttendanceCode] = useState(null);
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Fetch all events for selection
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiClient.get('/events');
        setEvents(response.data);
        if (response.data.length > 0) {
          setSelectedEvent(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Fetch event details when selectedEvent changes
  const fetchEventDetails = useCallback(async () => {
    if (!selectedEvent) return;
    
    try {
      const response = await apiClient.get(`/events/${selectedEvent.id}`);
      setEventDetails(response.data);
    } catch (err) {
      console.error("Failed to fetch event details:", err);
      setError("Could not load event details.");
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedEvent) {
      fetchEventDetails();
    }
  }, [selectedEvent, fetchEventDetails]);

  // Polling effect: Refetch data every 5 seconds IF attendance is active
  useEffect(() => {
    if (isPolling && selectedEvent) {
      const interval = setInterval(() => {
        fetchEventDetails();
      }, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isPolling, selectedEvent, fetchEventDetails]);

  const handleStartAttendance = async () => {
    if (!selectedEvent) return;
    
    try {
      const data = await attendanceService.startAttendance(selectedEvent.id);
      setAttendanceCode(data.attendanceCode);
      setIsCodeDialogOpen(true);
      setIsPolling(true);
    } catch (err) {
      console.error("Failed to start attendance:", err);
      setError(err.response?.data?.message || "Failed to start attendance session.");
    }
  };

  const handleRefresh = () => {
    fetchEventDetails();
  };

  const handleManualOverride = async (userId) => {
    try {
      await attendanceService.manualOverride(selectedEvent.id, userId);
      await fetchEventDetails(); // Refresh data to show updated status
    } catch (error) {
      console.error('Manual override failed:', error);
      setError(error.response?.data?.message || 'Failed to manually mark attendance');
    }
  };

  // Calculate statistics from event details
  const getStatistics = () => {
    if (!eventDetails || !eventDetails.attendees) {
      return { totalExpected: 0, present: 0, late: 0, absent: 0 };
    }

    const attendees = eventDetails.attendees;
    const totalExpected = attendees.length;
    const present = attendees.filter(att => att.status === 'PRESENT').length;
    const late = attendees.filter(att => att.status === 'LATE').length;
    const absent = attendees.filter(att => att.status === 'ABSENT' || att.status === 'PENDING').length;

    return { totalExpected, present, late, absent };
  };

  const { totalExpected, present, late, absent } = getStatistics();

  const getStatusBadge = (status) => {
    const variants = {
      PRESENT: { variant: "default", className: "bg-green-100 text-green-800 hover:bg-green-100" },
      LATE: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
      ABSENT: { variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-100" },
      PENDING: { variant: "outline", className: "bg-gray-100 text-gray-800 hover:bg-gray-100" }
    };
    
    const config = variants[status] || variants.PENDING;
    const labels = {
      PRESENT: "Present",
      LATE: "Late", 
      ABSENT: "Absent",
      PENDING: "Pending"
    };

    return (
      <Badge variant={config.variant} className={config.className}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getEventStatusBadge = (event) => {
    const now = new Date();
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);

    if (now < start) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Upcoming</Badge>;
    } else if (now >= start && now <= end) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Ongoing</Badge>;
    } else {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Completed</Badge>;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Not checked in";
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center">
          <div className="text-lg">Loading events...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Live Attendance Monitoring</h1>
          <p className="text-gray-600 mt-2">Real-time attendance tracking for ongoing events</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Current Time</p>
          <p className="text-lg font-semibold">{currentTime.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Event Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Event</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={selectedEvent?.id?.toString() || ""} 
            onValueChange={(value) => {
              const event = events.find(e => e.id.toString() === value);
              if (event) setSelectedEvent(event);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an event to monitor" />
            </SelectTrigger>
            <SelectContent>
              {events.map(event => (
                <SelectItem key={event.id} value={event.id.toString()}>
                  <div className="flex items-center justify-between w-full">
                    <span>{event.title}</span>
                    <span className="ml-2">{getEventStatusBadge(event)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Event Details */}
      {selectedEvent && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{selectedEvent.title}</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{selectedEvent.group?.name || 'No Group'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedEvent.venue?.name || 'No Venue'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getEventStatusBadge(selectedEvent)}
                <Button onClick={handleStartAttendance} className="bg-blue-600 hover:bg-blue-700">
                  Start Attendance
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Attendance Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expected</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpected}</div>
            <p className="text-xs text-muted-foreground">Registered attendees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{present}</div>
            <p className="text-xs text-muted-foreground">
              {totalExpected > 0 ? Math.round((present / totalExpected) * 100) : 0}% attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{late}</div>
            <p className="text-xs text-muted-foreground">Arrived after start time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absent}</div>
            <p className="text-xs text-muted-foreground">Not checked in</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Details */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Attendance Details</CardTitle>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!eventDetails || !eventDetails.attendees || eventDetails.attendees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No attendees registered for this event</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Marked At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventDetails.attendees.map(attendee => (
                    <TableRow key={attendee.id}>
                      <TableCell className="font-medium">
                        {attendee.firstName} {attendee.lastName}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {attendee.email}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(attendee.status)}
                      </TableCell>
                      <TableCell>
                        {attendee.markedAt ? new Date(attendee.markedAt).toLocaleTimeString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={attendee.status === 'PRESENT'}
                          onClick={() => handleManualOverride(attendee.id)}
                        >
                          Mark Manually
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendance Code Dialog */}
      <Dialog open={isCodeDialogOpen} onOpenChange={setIsCodeDialogOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">Attendance is Live</DialogTitle>
            <DialogDescription>
              Attendees should enter this code in their portal.
            </DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <p className="text-6xl font-bold tracking-widest bg-gray-100 rounded-md p-4">
              {attendanceCode || "..."}
            </p>
          </div>
          <p className="text-sm text-gray-500">This code will expire in 90 seconds.</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setIsCodeDialogOpen(false);
              setIsPolling(false);
            }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
