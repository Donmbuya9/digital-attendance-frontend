"use client";

import { useState, useEffect } from "react";
import apiClient from "@/services/apiClient";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal } from "lucide-react";

const emptyVenue = { name: '', latitude: '', longitude: '', radius: '' };

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentVenue, setCurrentVenue] = useState(emptyVenue);
  const [editingId, setEditingId] = useState(null); // null for 'Add' mode, id for 'Edit' mode
  const [deletingId, setDeletingId] = useState(null); // Track which venue is being deleted

  // Function to fetch all venues
  const fetchVenues = async () => {
    try {
      const response = await apiClient.get("/venues");
      setVenues(response.data);
    } catch (error) {
      console.error("Failed to fetch venues:", error);
      // Handle error (e.g., show a toast notification)
    }
  };

  // Fetch venues when the component mounts
  useEffect(() => {
    fetchVenues();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setCurrentVenue({ ...currentVenue, [id]: value });
  };

  const handleAddNew = () => {
    setEditingId(null);
    setCurrentVenue(emptyVenue);
    setIsDialogOpen(true);
  };

  const handleEdit = (venue) => {
    setEditingId(venue.id);
    setCurrentVenue(venue);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/venues/${deletingId}`);
      fetchVenues(); // Refresh the list
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Failed to delete venue:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing venue
        await apiClient.put(`/venues/${editingId}`, currentVenue);
      } else {
        // Create new venue
        await apiClient.post("/venues", currentVenue);
      }
      fetchVenues(); // Refresh the list
      setIsDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Failed to save venue:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Venues</h1>
          <p className="text-gray-600 mt-2">Manage attendance venues and locations</p>
        </div>
        <Button onClick={handleAddNew}>Add Venue</Button>
      </div>

      <div className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Latitude</TableHead>
              <TableHead>Longitude</TableHead>
              <TableHead>Radius (m)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {venues.map((venue) => (
              <TableRow key={venue.id}>
                <TableCell className="font-medium">{venue.name}</TableCell>
                <TableCell>{venue.latitude}</TableCell>
                <TableCell>{venue.longitude}</TableCell>
                <TableCell>{venue.radius}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(venue)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(venue.id)} className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {venues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No venues found</p>
          <Button variant="outline" onClick={handleAddNew}>
            Add Your First Venue
          </Button>
        </div>
      )}

      {/* Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Venue' : 'Add New Venue'}</DialogTitle>
              <DialogDescription>
                Fill in the details for the venue. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={currentVenue.name} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="latitude" className="text-right">Latitude</Label>
                <Input id="latitude" type="number" step="any" value={currentVenue.latitude} onChange={handleInputChange} className="col-span-3" required />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="longitude" className="text-right">Longitude</Label>
                <Input id="longitude" type="number" step="any" value={currentVenue.longitude} onChange={handleInputChange} className="col-span-3" required />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="radius" className="text-right">Radius (m)</Label>
                <Input id="radius" type="number" value={currentVenue.radius} onChange={handleInputChange} className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Venue</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this venue? This action cannot be undone.
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
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
