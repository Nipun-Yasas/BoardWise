"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import useSWR from "swr";
import BoardingCard, { Boarding } from "@/app/_components/dashboard/BoardingCard";
import BoardingFilters from "@/app/_components/dashboard/BoardingFilters";
import { Button } from "@/app/_components/Button";
import axiosInstance, { API_PATHS } from "@/lib/axios";
import { Home, Search, Sparkles } from "lucide-react";
import SmartRecommendation from "@/app/_components/student/SmartRecommendation";



// Mock User Status
const USER_HAS_BOARDING = true; // Toggle this to test

const PRESET_UNIVERSITIES = [
  "University of Moratuwa",
  "University of Ruhuna",
  "University of Peradeniya",
  "NSBM",
  "SLIIT",
];

// fetcher for SWR
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

export default function StudentDashboard() {
  const { data: boardings = [], error, isLoading } = useSWR<Boarding[]>(
    API_PATHS.DASHBOARD.STUDENT,
    fetcher
  );

  const [showSmartRecommendation, setShowSmartRecommendation] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    university: "",
    maxDistance: 0,
    maxRental: 0,
    persons: "",
  });

  // Removed manual useEffect fetching

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const universities = useMemo(() => {
    const unis = new Set([
      ...PRESET_UNIVERSITIES,
      ...boardings.map((b) => b.university).filter(Boolean),
    ]);
    return Array.from(unis).sort();
  }, [boardings]);

  const filteredBoardings = useMemo(() => {
    return boardings.filter((boarding) => {
      const matchesSearch =
        boarding.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        boarding.university
          .toLowerCase()
          .includes(filters.search.toLowerCase());
      const matchesUniversity = filters.university
        ? boarding.university === filters.university
        : true;
      const matchesPersons = filters.persons
        ? filters.persons === "4+"
          ? boarding.persons >= 4
          : boarding.persons === Number(filters.persons)
        : true;
      const matchesRental =
        filters.maxRental > 0 ? boarding.rental <= filters.maxRental : true;

      return (
        matchesSearch && matchesUniversity && matchesPersons && matchesRental
      );
    });
  }, [filters, boardings]);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary">
            Find Your Place
          </h1>
          <p className="text-textSecondary font-light mt-1">
            Discover comfort and convenience near your university
          </p>
        </div>

        {/* AI Smart Recommendation Button */}
        <button
          onClick={() => setShowSmartRecommendation(true)}
          className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
          <span>AI Finder</span>
          <div className="absolute -top-1 -right-1 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full animate-bounce">
            NEW
          </div>
        </button>
      </div>

      {/* User Boarding Status Banner */}
      {USER_HAS_BOARDING && (
        <div className="bg-backgroundSecondary border border-borderPrimary rounded-2xl p-6 mb-10 shadow-lg text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transform transition hover:scale-[1.01] duration-300">
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 bg-input rounded-full backdrop-blur-sm">
              <Home className="w-8 h-8 text-textPrimary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-textPrimary">
                You have an active boarding!
              </h2>
              <p className="text-textSecondary">
                Manage your stay, payments, and more.
              </p>
            </div>
          </div>

          <Link href="/boarding">
            <Button
              className="border-none"
              backIcon={<Home className="w-4 h-4" />}
            >
              Go to My Boarding
            </Button>
          </Link>
        </div>
      )}

      {/* Filters */}
      <BoardingFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        universities={universities}
      />

      {/* Results Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredBoardings.length > 0 ? (
        <BoardingCard boardings={filteredBoardings} />
      ) : (
        <div className="text-center py-20">
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-textPrimary" />
          </div>
          <h3 className="text-xl font-medium text-textPrimary">
            No boardings found
          </h3>
          <p className="text-textSecondary mt-2">
            Try adjusting your filters to find what you&apos;re looking for.
          </p>
        </div>
      )}
      
      {/* Smart Recommendation Modal */}
      {showSmartRecommendation && (
        <SmartRecommendation
          onClose={() => setShowSmartRecommendation(false)}
        />
      )}
    </div>
  );
}
