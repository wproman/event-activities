/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation */
"use client";


import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createHost } from "@/services/auth/registerHost";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

// Temporary InputFieldError component (if you don't have it)
const InputFieldError = ({ field, state }: { field: string; state: any }) => {
  if (!state?.errors?.[field]) return null;
  return (
    <div className="space-y-1">
      {state.errors[field].map((error: string, idx: number) => (
        <p key={idx} className="text-sm text-red-500">
          {error}
        </p>
      ))}
    </div>
  );
};

export default function CreateHostForm() {
  const [state, formAction, isPending] = useActionState(createHost, null);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
    // Remove the success toast or TypeScript will complain
    // The auto-login will redirect user anyway
  }, [state]);

  return (
    <form action={formAction}>
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <Field>
            <FieldLabel htmlFor="name">Full Name *</FieldLabel>
            <Input id="name" name="name" type="text" placeholder="John Doe" required />
            <InputFieldError field="name" state={state} />
          </Field>

          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email *</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="host@example.com"
              required
            />
            <InputFieldError field="email" state={state} />
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Password *</FieldLabel>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              minLength={6}
            />
            <FieldDescription>Minimum 6 characters</FieldDescription>
            <InputFieldError field="password" state={state} />
          </Field>

          {/* Bio */}
          <Field>
            <FieldLabel htmlFor="bio">Bio *</FieldLabel>
            <Input
              id="bio"
              name="bio"
              type="text"
              placeholder="Tell about your experience..."
              required
            />
            <InputFieldError field="bio" state={state} />
          </Field>

          {/* Avatar URL */}
          <Field>
            <FieldLabel htmlFor="avatarUrl">
              Profile Picture URL <span className="text-gray-400">(Optional)</span>
            </FieldLabel>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              placeholder="https://example.com/photo.jpg"
            />
            <FieldDescription>Or upload a file below</FieldDescription>
            <InputFieldError field="avatarUrl" state={state} />
          </Field>

          {/* City */}
          <Field>
            <FieldLabel htmlFor="city">City *</FieldLabel>
            <Input id="city" name="city" type="text" placeholder="Dhaka" required />
            <InputFieldError field="city" state={state} />
          </Field>

          {/* Interests */}
          <Field className="md:col-span-2">
            <FieldLabel htmlFor="interests">Interests *</FieldLabel>
            <Input
              id="interests"
              name="interests"
              type="text"
              placeholder="cooking, hiking, travel, photography"
              required
            />
            <FieldDescription>Comma separated list of your interests</FieldDescription>
            <InputFieldError field="interests" state={state} />
          </Field>

          {/* File Upload */}
          <Field className="md:col-span-2">
            <FieldLabel htmlFor="file">
              Profile Photo <span className="text-gray-400">(Optional)</span>
            </FieldLabel>
            <Input
              id="file"
              name="file"
              type="file"
              accept="image/*"
            />
            <FieldDescription>Upload a profile photo (JPG, PNG)</FieldDescription>
          </Field>
        </div>

        {/* Submit Button */}
        <FieldGroup className="mt-6">
          <Field>
            <Button type="submit" disabled={isPending} className="w-full py-6 text-lg">
              {isPending ? "Creating Host Account..." : "Become a Host"}
            </Button>

            <FieldDescription className="px-6 text-center mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline font-medium">
                Sign in
              </a>
              <br />
              Want to join as a regular user?{" "}
              <a href="/register" className="text-blue-600 hover:underline font-medium">
                Create regular account
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
}