"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import BoardingCard from "@/app/_components/dashboard/BoardingCard";
import BoardingFilters from "@/app/_components/dashboard/BoardingFilters";
import { Button } from "@/app/_components/Button";
import { Home, Search } from "lucide-react";

// Dummy Data
const DUMMY_BOARDINGS = [
  {
    id: "1",
    title: "Sunny Side Boarding",
    university: "UOM",
    distance: 1.2,
    rental: 15000,
    persons: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    title: "Green View Annex",
    university: "UOC",
    distance: 3.5,
    rental: 12000,
    persons: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    title: "City Center Hub",
    university: "USJ",
    distance: 5.0,
    rental: 18000,
    persons: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    title: "Lake Breeze Rooms",
    university: "Kelaniya",
    distance: 0.8,
    rental: 10000,
    persons: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1512918760532-3edbed13588e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "5",
    title: "Modern Student Living",
    university: "SLIIT",
    distance: 2.0,
    rental: 22000,
    persons: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "6",
    title: "Cozy Corner",
    university: "UOM",
    distance: 1.5,
    rental: 14000,
    persons: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1596276122653-65ddf3c5e2d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

// Mock User Status
const USER_HAS_BOARDING = true; // Toggle this to test

export default function StudentDashboard() {
  const [filters, setFilters] = useState({
    search: "",
    university: "",
    maxDistance: 0,
    maxRental: 0,
    persons: "",
  });

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredBoardings = useMemo(() => {
    return DUMMY_BOARDINGS.filter((boarding) => {
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

      // Since distance isn't a direct filter in UI yet but good to have logic ready
      // const matchesDistance = filters.maxDistance > 0 ? boarding.distance <= filters.maxDistance : true;

      return (
        matchesSearch && matchesUniversity && matchesPersons && matchesRental
      );
    });
  }, [filters]);

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
      <BoardingFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Results Grid */}
      {filteredBoardings.length > 0 ? (
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
