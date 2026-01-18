"use client";

import { motion } from "framer-motion";
import { Link2, TrendingUp, BarChart3, Palette, Bell, Shield } from "lucide-react";

const features = [
  {
    name: "Chain Visualization",
    description:
      "See your streaks as connected chains. Visual motivation that makes you never want to break the chain.",
    icon: Link2,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    name: "Habit Strength",
    description:
      "Watch your habits get stronger over time. The more consistent you are, the stronger your habits become.",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    name: "Progress Insights",
    description:
      "Beautiful charts and stats to track your journey. Understand your patterns and optimize your routines.",
    icon: BarChart3,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    name: "Beautiful Design",
    description:
      "Clean, minimal, and distraction-free. Focus on what matters - building habits that last.",
    icon: Palette,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    name: "Smart Reminders",
    description:
      "Gentle nudges at the right time. Set custom reminders for each habit to stay on track.",
    icon: Bell,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    name: "Privacy First",
    description:
      "Your data stays secure. We never sell your information or track you for advertising.",
    icon: Shield,
    color: "text-zinc-500",
    bgColor: "bg-zinc-500/10",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="bg-white py-24 dark:bg-zinc-950 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            className="text-base font-semibold leading-7 text-amber-500"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Everything you need
          </motion.h2>
          <motion.p
            className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Why Daily Habits?
          </motion.p>
          <motion.p
            className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Simple, beautiful, and effective. Everything designed to help you
            build habits that actually stick.
          </motion.p>
        </div>

        <motion.div
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                variants={item}
                className="group relative rounded-2xl p-6 transition hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-zinc-900 dark:text-white">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.bgColor}`}
                  >
                    <feature.icon
                      className={`h-5 w-5 ${feature.color}`}
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
