"use client";

import React from "react";
import { motion } from "framer-motion";

interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    text: "Prowler replaced my entire VA team for lead generation. I pull 2,000 verified contacts in the time it used to take a week.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Sarah Mitchell",
    role: "Agency Owner",
    company: "Growth Labs",
  },
  {
    text: "The owner enrichment feature is insane. LinkedIn, Instagram, Facebook all at once. Nothing else does this.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Marcus Chen",
    role: "Sales Director",
    company: "Apex Solutions",
  },
  {
    text: "I was paying $400/month for Apollo. Prowler does more for a one-time fee. Not even a question.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Priya Sharma",
    role: "Founder",
    company: "LeadFlow",
  },
  {
    text: "The directory scraper with login support opened up databases I didn't know I could access. Game changer.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "David Torres",
    role: "Business Developer",
    company: "Nexus Group",
  },
  {
    text: "Set it up, walked away, came back to 5,000 leads exported and ready to import into my CRM. That simple.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Emma Wilson",
    role: "Marketing Lead",
    company: "Scale Studio",
  },
  {
    text: "Google Maps scraping at this speed and accuracy. My competitors have no idea how I'm finding these leads.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "James Park",
    role: "Outreach Specialist",
    company: "Prospect Pro",
  },
  {
    text: "The AI fallback when scraping gets stuck is brilliant. It just works. 97% success rate on my jobs.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Nina Rodriguez",
    role: "Lead Gen Consultant",
    company: "DataDrive",
  },
  {
    text: "Switched from Hunter + ZoomInfo combo. Prowler finds emails they miss and costs 10x less.",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Alex Thompson",
    role: "CEO",
    company: "Rapid Scale",
  },
  {
    text: "The credential vault keeps my login details safe across 50+ directory sites. Security done right.",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Leila Hassan",
    role: "Research Analyst",
    company: "Insight Corp",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = ({
  testimonials,
  duration = 15,
  className,
}: {
  testimonials: Testimonial[];
  duration?: number;
  className?: string;
}) => (
  <div className={className}>
    <motion.ul
      animate={{ translateY: "-50%" }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        repeatType: "loop",
      }}
      className="flex flex-col gap-4 pb-4 list-none m-0 p-0"
    >
      {[...Array(2)].map((_, dupIndex) => (
        <React.Fragment key={dupIndex}>
          {testimonials.map(({ text, image, name, role, company }, i) => (
            <motion.li
              key={`${dupIndex}-${i}`}
              aria-hidden={dupIndex === 1 ? "true" : "false"}
              whileHover={{
                scale: 1.02,
                y: -4,
                transition: { type: "spring", stiffness: 400, damping: 17 },
              }}
              className="p-6 rounded-2xl border border-border bg-bg-surface max-w-xs w-full cursor-default select-none"
            >
              <blockquote className="m-0 p-0">
                <p className="text-text-secondary leading-relaxed text-sm m-0">
                  &ldquo;{text}&rdquo;
                </p>
                <footer className="flex items-center gap-3 mt-4">
                  <img
                    width={36}
                    height={36}
                    src={image}
                    alt={`${name}`}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-border"
                  />
                  <div className="flex flex-col">
                    <cite className="font-semibold not-italic text-text-primary text-sm">
                      {name}
                    </cite>
                    <span className="text-xs text-text-muted">
                      {role} · {company}
                    </span>
                  </div>
                </footer>
              </blockquote>
            </motion.li>
          ))}
        </React.Fragment>
      ))}
    </motion.ul>
  </div>
);

export function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-bg-deep">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center justify-center max-w-xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center gap-2 border border-border bg-bg-surface px-4 py-1.5 rounded-full text-xs font-medium text-text-secondary uppercase tracking-widest mb-6">
            Real Results
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-4">
            What our users say
          </h2>
          <p className="text-text-secondary text-lg">
            Over 1,200 businesses use Prowler to find their next customers
            every day.
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[700px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={22}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={16}
          />
        </div>
      </div>
    </section>
  );
}