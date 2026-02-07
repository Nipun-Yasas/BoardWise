"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import BoardingCard, { Boarding } from "@/app/_components/dashboard/BoardingCard";
import BoardingFilters from "@/app/_components/dashboard/BoardingFilters";
import { Button } from "@/app/_components/Button";
import { Home, Search } from "lucide-react";



// Mock User Status
const USER_HAS_BOARDING = true; // Toggle this to test

const PRESET_UNIVERSITIES = [
  "University of Moratuwa",
  "University of Ruhuna",
  "University of Peradeniya",
  "NSBM",
  "SLIIT",
];

export default function StudentDashboard() {
  const [boardings, setBoardings] = useState<Boarding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    university: "",
    maxDistance: 0,
    maxRental: 0,
    persons: "",
  });

  useEffect(() => {
    async function fetchBoardings() {
      try {
        const res = await fetch("/api/boardings/public");
        if (res.ok) {
          const data = await res.json();
          setBoardings(data);
        }
      } catch (error) {
        console.error("Failed to fetch boardings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBoardings();
  }, []);

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
    </div>
  );
}
