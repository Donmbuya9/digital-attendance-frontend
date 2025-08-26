"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function VenuesPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Venues</h1>
          <p className="text-gray-600 mt-2">Manage attendance venues and locations</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Venue
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Venue Management</CardTitle>
          <CardDescription>
            This page will contain venue management functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Venue management features will be implemented in future tasks.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
