/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { registerUser } from "@/services/auth/registerUser";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerUser, null);
  console.log(state, "state", isPending, "isPending");

  const getFieldError = (fieldName: string) => {
    if (state && !state.success && state.errors) {
      const error = state.errors.find((err: any) => err.field === fieldName);
      if (error) {
        return error.message;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

     useEffect(() => {
      if (state && !state.success && state.message) {
        toast.error(state.message);
      }
    }, [state]);
return (
    <form action={formAction}>
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input id="name" name="name" type="text" placeholder="John Doe" />
            {getFieldError("name") && (
              <FieldDescription className="text-red-600">
                {getFieldError("name")}
              </FieldDescription>
            )}
          </Field>

          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
            />
            {getFieldError("email") && (
              <FieldDescription className="text-red-600">
                {getFieldError("email")}
              </FieldDescription>
            )}
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" name="password" type="password" />
            {getFieldError("password") && (
              <FieldDescription className="text-red-600">
                {getFieldError("password")}
              </FieldDescription>
            )}
          </Field>

          {/* Bio */}
          <Field>
            <FieldLabel htmlFor="bio">Bio</FieldLabel>
            <Input
              id="bio"
              name="bio"
              type="text"
              placeholder="Write a short bio..."
            />
            {getFieldError("bio") && (
              <FieldDescription className="text-red-600">
                {getFieldError("bio")}
              </FieldDescription>
            )}
          </Field>

          {/* Avatar URL */}
   {/* <Field>
  <FieldLabel htmlFor="avatarUrl">
    Profile Picture URL <span className="text-gray-400">(Optional - can add later)</span>
  </FieldLabel>
  <Input
    id="avatarUrl"
    name="avatarUrl"
    type="url"
    placeholder="Leave empty if no picture now"
  />
  <FieldDescription className="text-gray-500 text-sm">
    You can add profile picture later from settings
  </FieldDescription>
</Field> */}

          {/* City */}
          <Field>
            <FieldLabel htmlFor="city">City</FieldLabel>
            <Input
              id="city"
              name="city"
              type="text"
              placeholder="Dhaka"
            />
            {getFieldError("city") && (
              <FieldDescription className="text-red-600">
                {getFieldError("city")}
              </FieldDescription>
            )}
          </Field>

          {/* Interests */}
          <Field className="md:col-span-2">
            <FieldLabel htmlFor="interests">
              Interests (comma separated)
            </FieldLabel>
            <Input
              id="interests"
              name="interests"
              type="text"
              placeholder="sports, coding, travel"
            />
            {getFieldError("interests") && (
              <FieldDescription className="text-red-600">
                {getFieldError("interests")}
              </FieldDescription>
            )}
          </Field>
        </div>

        {/* Submit Button */}
        <FieldGroup className="mt-4">
          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>

            <FieldDescription className="px-6 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;