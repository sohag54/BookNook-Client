"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, Library, Layers } from "lucide-react";

const slides = [
  {
    id: 1,
    badge: "Curated Catalog",
    icon: Sparkles,
    title: "Discover Stories That Ignite Your Imagination",
    description:
      "Explore thousands of handpicked titles across Fiction, Science, History, and more. Find your next transformative read today.",
    gradient: "from-emerald-900/90 via-teal-900/80 to-zinc-950",
    accentColor: "text-emerald-400",
  },
  {
    id: 2,
    badge: "Seamless Borrowing",
    icon: BookOpen,
    title: "Borrow With One Click, Return When You’re Done",
    description:
      "Our digital borrowing system keeps track of available copies in real time. Pick your target return date and start reading immediately.",
    gradient: "from-teal-950 via-cyan-950 to-zinc-950",
    accentColor: "text-teal-400",
  },
  {
    id: 3,
    badge: "Community Powered",
    icon: Library,
    title: "Contribute to the Library & Share Great Books",
    description:
      "Help our reading community grow. Add books from your own collection and empower readers everywhere to expand their horizons.",
    gradient: "from-zinc-900 via-emerald-950 to-zinc-950",
    accentColor: "text-emerald-300",
  },
];

export default function HomeSlider() {
  return (
    <section className="w-full relative overflow-hidden bg-zinc-950">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: "swiper-pagination-bullet-active !bg-emerald-500 !w-8 !rounded-full",
        }}
        navigation={true}
        className="w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[580px]"
      >
        {slides.map((slide) => {
          const Icon = slide.icon;
          return (
            <SwiperSlide key={slide.id}>
              <div
                className={`w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] bg-gradient-to-r ${slide.gradient} flex items-center justify-center relative px-6 sm:px-12 lg:px-20 py-16`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500 blur-3xl" />
                  <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-teal-500 blur-3xl" />
                </div>

                {/* Slide Content */}
                <div className="max-w-3xl text-center relative z-10 flex flex-col items-center">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-6">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{slide.badge}</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-tight">
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl font-normal leading-relaxed">
                    {slide.description}
                  </p>

                  {/* Call to Action Button (Goes to All Books page per PDF) */}
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <Link
                      href="/books"
                      className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold text-base transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>Browse Books</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}

