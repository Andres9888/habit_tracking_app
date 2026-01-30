"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <motion.div
          className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="mt-4 sm:mt-8">
            <a
              href="#features"
              className="inline-flex items-center space-x-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-600 ring-1 ring-inset ring-amber-500/20 transition hover:bg-amber-500/20 dark:text-amber-400"
            >
              <span>New: Habit Strength tracking</span>
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          {/* Headline */}
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl dark:text-white">
            Build Habits
            <span className="block text-amber-500">That Stick</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Track your daily habits with beautiful chain visualizations.
            Don&apos;t break the chain - watch your streaks grow and build
            habits that transform your life.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex items-center gap-x-4">
            <a
              href="https://apps.apple.com/app/daily-habits"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download for iOS
            </a>
            <a
              href="#features"
              className="text-sm font-semibold leading-6 text-zinc-900 transition hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>

          {/* Social Proof */}
          <div className="mt-10 flex items-center gap-x-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="inline-block h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 ring-2 ring-white dark:ring-zinc-900"
                />
              ))}
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold text-zinc-900 dark:text-white">
                1,000+
              </span>{" "}
              habits built
            </div>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="relative">
              {/* Phone Mockup Placeholder */}
              <div className="relative mx-auto w-[280px] h-[580px] bg-zinc-900 rounded-[3rem] p-3 shadow-2xl ring-1 ring-zinc-800">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-zinc-900 rounded-b-2xl" />
                <div className="h-full w-full rounded-[2.5rem] bg-gradient-to-b from-amber-50 to-orange-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center overflow-hidden">
                  {/* Placeholder for app screenshot */}
                  <div className="text-center p-6">
                    <div className="text-6xl mb-4">🔗</div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      App screenshot goes here
                    </p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
                      Add to /public/screenshots/
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
