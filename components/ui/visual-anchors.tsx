"use client";

import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        setDisplayed(text.slice(0, i));
        if (i >= text.length && interval) clearInterval(interval);
      }, 45);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, delay]);

  return <span>{displayed}</span>;
}

/**
 * InlineAnnotation
 * Parent MUST be `position: relative`.
 * No viewBox — path coordinates = pixels, overflow visible so long curves work.
 */
export function InlineAnnotation({
  text,
  path,
  textStyles,
  svgStyles,
  delay = 0,
}: {
  text: string;
  path: string;
  textStyles: React.CSSProperties;
  svgStyles?: React.CSSProperties;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  return (
    <span
      ref={ref}
      className="absolute inset-0 pointer-events-none z-30 overflow-visible"
      aria-hidden
    >
      <svg
        width="220"
        height="160"
        className="absolute text-foreground"
        style={{
          overflow: "visible",
          overflowClipMargin: "content-box",
          ...svgStyles,
        }}
      >
        <motion.path
          d={path}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      <span
        className="absolute font-handwriting text-[22px] md:text-[26px] text-foreground whitespace-nowrap leading-none tracking-wide"
        style={textStyles}
      >
        {isInView && <Typewriter text={text} delay={delay + 0.75} />}
      </span>
    </span>
  );
}

function CountUp({ value, duration = 2 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
  if (!match) return <span>{value}</span>;

  const [, prefix, numStr, suffix] = match;
  const target = parseFloat(numStr.replace(/,/g, ""));
  const hasCommas = numStr.includes(",");
  const decimals = numStr.split(".")[1]?.length ?? 0;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return controls.stop;
  }, [isInView, target, duration]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : hasCommas
        ? Math.round(display).toLocaleString()
        : Math.round(display).toString();

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export function StatBubble({
  value,
  label,
  type = "static",
  rotation = "0deg",
  className = "",
  delay = 0,
}: {
  value: string;
  label: string;
  type?: "static" | "progress" | "count";
  rotation?: string;
  className?: string;
  delay?: number;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (type !== "progress") return;
    const interval = setInterval(
      () => setProgress((p) => (p >= 100 ? 0 : p + 2)),
      60
    );
    return () => clearInterval(interval);
  }, [type]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.03 }}
      className={`absolute z-10 bg-white border border-border rounded-2xl px-5 py-4 shadow-sm pointer-events-auto min-w-[160px] ${className}`}
      style={{ transform: `rotate(${rotation})` }}
    >
      <div className="text-3xl font-display font-black tracking-tight text-foreground leading-none mb-2">
        {type === "count" || type === "progress" ? (
          <CountUp value={value} />
        ) : (
          value
        )}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
        {label}
      </div>
      {type === "progress" && (
        <div className="mt-3 h-1 w-full bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  );
}