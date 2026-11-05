import { Search, CalendarCheck, RotateCcw, ShieldCheck } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Browse & Select",
    description:
      "Explore our online library catalog by category, author, or title. Review ratings and available copies in real time.",
    icon: Search,
    color: "from-emerald-500 to-teal-500",
  },
  {
    step: "02",
    title: "Confirm Your Borrow",
    description:
      "Log into your account, pick your target return date, and borrow instantly. Available copies update automatically.",
    icon: CalendarCheck,
    color: "from-teal-500 to-cyan-500",
  },
  {
    step: "03",
    title: "Read & Return",
    description:
      "Enjoy reading at your pace. Once finished, return the book from your personal dashboard to replenish the library stock.",
    icon: RotateCcw,
    color: "from-cyan-500 to-emerald-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Simple Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            How Borrowing Works
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            A frictionless, community-first library experience. Add a book, borrow a book, return a book.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start"
              >
                {/* Step Pill */}
                <div className="w-full flex items-center justify-between mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md shadow-emerald-500/20`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-4xl font-black text-zinc-200 dark:text-zinc-800 tracking-tighter">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

