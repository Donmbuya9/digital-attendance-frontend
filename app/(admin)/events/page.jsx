"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ClockIcon } from "lucide-react";

// Mock data to build the UI
const mockEvents = [
  { id: '1', title: 'Java Fundamentals - Lecture 1', startTime: '2023-11-15T09:00:00Z', group: { name: 'Java IPT - Fall 2023' }, venue: { name: 'Main Auditorium' } },
  { id: '2', title: 'Data Visualization with Python', startTime: '2023-11-16T14:00:00Z', group: { name: 'Data Science Workshop' }, venue: { name: 'Computer Lab 3' } },
];

const mockGroups = [ {id: 'g1', name: 'Java IPT - Fall 2023'}, {id: 'g2', name: 'Data Science Workshop'} ];
const mockVenues = [ {id: 'v1', name: 'Main Auditorium'}, {id: 'v2', name: 'Computer Lab 3'} ];

export default function EventsPage() {
  // Logic will be added in the next task
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-gray-600 mt-2">Schedule and manage events</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Schedule Event</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule New Event</DialogTitle>
              <DialogDescription>Fill in the details to create a new event.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" placeholder="e.g., Introduction to Spring Boot" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Optional description of the event" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                      <Label>Venue</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a venue" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockVenues.map(v => (
                            <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  </div>
                  <div className="grid gap-2">
                      <Label>Group</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockGroups.map(g => (
                            <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                      <Label>Start Time</Label>
                      <Input id="startTime" type="datetime-local" />
                  </div>
                  <div className="grid gap-2">
                      <Label>End Time</Label>
                      <Input id="endTime" type="datetime-local" />
                  </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Event List */}
      <Card>
          <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>View and manage scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
              {mockEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No events scheduled</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Schedule Your First Event</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Schedule New Event</DialogTitle>
                        <DialogDescription>Fill in the details to create a new event.</DialogDescription>
                      </DialogHeader>
                      {/* Form would be duplicated here - will be handled in next task */}
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <ul className="space-y-4">
                    {mockEvents.map(event => (
                        <li key={event.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div>
                                <h3 className="font-semibold text-lg">{event.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  <span className="font-medium">{event.group.name}</span> @ <span className="font-medium">{event.venue.name}</span>
                                </p>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>{new Date(event.startTime).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ClockIcon className="h-4 w-4" />
                                  <span>{new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
              )}
          </CardContent>
      </Card>
    </div>
  );
}
