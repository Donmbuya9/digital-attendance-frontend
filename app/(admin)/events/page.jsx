"use client";

import { useState, useEffect } from "react";
import apiClient from "@/services/apiClient";
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

const emptyEventForm = { title: '', description: '', venueId: '', groupId: '', startTime: '', endTime: '' };

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [venues, setVenues] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEventData, setNewEventData] = useState(emptyEventForm);

  // Function to fetch all necessary data
  const fetchData = async () => {
    try {
      // Promise.all allows us to run API calls in parallel for efficiency
      const [eventsRes, groupsRes, venuesRes] = await Promise.all([
        apiClient.get("/events"),
        apiClient.get("/groups"),
        apiClient.get("/venues"),
      ]);
      setEvents(eventsRes.data);
      setGroups(groupsRes.data);
      setVenues(venuesRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewEventData({ ...newEventData, [id]: value });
  };

  const handleSelectChange = (name, value) => {
    setNewEventData({ ...newEventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert local datetime string to ISO 8601 format for the backend
      const payload = {
        ...newEventData,
        startTime: new Date(newEventData.startTime).toISOString(),
        endTime: new Date(newEventData.endTime).toISOString(),
      };
      await apiClient.post("/events", payload);
      setIsDialogOpen(false); // Close dialog
      setNewEventData(emptyEventForm); // Reset form
      fetchData(); // Refresh the event list
    } catch (error) {
      console.error("Failed to create event:", error);
      // Add user-facing error handling (e.g., a toast notification)
    }
  };
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-gray-600 mt-2">Schedule and manage events</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Schedule Event</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Schedule New Event</DialogTitle>
                <DialogDescription>Fill in the details to create a new event.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Introduction to Spring Boot" 
                    value={newEventData.title} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Optional description of the event" 
                    value={newEventData.description} 
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Venue</Label>
                        <Select onValueChange={(value) => handleSelectChange('venueId', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a venue" />
                          </SelectTrigger>
                          <SelectContent>
                            {venues.map(v => (
                              <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label>Group</Label>
                        <Select onValueChange={(value) => handleSelectChange('groupId', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a group" />
                          </SelectTrigger>
                          <SelectContent>
                            {groups.map(g => (
                              <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Start Time</Label>
                        <Input 
                          id="startTime" 
                          type="datetime-local" 
                          value={newEventData.startTime} 
                          onChange={handleInputChange}
                          required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>End Time</Label>
                        <Input 
                          id="endTime" 
                          type="datetime-local" 
                          value={newEventData.endTime} 
                          onChange={handleInputChange}
                          required
                        />
                    </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Event</Button>
              </DialogFooter>
            </form>
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
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No events scheduled</p>
                  <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                    Schedule Your First Event
                  </Button>
                </div>
              ) : (
                <ul className="space-y-4">
                    {events.map(event => (
                        <li key={event.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div>
                                <h3 className="font-semibold text-lg">{event.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  <span className="font-medium">{event.group?.name || 'No Group'}</span> @ <span className="font-medium">{event.venue?.name || 'No Venue'}</span>
                                </p>
                                {event.description && (
                                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                                )}
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
