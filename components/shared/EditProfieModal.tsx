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

// Define or import your interest constants
type Interest = string;
const ALL_INTERESTS: Interest[] = []; // Replace with actual array
const INTEREST_LABELS: Record<Interest, string> = {}; // Replace with actual mapping

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
    interests: user.interests || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => {
      const currentInterests = prev.interests || [];
      return {
        ...prev,
        interests: currentInterests.includes(interest)
          ? currentInterests.filter((i) => i !== interest)
          : [...currentInterests, interest],
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
      // Send the form data directly (it already matches User type)
      await onSave(formData);
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
          <Label>Interests</Label>
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
                  {INTEREST_LABELS[interest]}
                </Label>
              </div>
            ))}
          </div>
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