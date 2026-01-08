/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { User } from "@/app/types";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import Modal from "./Modal";

// Define your interest list here (or import from a constants file)
const ALL_INTERESTS: string[] = [
  "programming", "reading", "hiking", "traveling", "cooking",
  "photography", "music", "sports", "gaming", "art", "technology",
  "movies", "fitness", "food", "writing", "dancing", "science",
  "business", "education", "nature", "volunteering"
];

// Create readable labels for display
const INTEREST_LABELS: Record<string, string> = {
  "programming": "Programming",
  "reading": "Reading",
  "hiking": "Hiking",
  "traveling": "Traveling",
  "cooking": "Cooking",
  "photography": "Photography",
  "music": "Music",
  "sports": "Sports",
  "gaming": "Gaming",
  "art": "Art",
  "technology": "Technology",
  "movies": "Movies",
  "fitness": "Fitness",
  "food": "Food",
  "writing": "Writing",
  "dancing": "Dancing",
  "science": "Science",
  "business": "Business",
  "education": "Education",
  "nature": "Nature",
  "volunteering": "Volunteering"
};

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updates: Partial<User>) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
  isLoading,
  setIsLoading,
}) => {
  // Initialize form data with User type fields
  const [formData, setFormData] = useState<Partial<User>>({
    name: user.name,
    bio: user.bio || "",
    city: user.city || "",
    avatarUrl: user.avatarUrl || "",
    interests: user.interests || [], // This should be string[] based on your schema
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const currentInterests = prev.interests || [];
      const isChecked = currentInterests.includes(interest);
      
      // Create a new array based on whether interest is being added or removed
      const newInterests = isChecked
        ? currentInterests.filter((i) => i !== interest) // Remove
        : [...currentInterests, interest]; // Add
      
      return {
        ...prev,
        interests: newInterests,
      };
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required";
    if (formData.name && formData.name.length < 2)
      newErrors.name = "Name must be at least 2 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      // Log what's being sent for debugging
      console.log("Saving profile data:", formData);
      
      // Filter out any empty interest strings
      const cleanedData = {
        ...formData,
        interests: formData.interests?.filter(interest => interest.trim() !== "") || []
      };
      
      await onSave(cleanedData);
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Profile Image Input */}
        <div className="space-y-2">
          <Label htmlFor="avatarUrl">Profile Image URL</Label>
          <Input
            id="avatarUrl"
            value={formData.avatarUrl || ""}
            onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* City Input */}
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city || ""}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="City, State"
          />
        </div>

        {/* Bio Textarea */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio || ""}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>

        {/* Interests Checkboxes */}
        <div className="space-y-3">
          <Label>Interests ({formData.interests?.length || 0} selected)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ALL_INTERESTS.map((interest) => (
              <div key={interest} className="flex items-center space-x-2">
                <Checkbox
                  id={`interest-${interest}`}
                  checked={formData.interests?.includes(interest) || false}
                  onCheckedChange={() => handleInterestToggle(interest)}
                />
                <Label
                  htmlFor={`interest-${interest}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {INTEREST_LABELS[interest] || interest}
                </Label>
              </div>
            ))}
          </div>
          {formData.interests && formData.interests.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Selected: {formData.interests.join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal; 