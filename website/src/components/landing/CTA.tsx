"use client";

import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="bg-zinc-900 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Build Better Habits?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-300">
            Join thousands of people who have transformed their lives with Chain
            Day. Start your journey today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="https://apps.apple.com/app/chain-day"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              Download for iOS
            </a>
            <a
              href="#features"
              className="text-sm font-semibold leading-6 text-white transition hover:text-zinc-300"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
