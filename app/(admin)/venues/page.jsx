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
import { MoreHorizontal, MapPin, Crosshair, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const emptyVenue = { name: '', latitude: '', longitude: '', radius: '' };

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentVenue, setCurrentVenue] = useState(emptyVenue);
  const [editingId, setEditingId] = useState(null); // null for 'Add' mode, id for 'Edit' mode
  const [deletingId, setDeletingId] = useState(null); // Track which venue is being deleted
  
  // Location detection state
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [addressSearch, setAddressSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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

  // Get current location for venue
  const getCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentVenue(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
        setLocationLoading(false);
        setLocationError(null);
      },
      (error) => {
        let errorMessage = 'Unable to get your location. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Search for address using geocoding
  const searchAddress = async () => {
    if (!addressSearch.trim()) {
      setLocationError('Please enter an address to search');
      return;
    }

    setIsSearching(true);
    setLocationError(null);

    try {
      // Using a simple geocoding approach with OpenStreetMap Nominatim
      // For production, consider using Google Maps API or similar
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressSearch)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const location = data[0];
        setCurrentVenue(prev => ({
          ...prev,
          latitude: parseFloat(location.lat).toFixed(6),
          longitude: parseFloat(location.lon).toFixed(6)
        }));
        setLocationError(null);
      } else {
        setLocationError('Address not found. Please try a different search term.');
      }
    } catch (error) {
      setLocationError('Failed to search for address. Please try again.');
      console.error('Geocoding error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Reset location fields
  const resetLocation = () => {
    setCurrentVenue(prev => ({
      ...prev,
      latitude: '',
      longitude: ''
    }));
    setLocationError(null);
    setAddressSearch('');
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
    setLocationError(null);
    setAddressSearch('');
    setIsDialogOpen(true);
  };

  const handleEdit = (venue) => {
    setEditingId(venue.id);
    setCurrentVenue(venue);
    setLocationError(null);
    setAddressSearch('');
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
              <TableHead>Location</TableHead>
              <TableHead>Radius (m)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {venues.map((venue) => (
              <TableRow key={venue.id}>
                <TableCell className="font-medium">{venue.name}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">Lat:</span>
                      <span className="font-mono text-xs">{parseFloat(venue.latitude).toFixed(4)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">Lng:</span>
                      <span className="font-mono text-xs">{parseFloat(venue.longitude).toFixed(4)}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => window.open(`https://www.google.com/maps?q=${venue.latitude},${venue.longitude}`, '_blank')}
                    >
                      View on Map
                    </Button>
                  </div>
                </TableCell>
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
                Fill in the details for the venue. You can use your current location or search for an address.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={currentVenue.name} onChange={handleInputChange} className="col-span-3" required />
              </div>
              
              {/* Location Section */}
              <div className="grid gap-4 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <Label className="text-sm font-medium">Location</Label>
                </div>
                
                {/* Address Search */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right text-sm">Search Address</Label>
                  <div className="col-span-3 flex gap-2">
                    <Input 
                      id="address" 
                      value={addressSearch}
                      onChange={(e) => setAddressSearch(e.target.value)}
                      placeholder="Enter address or place name"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={searchAddress}
                      disabled={isSearching}
                    >
                      {isSearching ? <Search className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                {/* Quick Location Buttons */}
                <div className="flex gap-2 justify-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="flex items-center gap-2"
                  >
                    {locationLoading ? (
                      <>
                        <Crosshair className="h-4 w-4 animate-spin" />
                        Getting location...
                      </>
                    ) : (
                      <>
                        <Crosshair className="h-4 w-4" />
                        Use Current Location
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={resetLocation}
                  >
                    Clear Location
                  </Button>
                </div>
                
                {/* Coordinate Inputs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude" className="text-sm">Latitude</Label>
                    <Input 
                      id="latitude" 
                      type="number" 
                      step="any" 
                      value={currentVenue.latitude} 
                      onChange={handleInputChange} 
                      placeholder="0.000000"
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude" className="text-sm">Longitude</Label>
                    <Input 
                      id="longitude" 
                      type="number" 
                      step="any" 
                      value={currentVenue.longitude} 
                      onChange={handleInputChange} 
                      placeholder="0.000000"
                      required 
                    />
                  </div>
                </div>
                
                {/* Location Status */}
                {currentVenue.latitude && currentVenue.longitude && (
                  <div className="text-sm text-green-600 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location set: {currentVenue.latitude}, {currentVenue.longitude}
                  </div>
                )}
                
                {/* Error Display */}
                {locationError && (
                  <Alert variant="destructive">
                    <AlertDescription className="text-sm">{locationError}</AlertDescription>
                  </Alert>
                )}
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
