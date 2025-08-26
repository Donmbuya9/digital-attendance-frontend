"use client";

import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, UserCheck, Calendar, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Users",
      value: "156",
      description: "Active users in the system",
      icon: Users,
      trend: "+12%",
    },
    {
      title: "Venues",
      value: "8",
      description: "Registered venues",
      icon: MapPin,
      trend: "+2%",
    },
    {
      title: "Groups",
      value: "24",
      description: "Active groups",
      icon: UserCheck,
      trend: "+8%",
    },
    {
      title: "Events",
      value: "45",
      description: "Events this month",
      icon: Calendar,
      trend: "+15%",
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
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
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">{stat.trend}</span>
                  <span className="text-xs text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Event "Morning Lecture" completed</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New venue "Conference Room B" added</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
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
              <div className="p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors">
                <p className="text-sm font-medium">Create New Event</p>
                <p className="text-xs text-muted-foreground">Schedule a new attendance event</p>
              </div>
              <div className="p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors">
                <p className="text-sm font-medium">Add Venue</p>
                <p className="text-xs text-muted-foreground">Register a new location</p>
              </div>
              <div className="p-3 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer transition-colors">
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
