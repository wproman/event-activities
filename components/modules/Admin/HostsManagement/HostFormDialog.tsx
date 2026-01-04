"use client";

import { IUser } from "@/app/types/host.interface";
import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createHost, updateHost } from "@/services/admin/hostManagement";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

interface IHostFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  host?: IUser;
}

const HostFormDialog = ({
  open,
  onClose,
  onSuccess,
  host,
}: IHostFormDialogProps) => {
  const isEdit = !!host;

  const [state, formAction, pending] = useActionState(
    isEdit ? updateHost.bind(null, host.id!) : createHost,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      onSuccess();
      onClose();
    } else if (state && !state.success) {
      toast.error(state.message);
    }
  }, [state, onSuccess, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{isEdit ? "Edit Host" : "Add New Host"}</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-4">
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                defaultValue={isEdit ? host?.name : undefined}
              />
              <InputFieldError state={state} field="name" />
            </Field>

            <Field>
              <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John William Doe"
                defaultValue={isEdit ? host?.fullName : undefined}
              />
              <InputFieldError state={state} field="fullName" />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="host@example.com"
                defaultValue={isEdit ? host?.email : undefined}
                disabled={isEdit}
              />
              <InputFieldError state={state} field="email" />
            </Field>

            {!isEdit && (
              <>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                  />
                  <InputFieldError state={state} field="password" />
                </Field>
              </>
            )}

            <Field>
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself..."
                defaultValue={isEdit ? host?.bio || "" : undefined}
                rows={3}
              />
              <InputFieldError state={state} field="bio" />
            </Field>

            <Field>
              <FieldLabel htmlFor="interests">
                Interests (comma separated)
              </FieldLabel>
              <Input
                id="interests"
                name="interests"
                placeholder="coding, hiking, reading"
                defaultValue={
                  isEdit ? host?.interests?.join(", ") || "" : undefined
                }
              />
              <InputFieldError state={state} field="interests" />
            </Field>

            <Field>
              <FieldLabel htmlFor="city">City</FieldLabel>
              <Input
                id="city"
                name="city"
                placeholder="New York"
                defaultValue={isEdit ? host?.city || "" : undefined}
              />
              <InputFieldError state={state} field="city" />
            </Field>

            {isEdit && (
              <>
                <Field>
                  <FieldLabel htmlFor="ratingAvg">Average Rating</FieldLabel>
                  <Input
                    id="ratingAvg"
                    name="ratingAvg"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="4.5"
                    defaultValue={isEdit ? host?.ratingAvg : undefined}
                  />
                  <InputFieldError state={state} field="ratingAvg" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="ratingCount">Rating Count</FieldLabel>
                  <Input
                    id="ratingCount"
                    name="ratingCount"
                    type="number"
                    min="0"
                    placeholder="120"
                    defaultValue={isEdit ? host?.ratingCount : undefined}
                  />
                  <InputFieldError state={state} field="ratingCount" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="needPasswordChange">
                    Require Password Change
                  </FieldLabel>
                  <Input
                    id="needPasswordChange"
                    name="needPasswordChange"
                    type="checkbox"
                    className="w-4 h-4"
                    defaultChecked={isEdit ? host?.needPasswordChange : true}
                  />
                  <span className="ml-2 text-sm">
                    User must change password on next login
                  </span>
                  <InputFieldError state={state} field="needPasswordChange" />
                </Field>
              </>
            )}

            {!isEdit && (
              <Field>
                <FieldLabel htmlFor="file">Profile Photo</FieldLabel>
                <Input id="file" name="file" type="file" accept="image/*" />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a profile photo for the host
                </p>
                <InputFieldError state={state} field="file" />
              </Field>
            )}
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : isEdit ? "Update Host" : "Create Host"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HostFormDialog;
