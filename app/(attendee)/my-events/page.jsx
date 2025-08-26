"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock } from "lucide-react";

// Mock data for the UI
const mockMyEvents = [
  { 
    id: '1', 
    title: 'Weekly Team Meeting', 
    startTime: new Date().toISOString(), 
    venue: { name: 'Conference Room A' }, 
    myAttendanceStatus: 'PENDING' 
  },
  { 
    id: '2', 
    title: 'Project Review Session', 
    startTime: '2025-08-27T14:00:00Z', 
    venue: { name: 'Main Auditorium' }, 
    myAttendanceStatus: 'PRESENT' 
  },
];

export default function MyEventsPage() {
  // Logic will be added in the final step
  const isEventActive = (event) => {
    const now = new Date();
    const startTime = new Date(event.startTime);
    // Let's pretend an event is "active" 15 mins before it starts
    return now > new Date(startTime.getTime() - 15 * 60000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Events</h1>
      <div className="grid gap-6">
        {mockMyEvents.map(event => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.venue.name}</CardDescription>
                </div>
                {event.myAttendanceStatus === 'PRESENT' ? (
                  <p className="text-green-600 font-semibold">Attendance Marked</p>
                ) : (
                  isEventActive(event) && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Mark Attendance</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Mark Attendance for {event.title}</DialogTitle>
                          <DialogDescription>
                            Enter the 6-digit code provided by your administrator.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2 text-center">
                            <Label htmlFor="code" className="text-left">Attendance Code</Label>
                            <Input 
                              id="code" 
                              placeholder="A1B-C2D" 
                              className="text-2xl text-center tracking-widest h-14" 
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="w-full">Submit</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )
                )}
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
                  <span>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
