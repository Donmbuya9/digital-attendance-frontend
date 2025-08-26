"use client";

import { useState, useEffect } from "react";
import apiClient from "@/services/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PlusCircle, Users, Search } from "lucide-react";

export default function GroupsPage() {
  // State management
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  
  // Form state
  const [newGroupForm, setNewGroupForm] = useState({ name: '', description: '' });
  
  // Dialog state
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);

  // Fetch all groups
  const fetchGroups = async () => {
    try {
      const response = await apiClient.get("/groups");
      setGroups(response.data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    }
  };

  // Fetch all users (for adding members)
  const fetchAllUsers = async () => {
    try {
      const response = await apiClient.get("/users");
      setAllUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // Fetch group members
  const fetchGroupMembers = async (groupId) => {
    try {
      const response = await apiClient.get(`/groups/${groupId}`);
      setGroupMembers(response.data.members || []);
      
      // Calculate available users (users not in this group)
      const memberIds = (response.data.members || []).map(member => member.id);
      const available = allUsers.filter(user => !memberIds.includes(user.id));
      setAvailableUsers(available);
    } catch (error) {
      console.error("Failed to fetch group members:", error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchGroups();
    fetchAllUsers();
  }, []);

  // When allUsers changes, update availableUsers if a group is selected
  useEffect(() => {
    if (selectedGroup && allUsers.length > 0) {
      const memberIds = groupMembers.map(member => member.id);
      const available = allUsers.filter(user => !memberIds.includes(user.id));
      setAvailableUsers(available);
    }
  }, [allUsers, groupMembers, selectedGroup]);

  // Handle group selection
  const handleSelectGroup = async (group) => {
    setSelectedGroup(group);
    await fetchGroupMembers(group.id);
  };

  // Handle new group form input
  const handleNewGroupInputChange = (e) => {
    const { id, value } = e.target;
    setNewGroupForm(prev => ({ ...prev, [id]: value }));
  };

  // Create new group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/groups", newGroupForm);
      setNewGroupForm({ name: '', description: '' });
      fetchGroups(); // Refresh groups list
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  // Add member to group
  const handleAddMember = async (user) => {
    try {
      await apiClient.post(`/groups/${selectedGroup.id}/members`, { userId: user.id });
      await fetchGroupMembers(selectedGroup.id); // Refresh members
      setIsAddMemberDialogOpen(false);
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  // Remove member from group
  const handleRemoveMember = async (member) => {
    setMemberToRemove(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmRemoveMember = async () => {
    try {
      await apiClient.delete(`/groups/${selectedGroup.id}/members/${memberToRemove.id}`);
      await fetchGroupMembers(selectedGroup.id); // Refresh members
      setIsDeleteDialogOpen(false);
      setMemberToRemove(null);
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
  };

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
              <form onSubmit={handleCreateGroup} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Group Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Web Dev Cohort" 
                    value={newGroupForm.name}
                    onChange={handleNewGroupInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Optional description" 
                    value={newGroupForm.description}
                    onChange={handleNewGroupInputChange}
                  />
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
              {groups.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No groups found</p>
              ) : (
                <ul className="grid gap-2">
                  {groups.map((group) => (
                    <li key={group.id}>
                      <Button 
                        variant={selectedGroup?.id === group.id ? "default" : "ghost"} 
                        className="w-full justify-start"
                        onClick={() => handleSelectGroup(group)}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        {group.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
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
                  <h3 className="text-lg font-semibold">Members ({groupMembers.length})</h3>
                  <Button size="sm" onClick={() => setIsAddMemberDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </div>
                {groupMembers.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <p className="text-gray-500 mb-4">No members in this group</p>
                    <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add First Member
                    </Button>
                  </div>
                ) : (
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
                        {groupMembers.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>{member.firstName}</TableCell>
                            <TableCell>{member.lastName}</TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRemoveMember(member)}
                              >
                                Remove
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
          ) : (
            <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
              <p className="text-gray-500">Select a group to see its details</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Member to {selectedGroup?.name}</DialogTitle>
            <DialogDescription>
              Select a user to add to this group.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {availableUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No available users to add</p>
            ) : (
              <Command>
                <CommandInput placeholder="Search users..." />
                <CommandList>
                  <CommandEmpty>No users found.</CommandEmpty>
                  <CommandGroup>
                    {availableUsers.map((user) => (
                      <CommandItem
                        key={user.id}
                        onSelect={() => handleAddMember(user)}
                        className="cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{user.firstName} {user.lastName}</span>
                          <span className="text-sm text-gray-500">{user.email}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {memberToRemove?.firstName} {memberToRemove?.lastName} from this group?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmRemoveMember}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
