"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  { label: "Welcome", duration: 1500 },
  { label: "Zero to One Service", duration: 2500 },
];

export default function Home() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    let elapsed = 0;

    steps.forEach((step, index) => {
      timers.push(
        setTimeout(() => setStepIndex(index), elapsed)
      );
      elapsed += step.duration;
    });

    timers.push(
      setTimeout(() => router.push("/product"), elapsed)
    );

    return () => timers.forEach(clearTimeout);
  }, [router]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_32%),radial-gradient(circle_at_70%_10%,rgba(236,72,153,0.14),transparent_28%),radial-gradient(circle_at_50%_70%,rgba(16,185,129,0.1),transparent_30%)]" />
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300 backdrop-blur">
          Zero to One service
        </span>
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-sky-400/30 via-indigo-400/20 to-emerald-300/20" />
          <h1
            key={steps[stepIndex].label}
            className="relative font-display text-5xl leading-tight text-white sm:text-6xl lg:text-7xl transition-all duration-700 ease-out drop-shadow-[0_20px_80px_rgba(14,165,233,0.25)] animate-fade-up"
          >
            <span className="bg-gradient-to-r from-sky-300 via-white to-emerald-200 bg-clip-text text-transparent">
              {steps[stepIndex].label}
            </span>
          </h1>
        </div>
        <p className="text-base text-slate-300 sm:text-lg">
          잠시 후 제품 페이지로 이동합니다. 창을 닫지 말고 기다려 주세요.
        </p>
      </div>
    </main>
  );
}
