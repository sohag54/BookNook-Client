import HomeSlider from "@/components/HomeSlider";
import NewArrivals from "@/components/NewArrivals";
import HowItWorks from "@/components/HowItWorks";
import TopCategories from "@/components/TopCategories";

export default function Home() {
  return (
    <div className="w-full flex flex-col flex-1">
      {/* 1. Hero Swiper Banner */}
      <HomeSlider />

      {/* 2. Dynamic New Arrivals (Latest 6 Books) */}
      <NewArrivals />

      {/* 3. Extra Section 1: How Borrowing Works */}
      <HowItWorks />

      {/* 4. Extra Section 2: Top Categories */}
      <TopCategories />
    </div>
  );
}
