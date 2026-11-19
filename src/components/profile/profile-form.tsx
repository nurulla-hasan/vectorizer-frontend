"use client";

import { useForm } from "@tanstack/react-form";
import { Mail, ShieldCheck, User as UserIcon } from "lucide-react";
import { FormInput } from "@/components/common/form-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getInitials } from "@/lib/utils";
import { type AuthUser, useUpdateMe } from "@/services";
import {
  type UpdateProfileInput,
  updateProfileSchema,
} from "@/validations";

interface ProfileFormProps {
  user: AuthUser;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const { mutateAsync: updateProfile, isPending } = useUpdateMe();

  const form = useForm({
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
      imageUrl: user.imageUrl || "",
    },
    validators: {
      onSubmit: updateProfileSchema,
    },
    onSubmit: async ({ value }: { value: UpdateProfileInput }) => {
      await updateProfile({
        name: value.name.trim(),
        phone: value.phone?.trim() || undefined,
        imageUrl: value.imageUrl?.trim() || undefined,
      });
    },
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-studio-border bg-studio-panel p-6 sm:p-8 shadow-xl">
      {/* Background dot grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 vk-dot-grid opacity-30"
      />

      {/* Red notebook margin line on left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-6 sm:left-8 w-px bg-rose-500/25"
      />

      <div className="relative pl-4 sm:pl-6 space-y-6">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-studio-border/70 pb-3 font-mono text-xs text-studio-muted">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-studio-foreground">
              02 / PROFILE ATTRIBUTES
            </span>
            <span className="rounded bg-studio-surface px-2 py-0.5 text-xs text-studio-muted">
              PUBLIC SPEC
            </span>
          </div>
          <span className="text-xs text-studio-muted">{"//"} live sync</span>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-studio-foreground flex items-center gap-2">
            <UserIcon className="size-5 text-primary" />
            <span>Personal Information</span>
          </h3>
          <p className="text-xs text-studio-muted mt-1">
            Configure your crafter display name, contact phone, and avatar URL.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Avatar preview stamped frame */}
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-dashed border-studio-border bg-studio-surface/80 p-4 shadow-2xs">
            <span
              aria-hidden="true"
              className="absolute -top-2 left-6 h-4 w-16 bg-dot-min/70 rounded-xs shadow-xs -rotate-2"
            />
            <form.Subscribe selector={(state) => state.values.imageUrl}>
              {(previewUrl) => (
                <Avatar size="xl">
                  <AvatarImage
                    src={previewUrl || user.imageUrl}
                    alt={user.name}
                  />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              )}
            </form.Subscribe>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-studio-foreground">
                Crafter Avatar Preview
              </p>
              <p className="text-xs text-studio-muted">
                Paste an image URL below to render your custom avatar across the studio.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput
              form={form}
              name="name"
              label="Full Name"
              type="text"
              placeholder="e.g. Alex Morgan"
              description="Your crafter handle displayed on exports and studio renders."
            />

            <FormInput
              form={form}
              name="phone"
              label="Phone Number"
              type="tel"
              inputMode="tel"
              placeholder="e.g. 01712345678"
              description="11-digit Bangladeshi mobile number for bKash/Nagad verification."
            />
          </div>

          <FormInput
            form={form}
            name="imageUrl"
            label="Avatar Image URL"
            type="url"
            inputMode="url"
            placeholder="https://images.unsplash.com/photo-..."
            description="Direct link to a public image (JPG, PNG, WebP)."
          />

          {/* Email (Readonly) */}
          <div className="rounded-xl border border-studio-border/70 bg-studio-surface/60 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-studio-muted" />
                  <span className="text-sm font-medium text-studio-foreground">
                    Registered Email
                  </span>
                  <Badge variant="success">
                    <ShieldCheck className="size-3" />
                    Verified
                  </Badge>
                </div>
                <p className="text-sm font-mono text-studio-muted">
                  {user.email}
                </p>
              </div>
              <p className="text-xs text-studio-muted max-w-xs font-mono">
                Email is protected by your authentication provider.
              </p>
            </div>
          </div>

          <Separator className="bg-studio-border" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-xs text-studio-muted font-mono">
              {"//"} updates propagate instantly across sessions.
            </p>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmittingState]) => (
                <Button
                  type="submit"
                  size="lg"
                  disabled={!canSubmit || isPending || isSubmittingState}
                  className="w-full sm:w-auto"
                >
                  {isPending || isSubmittingState ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}
