"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, Wallet } from "lucide-react";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: Boarding;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-3xl relative overflow-hidden w-full transition-all duration-300 ease-out bg-backgroundSecondary border-none hover:shadow-lg",
        hovered !== null &&
          hovered !== index &&
          "blur-[1px] scale-[0.98] opacity-80"
      )}
    >
      <Link href={`/boarding/${card.id}`} className="block h-full w-full">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={card.imageUrl}
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {card.distance} km
          </div>
        </div>

        <div className="p-4 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-textPrimary line-clamp-1">
                {card.title}
              </h3>
              <p className="text-sm text-textSecondary">{card.university}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 pt-3 border-t border-borderPrimary">
            <div className="flex items-center gap-1.5 text-green-500 font-medium">
              <Wallet className="w-4 h-4" />
              <span>LKR {card.rental.toLocaleString()}</span>
              <span className="text-xs text-textPrimary font-normal">/mo</span>
            </div>
            <div className="flex items-center gap-1.5 text-textSecondary text-sm">
              <Users className="w-4 h-4" />
              <span>{card.persons}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
);

Card.displayName = "Card";

export type Boarding = {
  id: string;
  title: string;
  university: string;
  distance: number;
  rental: number;
  persons: number;
  imageUrl: string;
};

export default function BoardingCard({ boardings }: { boardings: Boarding[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      <AnimatePresence mode="popLayout">
        {boardings.map((boarding, index) => (
          <Card
            key={boarding.id}
            card={boarding}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
