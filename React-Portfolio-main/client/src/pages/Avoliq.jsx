import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Code, Zap, Package, Users, FileText, ArrowRight, Mail } from 'lucide-react';

export const Avoliq = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-100 via-background/70 to-primary/5 text-slate-900">
      <div className="container mx-auto px-4 py-16 lg:py-24 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-3 rounded-full bg-slate-900 text-white px-4 py-2 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> Product Showcase
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-6">
              Showcase your services with a polished product page.
            </h1>
            <p className="text-lg leading-8 text-slate-600 mb-8">
              A professional landing experience designed for clean messaging, clear value, and fast deployment. Perfect for portfolios, case studies, and product launches.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.a
                href="#features"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-3 text-white font-semibold shadow-lg shadow-slate-900/10 transition"
              >
                Explore features <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-700 hover:bg-slate-50 transition">
                  Back to portfolio
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-[32px] bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] overflow-hidden border border-slate-200"
          >
            <div className="p-6 bg-slate-950 text-white">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Portfolio UI</p>
                  <h2 className="text-xl font-semibold mt-2">A professional landing layout</h2>
                </div>
                <span className="rounded-full bg-slate-700 px-3 py-1 text-xs">Live</span>
              </div>
              <div className="h-72 rounded-3xl bg-gradient-to-tr from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center text-white text-sm text-center px-10">
                Visual preview area for your product page, features, and messaging.
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 p-5 bg-slate-50">
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Conversion</p>
                <p className="mt-2 font-semibold">Clear call-to-actions</p>
              </div>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Speed</p>
                <p className="mt-2 font-semibold">Optimized for modern devices</p>
              </div>
            </div>
          </motion.div>
        </div>

        <section id="features" className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-50 text-violet-700 mb-5">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Developer-ready</h3>
            <p className="text-sm leading-6 text-slate-600">Clean component structure, reusable sections, and easy customization for any portfolio.</p>
          </div>
          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 mb-5">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Performance focused</h3>
            <p className="text-sm leading-6 text-slate-600">Minimal bundle weight, fast rendering, and a layout that keeps attention where it matters.</p>
          </div>
          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 mb-5">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Designed to convert</h3>
            <p className="text-sm leading-6 text-slate-600">Trust-building sections, strategic spacing, and polished typography for personal brands.</p>
          </div>
        </section>

        <section className="mt-16 bg-slate-950 text-white rounded-[32px] overflow-hidden shadow-[0_30px_100px_rgba(15,23,42,0.2)]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-10 sm:p-14">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 mb-5">
                <FileText className="w-4 h-4" /> Case Study
              </span>
              <h2 className="text-3xl font-semibold mb-4">A landing page that feels premium.</h2>
              <p className="text-slate-300 leading-7 mb-8">This page is built to present your work with confidence while remaining flexible enough to adapt to your brand voice.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">Designed for</p>
                  <p className="font-semibold mt-2">Consultants, freelancers, product launches</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-400">Includes</p>
                  <p className="font-semibold mt-2">Hero, features, proof, and CTA sections</p>
                </div>
              </div>
            </div>
            <div className="relative bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.3),_transparent_40%)] p-10 sm:p-14">
              <div className="rounded-[28px] bg-slate-900/95 p-8 shadow-2xl border border-white/10">
                <div className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-400">Ready to launch</div>
                <div className="space-y-3">
                  <div className="rounded-3xl bg-slate-950 p-5 border border-slate-800">
                    <p className="text-slate-400 text-sm">Fast deployment</p>
                    <p className="font-semibold">React + Vite starter</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950 p-5 border border-slate-800">
                    <p className="text-slate-400 text-sm">Modern styling</p>
                    <p className="font-semibold">Tailwind utility system</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950 p-5 border border-slate-800">
                    <p className="text-slate-400 text-sm">Polished layout</p>
                    <p className="font-semibold">Professional visual hierarchy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold">Your next portfolio landing page</h2>
            <p className="text-slate-600 mt-3">Customizable sections, clear messaging, and a design built to convert visitors into leads.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Simple setup</h3>
              <p className="text-slate-600 text-sm leading-6">Install in your portfolio and update the copy to match your services.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Professional copy</h3>
              <p className="text-slate-600 text-sm leading-6">Use strong headlines, feature-oriented bullets, and a clear call to action.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Custom visuals</h3>
              <p className="text-slate-600 text-sm leading-6">Swap in your screenshots, icons, or brand colors to make it your own.</p>
            </div>
          </div>
        </section>

        <section id="contact" className="mt-16 rounded-[32px] border border-slate-200 bg-slate-950 text-white p-10 shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] items-center">
            <div>
              <span className="text-sm uppercase tracking-[0.3em] text-slate-400">Contact</span>
              <h2 className="mt-4 text-3xl font-semibold">Let’s build a polished page for your brand.</h2>
              <p className="mt-4 max-w-2xl text-slate-300 leading-7">Share your idea, services, or project goals and I’ll turn it into a professional landing page with strong visuals, clean layout, and a clear conversion path.</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="mailto:sinhaaayush2001@gmail.com?subject=Landing Page Inquiry"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-300 px-6 py-3 text-slate-950 font-semibold shadow-lg shadow-slate-900/20 transition hover:brightness-105"
                >
                  <Mail className="w-4 h-4" /> Email me
                </a>
                <a
                  href="https://www.linkedin.com/in/aayush-sinha-1a1a4b1a5/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-slate-100 font-semibold hover:bg-slate-800 transition"
                >
                  Connect on LinkedIn
                </a>
              </div>
            </div>
            <div className="rounded-[28px] bg-slate-900/95 p-8 border border-slate-800 shadow-2xl">
              <div className="space-y-5">
                <div className="rounded-3xl bg-slate-950 p-5 border border-slate-800">
                  <p className="text-sm text-slate-500">Best for</p>
                  <p className="font-semibold mt-2">Personal brand websites, portfolios, launches</p>
                </div>
                <div className="rounded-3xl bg-slate-950 p-5 border border-slate-800">
                  <p className="text-sm text-slate-500">Delivery</p>
                  <p className="font-semibold mt-2">Fast turnaround, customized layout, copy-ready content</p>
                </div>
                <div className="rounded-3xl bg-slate-950 p-5 border border-slate-800">
                  <p className="text-sm text-slate-500">Support</p>
                  <p className="font-semibold mt-2">Responsive updates and branding polish</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 bg-slate-900 text-white rounded-[32px] p-10 shadow-[0_25px_80px_rgba(15,23,42,0.18)]">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-sm uppercase tracking-[0.3em] text-slate-400">Move faster</span>
            <h2 className="text-3xl font-semibold">Want me to integrate this directly for you?</h2>
            <p className="max-w-2xl text-slate-300">I can customize the components, add your branding, and launch a polished landing experience in your portfolio.</p>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-slate-900 font-semibold hover:bg-slate-100 transition">Request integration</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Avoliq;