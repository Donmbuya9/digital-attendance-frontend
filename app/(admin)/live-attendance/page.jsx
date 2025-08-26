"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle } from 'lucide-react';

// Mock data for demonstration
const mockEvents = [
  {
    id: 1,
    title: "Weekly Team Meeting",
    startTime: "2025-08-26T10:00:00Z",
    endTime: "2025-08-26T11:00:00Z",
    venue: { id: 1, name: "Conference Room A", latitude: 40.7128, longitude: -74.0060, radius: 50 },
    group: { id: 1, name: "Development Team" },
    status: "ongoing"
  },
  {
    id: 2,
    title: "Project Review",
    startTime: "2025-08-26T14:00:00Z",
    endTime: "2025-08-26T16:00:00Z",
    venue: { id: 2, name: "Main Auditorium", latitude: 40.7580, longitude: -73.9855, radius: 100 },
    group: { id: 2, name: "All Staff" },
    status: "upcoming"
  },
  {
    id: 3,
    title: "Training Session",
    startTime: "2025-08-25T09:00:00Z",
    endTime: "2025-08-25T17:00:00Z",
    venue: { id: 3, name: "Training Room", latitude: 40.7614, longitude: -73.9776, radius: 30 },
    group: { id: 3, name: "New Hires" },
    status: "completed"
  }
];

const mockAttendances = [
  {
    id: 1,
    eventId: 1,
    user: { id: 1, name: "John Doe", email: "john@example.com" },
    checkInTime: "2025-08-26T10:05:00Z",
    checkOutTime: null,
    status: "present",
    location: { latitude: 40.7128, longitude: -74.0060 }
  },
  {
    id: 2,
    eventId: 1,
    user: { id: 2, name: "Jane Smith", email: "jane@example.com" },
    checkInTime: "2025-08-26T10:02:00Z",
    checkOutTime: "2025-08-26T10:45:00Z",
    status: "checked_out",
    location: { latitude: 40.7128, longitude: -74.0059 }
  },
  {
    id: 3,
    eventId: 1,
    user: { id: 3, name: "Bob Johnson", email: "bob@example.com" },
    checkInTime: null,
    checkOutTime: null,
    status: "absent",
    location: null
  },
  {
    id: 4,
    eventId: 1,
    user: { id: 4, name: "Alice Brown", email: "alice@example.com" },
    checkInTime: "2025-08-26T10:15:00Z",
    checkOutTime: null,
    status: "late",
    location: { latitude: 40.7129, longitude: -74.0061 }
  }
];

export default function LiveAttendancePage() {
  const [selectedEvent, setSelectedEvent] = useState(mockEvents[0]);
  const [attendances, setAttendances] = useState(mockAttendances);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Filter attendances for selected event
  const eventAttendances = attendances.filter(att => att.eventId === selectedEvent.id);

  // Calculate statistics
  const totalExpected = eventAttendances.length;
  const present = eventAttendances.filter(att => att.status === 'present' || att.status === 'checked_out').length;
  const late = eventAttendances.filter(att => att.status === 'late').length;
  const absent = eventAttendances.filter(att => att.status === 'absent').length;

  const getStatusBadge = (status) => {
    const variants = {
      present: { variant: "default", className: "bg-green-100 text-green-800 hover:bg-green-100" },
      late: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
      absent: { variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-100" },
      checked_out: { variant: "outline", className: "bg-blue-100 text-blue-800 hover:bg-blue-100" }
    };
    
    const config = variants[status] || variants.absent;
    const labels = {
      present: "Present",
      late: "Late",
      absent: "Absent",
      checked_out: "Checked Out"
    };

    return (
      <Badge variant={config.variant} className={config.className}>
        {labels[status]}
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
          <Select value={selectedEvent.id.toString()} onValueChange={(value) => {
            const event = mockEvents.find(e => e.id.toString() === value);
            if (event) setSelectedEvent(event);
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an event to monitor" />
            </SelectTrigger>
            <SelectContent>
              {mockEvents.map(event => (
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
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{selectedEvent.title}</CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{selectedEvent.group.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedEvent.venue.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}</span>
                </div>
              </div>
            </div>
            {getEventStatusBadge(selectedEvent)}
          </div>
        </CardHeader>
      </Card>

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
            <Button variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {eventAttendances.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No attendees registered for this event</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Check-in Time</th>
                    <th className="text-left py-3 px-4 font-medium">Check-out Time</th>
                    <th className="text-left py-3 px-4 font-medium">Location Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {eventAttendances.map(attendance => (
                    <tr key={attendance.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{attendance.user.name}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {attendance.user.email}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(attendance.status)}
                      </td>
                      <td className="py-3 px-4">
                        {formatTime(attendance.checkInTime)}
                      </td>
                      <td className="py-3 px-4">
                        {attendance.checkOutTime ? formatTime(attendance.checkOutTime) : "Still present"}
                      </td>
                      <td className="py-3 px-4">
                        {attendance.location ? (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600">
                            <XCircle className="h-4 w-4" />
                            <span className="text-sm">Not verified</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
