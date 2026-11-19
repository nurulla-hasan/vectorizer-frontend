"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { KeyRound } from "lucide-react";
import { z } from "zod";
import { FormInput } from "@/components/common/form-input";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/error";
import { errorToast, successToast } from "@/lib/toast";
import { useChangePassword } from "@/services";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, { error: "Current password is required" }),
    newPassword: z
      .string()
      .min(6, { error: "New password must be at least 6 characters" })
      .max(100),
    confirmPassword: z
      .string()
      .min(1, { error: "Please confirm your new password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordModal({
  open,
  onOpenChange,
}: ChangePasswordModalProps) {
  const { mutateAsync: updatePassword } = useChangePassword();

  const form = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: changePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const message = await updatePassword({
          oldPassword: value.oldPassword,
          newPassword: value.newPassword,
        });
        successToast(
          "Password changed",
          message || "Your password has been updated.",
        );
        form.reset();
        onOpenChange(false);
      } catch (error: unknown) {
        errorToast(
          "Password update failed",
          getErrorMessage(error, "Could not change password."),
        );
      }
    },
  });

  React.useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title="Change password"
      description="Enter your current password and choose a new one."
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <FormInput
          form={form}
          name="oldPassword"
          label="Current password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
        />

        <FormInput
          form={form}
          name="newPassword"
          label="New password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
        />

        <FormInput
          form={form}
          name="confirmPassword"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter new password"
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Button
                type="submit"
                size="default"
                loading={isSubmitting}
                loadingText="Updating..."
              >
                <KeyRound className="size-4" />
                Update password
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </Modal>
  );
}
