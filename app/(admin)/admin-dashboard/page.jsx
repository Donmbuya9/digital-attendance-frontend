"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { userService, venueService, groupService, eventService } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, UserCheck, Calendar, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    venues: 0,
    groups: 0,
    events: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [usersData, venuesData, groupsData, eventsData] = await Promise.all([
          userService.getAllUsers().catch(() => []),
          venueService.getAllVenues().catch(() => []),
          groupService.getAllGroups().catch(() => []),
          eventService.getAllEvents().catch(() => [])
        ]);

        setStats({
          users: usersData.length || 0,
          venues: venuesData.length || 0,
          groups: groupsData.length || 0,
          events: eventsData.length || 0
        });
        setError('');
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setError("Unable to load dashboard data. Please ensure the backend server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardStats = [
    {
      title: "Total Users",
      value: loading ? "..." : stats.users.toString(),
      description: "Active users in the system",
      icon: Users,
    },
    {
      title: "Venues",
      value: loading ? "..." : stats.venues.toString(),
      description: "Registered venues",
      icon: MapPin,
    },
    {
      title: "Groups",
      value: loading ? "..." : stats.groups.toString(),
      description: "Active groups",
      icon: UserCheck,
    },
    {
      title: "Events",
      value: loading ? "..." : stats.events.toString(),
      description: "Total events",
      icon: Calendar,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user?.firstName}!</h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your attendance system
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Backend connection and system health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {error ? (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-600">Backend Disconnected</p>
                    <p className="text-xs text-muted-foreground">
                      Please start the Spring Boot backend server at localhost:8080
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-600">Backend Connected</p>
                    <p className="text-xs text-muted-foreground">
                      All systems operational
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div 
                className="p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors"
                onClick={() => window.location.href = '/events'}
              >
                <p className="text-sm font-medium">Create New Event</p>
                <p className="text-xs text-muted-foreground">Schedule a new attendance event</p>
              </div>
              <div 
                className="p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors"
                onClick={() => window.location.href = '/venues'}
              >
                <p className="text-sm font-medium">Add Venue</p>
                <p className="text-xs text-muted-foreground">Register a new location</p>
              </div>
              <div 
                className="p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors"
                onClick={() => window.location.href = '/groups'}
              >
                <p className="text-sm font-medium">Manage Groups</p>
                <p className="text-xs text-muted-foreground">Organize users into groups</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
