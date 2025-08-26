"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function GroupsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Groups</h1>
          <p className="text-gray-600 mt-2">Manage user groups and memberships</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Group
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Group Management</CardTitle>
          <CardDescription>
            This page will contain group management functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Group management features will be implemented in future tasks.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
