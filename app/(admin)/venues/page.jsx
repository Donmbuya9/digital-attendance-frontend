"use client";

import { useState } from "react";
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Edit, Trash2 } from "lucide-react";

// Placeholder data to build the UI
const mockVenues = [
  { id: '1', name: 'Main Auditorium', latitude: -6.77, longitude: 39.23, radius: 50 },
  { id: '2', name: 'Computer Lab 3', latitude: -6.78, longitude: 39.24, radius: 25 },
  { id: '3', name: 'Conference Room A', latitude: -6.76, longitude: 39.25, radius: 30 },
  { id: '4', name: 'Library Study Hall', latitude: -6.79, longitude: 39.22, radius: 40 },
];

export default function VenuesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    radius: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSaveVenue = () => {
    // For now, just close the dialog and reset form
    console.log('Saving venue:', formData);
    setIsDialogOpen(false);
    setFormData({ name: '', latitude: '', longitude: '', radius: '' });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Venues</h1>
          <p className="text-gray-600 mt-2">Manage attendance venues and locations</p>
        </div>
        {/* Dialog Trigger Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Venue
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Venue</DialogTitle>
              <DialogDescription>
                Fill in the details for the new venue. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            {/* Form inside the Dialog */}
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g., Main Hall" 
                  className="col-span-3"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="latitude" className="text-right">Latitude</Label>
                <Input 
                  id="latitude" 
                  type="number" 
                  step="any" 
                  placeholder="-6.7766" 
                  className="col-span-3"
                  value={formData.latitude}
                  onChange={handleInputChange}
                />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="longitude" className="text-right">Longitude</Label>
                <Input 
                  id="longitude" 
                  type="number" 
                  step="any" 
                  placeholder="39.2312" 
                  className="col-span-3"
                  value={formData.longitude}
                  onChange={handleInputChange}
                />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="radius" className="text-right">Radius (m)</Label>
                <Input 
                  id="radius" 
                  type="number" 
                  placeholder="50" 
                  className="col-span-3"
                  value={formData.radius}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleSaveVenue}>Save Venue</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Venues Table */}
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
            {mockVenues.map((venue) => (
              <TableRow key={venue.id}>
                <TableCell className="font-medium">{venue.name}</TableCell>
                <TableCell>{venue.latitude}</TableCell>
                <TableCell>{venue.longitude}</TableCell>
                <TableCell>{venue.radius}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {mockVenues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No venues found</p>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Venue
          </Button>
        </div>
      )}
    </div>
  );
}
