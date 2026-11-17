"use client";

import * as React from "react";
import { Building2, Clock, Mail, MessageSquare, Send } from "lucide-react";
import { PageHero, TitleAccent } from "@/components/common/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CtaSection } from "@/components/home/cta-section";
import { FaqSection } from "@/components/home/faq-section";
import { successToast } from "@/lib/toast";

const FIELD_CLASS =
  "border-border bg-card text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary/50 focus-visible:ring-primary/20";

export default function ContactPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    successToast(
      "Message received",
      "Thanks for reaching out — we will reply shortly.",
    );
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <>
      <PageHero
        badge="Contact"
        badgeIcon={MessageSquare}
        title={
          <>
            Talk to the people{" "}
            <TitleAccent id="contact-underline">behind the tracer.</TitleAccent>
          </>
        }
        description="Questions about vector quality, custom plans, or team accounts? Send us a note — a human on the tracing team writes back."
        extra={
          <div className="mt-8 space-y-3">
            <a
              href="mailto:support@vectorizer.app"
              className="group flex items-start gap-3 rounded-xl border border-border bg-card/70 p-4 transition-colors hover:border-primary/30 hover:bg-muted/70"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-trace/25 bg-trace/10 text-trace">
                <Mail className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-studio-foreground">Email</p>
                <p className="truncate text-sm text-studio-muted transition-colors group-hover:text-trace">
                  support@vectorizer.app
                </p>
              </div>
            </a>

            <div className="flex items-start gap-3 rounded-xl border border-border bg-card/70 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                <Building2 className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-studio-foreground">
                  Enterprise &amp; teams
                </p>
                <p className="text-sm text-studio-muted">
                  Custom volume &amp; dedicated processing queues
                </p>
              </div>
            </div>

            <p className="flex items-center gap-1.5 pt-1 text-xs text-studio-muted">
              <Clock className="size-3.5 text-trace" />
              We respond to inquiries within one business day.
            </p>
          </div>
        }
      >
        <div id="contact-form" className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/20 blur-3xl"
          />

          <div className="relative overflow-hidden rounded-2xl border border-studio-border bg-studio-surface/95 shadow-[0_40px_120px_-30px_color-mix(in_oklch,var(--shadow-color),transparent_80%)] backdrop-blur">
            <div
              aria-hidden="true"
              className="vk-blueprint-grid absolute inset-0 opacity-40"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-trace/50 to-transparent"
            />

            <div className="relative flex items-center gap-2 border-b border-studio-border/70 px-3 py-2.5">
              <span className="size-2 rounded-full bg-dot-close/80" />
              <span className="size-2 rounded-full bg-dot-min/80" />
              <span className="size-2 rounded-full bg-dot-max/80" />
              <span className="mx-2 h-4 w-px bg-studio-border/70" />
              <span className="truncate font-mono text-[11px] text-studio-muted">
                vectorizer / contact
              </span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-trace/30 bg-trace/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-trace uppercase">
                <Clock className="size-3" />1 business day
              </span>
            </div>

            <div className="relative p-6 sm:p-8">
              <span className="font-mono text-[10px] tracking-[0.2em] text-studio-muted uppercase">
                Send a message
              </span>

              <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-studio-foreground">
                Tell us what you&apos;re building.
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-studio-muted">
                Share your use case or attach details about your workflow.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-name" className="text-studio-foreground">
                    Name
                  </Label>
                  <Input
                    id="contact-name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={FIELD_CLASS}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact-email" className="text-studio-foreground">
                    Email
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={FIELD_CLASS}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact-message" className="text-studio-foreground">
                    Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    rows={4}
                    placeholder="How can we help?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={FIELD_CLASS}
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  <Send className="size-4" />
                  <span>Send Message</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </PageHero>

      <FaqSection />
      <CtaSection />
    </>
  );
}
