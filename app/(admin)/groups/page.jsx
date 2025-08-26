"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Users } from "lucide-react";

// Mock data to represent the state of the component
const mockGroups = [
  { id: '1', name: 'Java IPT - Fall 2023', description: 'Cohort for Java training.' },
  { id: '2', name: 'Data Science Workshop', description: 'Weekend workshop attendees.' },
];

const mockSelectedGroup = {
  id: '1',
  name: 'Java IPT - Fall 2023',
  description: 'Cohort for Java training.',
  members: [
    { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
    { id: 'u2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
  ],
};

export default function GroupsPage() {
  // We will replace these with real state and logic in the next task
  const groups = mockGroups;
  const selectedGroup = mockSelectedGroup;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Groups</h1>
        <p className="text-gray-600 mt-2">Manage user groups and members</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Group List and Create Form */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Create New Group</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Group Name</Label>
                  <Input id="name" placeholder="e.g., Web Dev Cohort" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Optional description" />
                </div>
                <Button type="submit">Create Group</Button>
              </form>
            </CardContent>
          </Card>

          <Separator className="my-6" />

          <Card>
            <CardHeader>
              <CardTitle>All Groups</CardTitle>
              <CardDescription>Select a group to view members.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2">
                {groups.map((group) => (
                  <li key={group.id}>
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      {group.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Selected Group Details */}
        <div className="md:col-span-2">
          {selectedGroup ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedGroup.name}</CardTitle>
                <CardDescription>{selectedGroup.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Members</h3>
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </div>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedGroup.members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.firstName}</TableCell>
                          <TableCell>{member.lastName}</TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">Remove</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
              <p className="text-gray-500">Select a group to see its details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
