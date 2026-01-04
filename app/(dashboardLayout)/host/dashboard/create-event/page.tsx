// app/(dashboardLayout)/host/create-event/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { EVENT_TYPE_LABELS, EventType } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  DollarSign,
  Image as ImageIcon,
  MapPin,
  Tag,
  Users
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

// Define the form data type
interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  imageUrl: string;
  fee: string;
  isPaidEvent: boolean;
  eventType: EventType;
  maxParticipants: string;
}

const CreateEventPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initial form state
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    imageUrl: "",
    fee: "0",
    isPaidEvent: false,
    eventType: "OTHER",
    maxParticipants: "",
  });

  // Form errors
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});

  // Handle input changes
  const handleInputChange = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Toggle paid event
  const togglePaidEvent = () => {
    setFormData(prev => ({ 
      ...prev, 
      isPaidEvent: !prev.isPaidEvent,
      fee: !prev.isPaidEvent ? "0" : prev.fee
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (formData.title.length < 3) newErrors.title = "Title must be at least 3 characters";
    
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.description.length < 10) newErrors.description = "Description must be at least 10 characters";
    
    if (!formData.date) newErrors.date = "Date is required";
    if (new Date(formData.date) < new Date()) newErrors.date = "Date must be in the future";
    
    if (!formData.location.trim()) newErrors.location = "Location is required";
    
    if (formData.isPaidEvent && (!formData.fee || parseFloat(formData.fee) <= 0)) {
      newErrors.fee = "Fee must be greater than 0 for paid events";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // FIXED: Handle form submission with proper authentication
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the event data - match the exact structure from your backend example
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date).toISOString(),
        location: formData.location,
        category: formData.category || null,
        imageUrl: formData.imageUrl || null,
        fee: parseFloat(formData.fee),
        isPaidEvent: formData.isPaidEvent, // Make sure this is sent
        eventType: formData.eventType,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
      };

      console.log("Submitting event data:", eventData);

      // DIRECT FETCH with proper authentication - matching your working backend call
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL || process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:5000/api/v1'}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Important for cookie-based auth
        body: JSON.stringify(eventData),
      });

      console.log("API Response status:", response.status);

      if (!response.ok) {
        const responseText = await response.text();
        console.error("API Error response:", responseText);
        
        let errorMessage = `Failed to create event (Status: ${response.status})`;
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }
        
        // Handle authentication errors specifically
        if (response.status === 401) {
          toast.error("Please log in again to create events");
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("API Success response:", result);
      
      toast.success(result.message || "Event created successfully!");
      
      // Redirect to the event page or events list
      setTimeout(() => {
        if (result.data?.id) {
          router.push(`/host/dashboard/my-events/${result.data.id}`);
        } else {
          router.push("/host/events");
        }
        router.refresh();
      }, 1500);

    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error(error.message || "Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date for min date
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // All event types
  const allEventTypes: EventType[] = [
    'CONCERT', 'HIKE', 'DINNER', 'GAME_NIGHT', 
    'MEETUP', 'SPORT', 'ART', 'OTHER'
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/host/events">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Link>
            </Button>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
            <p className="text-muted-foreground mt-2">
              Fill in the details below to create your event
            </p>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Provide the essential details about your event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Enter event title"
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe your event in detail..."
                      rows={4}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">{errors.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="Where will the event take place?"
                        className="pl-10"
                      />
                    </div>
                    {errors.location && (
                      <p className="text-sm text-red-500">{errors.location}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category (Optional)</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      placeholder="e.g., Music, Sports, Technology"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Date & Time Card */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Date & Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="date">Event Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        min={getTomorrow()}
                        className="pl-10"
                      />
                    </div>
                    {errors.date && (
                      <p className="text-sm text-red-500">{errors.date}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Settings & Actions */}
            <div className="space-y-6">
              {/* Event Type & Settings Card */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Event Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Event Type */}
                  <div className="space-y-2">
                    <Label>Event Type</Label>
                    <Select
                      value={formData.eventType}
                      onValueChange={(value: EventType) => 
                        handleInputChange("eventType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {allEventTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {EVENT_TYPE_LABELS[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Max Participants */}
                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Max Participants (Optional)</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="maxParticipants"
                        type="number"
                        min="1"
                        value={formData.maxParticipants}
                        onChange={(e) => handleInputChange("maxParticipants", e.target.value)}
                        placeholder="Leave empty for unlimited"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Payment Settings */}
                  <div className="space-y-2">
                    <Label>Payment</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Is this a paid event?</span>
                        <Button
                          type="button"
                          variant={formData.isPaidEvent ? "default" : "outline"}
                          size="sm"
                          onClick={togglePaidEvent}
                        >
                          {formData.isPaidEvent ? "Paid" : "Free"}
                        </Button>
                      </div>

                      {formData.isPaidEvent && (
                        <div className="space-y-2">
                          <Label htmlFor="fee">Fee Amount ($)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="fee"
                              type="number"
                              min="0"
                              step="0.01"
                              value={formData.fee}
                              onChange={(e) => handleInputChange("fee", e.target.value)}
                              placeholder="0.00"
                              className="pl-10"
                            />
                          </div>
                          {errors.fee && (
                            <p className="text-sm text-red-500">{errors.fee}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Image Upload Card */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Event Image
                  </CardTitle>
                  <CardDescription>
                    Add an image to make your event stand out
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended: Cloudinary or ImgBB URL
                    </p>
                  </div>

                  {/* Image Preview */}
                  {formData.imageUrl && (
                    <div className="mt-4">
                      <Label>Preview</Label>
                      <div className="mt-2 rounded-lg overflow-hidden border">
                        <Image
                          src={formData.imageUrl}
                          alt="Event preview"
                          width={400}
                          height={160}
                          className="w-full h-40 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Card */}
              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">⟳</span>
                          Creating Event...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Create Event
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>

                    <div className="text-xs text-muted-foreground text-center">
                      <p>By creating this event, you agree to our Terms of Service.</p>
                      <p>Events may be subject to review by administrators.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;