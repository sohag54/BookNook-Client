import Link from "next/link";
import { BookOpen, Atom, Landmark, Baby, Compass, ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Fiction",
    description: "Novels, fantasy realms, and literary fiction that captivate your mind.",
    icon: BookOpen,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400",
    badge: "Most Popular",
  },
  {
    name: "Science",
    description: "Astrophysics, biology, cosmology, and cutting-edge technology.",
    icon: Atom,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
    badge: "Trending",
  },
  {
    name: "History",
    description: "Fascinating historical accounts, biographies, and world-shaping events.",
    icon: Landmark,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    badge: "Timeless",
  },
  {
    name: "Kids",
    description: "Illustrated adventures, bedtime stories, and youth learning series.",
    icon: Baby,
    color: "bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400",
    badge: "Family Pick",
  },
  {
    name: "Others",
    description: "Philosophy, art, self-growth, and miscellaneous niche discoveries.",
    icon: Compass,
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    badge: "Diverse",
  },
];

export default function TopCategories() {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-white dark:bg-zinc-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
            <span>Catalog Explorer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Top Categories
          </h2>
          <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Find the genre you love or discover something brand new across our diverse shelves.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/books`}
                className="group flex flex-col p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                    {cat.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">
                  {cat.description}
                </p>

                <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Browse {cat.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

