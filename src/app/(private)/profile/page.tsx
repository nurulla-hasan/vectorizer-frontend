"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  CreditCard,
  ReceiptText,
  Shield,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { PageWrapper } from "@/components/common/page-wrapper";
import {
  ProfileBanner,
  ProfileForm,
  ProfileMetrics,
  ProfilePaymentsTab,
  ProfilePlanTab,
  ProfileSecurityTab,
  ProfileSkeleton,
} from "@/components/profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetMe, useMyPaymentRequests } from "@/services";

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function ProfilePage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const { data: user, isLoading: isUserLoading } = useGetMe();
  const { data: paymentRequests = [], isLoading: isRequestsLoading } =
    useMyPaymentRequests({ enabled: Boolean(user) });

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace("/auth/login?callbackUrl=/profile");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-studio-surface pb-16">

      {/* Dot-grid notebook background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 vk-dot-grid opacity-40"
      />

      <PageWrapper className="relative space-y-6">

          {/* Sketchy Top Header matching Hero & Plans */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
            className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-studio-border/70 pb-6"
          >
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-mono text-xs tracking-wider text-studio-muted">
                  <span className="text-studio-muted/60">{"//"}</span> Account Profile · Vectorizer Workbench
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-xs font-medium text-primary">
                  <Sparkles className="size-3" />
                  CRAFTER WORKSPACE
                </span>
              </div>

              <h1 className="mt-2 font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                Studio Account{" "}
                <span className="font-hand text-primary italic font-normal text-3xl sm:text-4xl">
                  · profile
                </span>
              </h1>
              <p className="mt-1 max-w-xl text-xs sm:text-sm text-studio-muted">
                Manage your crafter identity, vector engine presets, credits quota, and security credentials.
              </p>
            </div>
          </motion.div>

          {/* Profile Studio Banner with Stacked Sheets & Craft Tape */}
          <ProfileBanner user={user} />

          {/* Metric Overview Cards (The 3 Blueprint Dials) */}
          <ProfileMetrics user={user} />

          {/* Shadcn Navigation Tabs */}
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList
              variant="line"
              className="border-b"
            >
              <TabsTrigger value="profile" className="gap-2 font-mono text-xs sm:text-sm">
                <UserIcon className="size-4" />
                <span>Profile Details</span>
              </TabsTrigger>

              <TabsTrigger value="plan" className="gap-2 font-mono text-xs sm:text-sm">
                <CreditCard className="size-4" />
                <span>Plan & Features</span>
              </TabsTrigger>

              <TabsTrigger value="security" className="gap-2 font-mono text-xs sm:text-sm">
                <Shield className="size-4" />
                <span>Security & Access</span>
              </TabsTrigger>

              <TabsTrigger value="payments" className="gap-2 font-mono text-xs sm:text-sm">
                <ReceiptText className="size-4" />
                <span>Payment History ({paymentRequests.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileForm user={user} />
            </TabsContent>

            <TabsContent value="plan">
              <ProfilePlanTab user={user} />
            </TabsContent>

            <TabsContent value="security">
              <ProfileSecurityTab user={user} />
            </TabsContent>

            <TabsContent value="payments">
              <ProfilePaymentsTab
                paymentRequests={paymentRequests}
                isLoading={isRequestsLoading}
              />
            </TabsContent>
          </Tabs>
      </PageWrapper>
    </div>
  );
}
