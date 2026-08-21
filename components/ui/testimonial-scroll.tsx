"use client";

import React from "react";

interface Testimonial {
  text: React.ReactNode;
  name: string;
  role: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    text: "Prowler replaced my entire VA team for lead generation. I pull 2,000 verified contacts in the time it used to take a week.",
    name: "Sarah Mitchell",
    role: "Agency Owner",
    company: "Growth Labs",
  },
  {
    text: (
      <>
        The owner enrichment feature is insane. LinkedIn, Instagram, Facebook all at once.{" "}
        <span className="accent-block">Nothing else does this.</span>
      </>
    ),
    name: "Marcus Chen",
    role: "Sales Director",
    company: "Apex Solutions",
  },
  {
    text: "I was paying $400/month for Apollo. Prowler does more for a one-time fee. Not even a question.",
    name: "Priya Sharma",
    role: "Founder",
    company: "LeadFlow",
  },
  {
    text: "The directory scraper with login support opened up databases I didn't know I could access. Game changer.",
    name: "David Torres",
    role: "Business Developer",
    company: "Nexus Group",
  },
  {
    text: (
      <>
        Set it up, walked away, came back to{" "}
        <span className="accent-block">5,000 leads exported</span> and ready to import into my CRM. That simple.
      </>
    ),
    name: "Emma Wilson",
    role: "Marketing Lead",
    company: "Scale Studio",
  },
  {
    text: "Google Maps scraping at this speed and accuracy. My competitors have no idea how I'm finding these leads.",
    name: "James Park",
    role: "Outreach Specialist",
    company: "Prospect Pro",
  },
  {
    text: "The AI fallback when scraping gets stuck is brilliant. It just works. 97% success rate on my jobs.",
    name: "Nina Rodriguez",
    role: "Lead Gen Consultant",
    company: "DataDrive",
  },
  {
    text: "Switched from Hunter + ZoomInfo combo. Prowler finds emails they miss and costs 10x less.",
    name: "Alex Thompson",
    role: "CEO",
    company: "Rapid Scale",
  },
];

const rowOne = testimonials.slice(0, 4);
const rowTwo = testimonials.slice(4, 8);

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="w-[400px] shrink-0 rounded-2xl border border-border bg-white p-8 flex flex-col justify-between min-h-[260px] transition-transform duration-300 hover:scale-[1.02] shadow-sm">
      <div>
        <div className="text-5xl font-display font-black leading-none mb-4 select-none text-border">
          &ldquo;
        </div>
        <p className="font-medium leading-relaxed text-base italic text-foreground/90">
          {t.text}
        </p>
      </div>
      <div className="mt-8 pt-6 border-t border-border">
        <p className="font-black text-sm tracking-tight text-foreground">
          {t.name}
        </p>
        <p className="text-xs mt-1 font-bold tracking-wide uppercase text-muted">
          {t.role} · {t.company}
        </p>
      </div>
    </div>
  );
}

function MarqueeRow({ items, reverse = false }: { items: Testimonial[]; reverse?: boolean }) {
  // Triple items so -50% loops seamlessly
  const loop = [...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden w-full">
      <div
        className={`flex w-max gap-6 py-4 hover:[animation-play-state:paused] ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {loop.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 relative bg-background overflow-hidden">
      {/* Header without eyebrow */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center relative z-20">
        <h2 className="text-display-sm md:text-display-md text-foreground">
          What our users say.
        </h2>
      </div>

      <div className="relative">
        {/* Soft edge gradient fades */}
        <div className="absolute inset-y-0 left-0 w-16 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="space-y-6">
          <MarqueeRow items={rowOne} />
          <MarqueeRow items={rowTwo} reverse />
        </div>
      </div>
    </section>
  );
}