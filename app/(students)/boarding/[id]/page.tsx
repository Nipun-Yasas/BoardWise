"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Home, Info, MapPin, Users, Wallet } from "lucide-react";
import { Button } from "@/app/_components/Button";

type Room = {
    id: string;
    name: string;
    price: number;
    capacity: number;
    description: string;
    isAvailable: boolean;
    images: string[];
};

type BoardingDetails = {
    id: string;
    title: string;
    description: string;
    university: string;
    distance: number;
    address: string;
    mainImage: string;
    totalRooms: number;
    rooms: Room[];
};

export default function BoardingDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const [boarding, setBoarding] = useState<BoardingDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchDetails() {
            try {
                const res = await fetch(`/api/boardings/${id}/public`);
                if (!res.ok) {
                    throw new Error("Failed to fetch details");
                }
                const data = await res.json();
                setBoarding(data);
            } catch (err) {
                setError("Could not load boarding details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !boarding) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-red-500 font-medium">{error || "Boarding not found"}</p>
                <Link href="/student-dashboard">
                    <Button backIcon={<ArrowLeft className="w-4 h-4" />}>
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
                {/* Header / Back Button */}
                <div>
                    <Link href="/student-dashboard" className="inline-block">
                        <Button
                            className="bg-transparent hover:bg-backgroundSecondary text-textPrimary border border-borderPrimary"
                            backIcon={<ArrowLeft className="w-4 h-4" />}
                        >
                            Back
                        </Button>
                    </Link>
                </div>

                {/* Boarding Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src={boarding.mainImage}
                            alt={boarding.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-sm font-semibold text-textPrimary shadow-sm flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-primary" />
                            {boarding.university} • {boarding.distance} km
                        </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-textPrimary mb-2">
                                {boarding.title}
                            </h1>
                            {boarding.address && (
                                <p className="text-textSecondary flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> {boarding.address}
                                </p>
                            )}
                        </div>

                        <div className="bg-backgroundSecondary p-6 rounded-2xl border border-borderPrimary">
                            <h3 className="text-lg font-semibold text-textPrimary mb-3 flex items-center gap-2">
                                <Info className="w-5 h-5 text-primary" />
                                About this place
                            </h3>
                            <p className="text-textSecondary leading-relaxed">
                                {boarding.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Rooms Section */}
                <div>
                    <h2 className="text-2xl font-bold text-textPrimary mb-6 flex items-center gap-2">
                        <Home className="w-6 h-6" />
                        Available Rooms
                    </h2>

                    {boarding.rooms.length === 0 ? (
                        <div className="text-center py-10 bg-backgroundSecondary rounded-2xl border border-dashed border-borderPrimary">
                            <p className="text-textSecondary">No rooms listed yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {boarding.rooms.map((room) => (
                                <div
                                    key={room.id}
                                    className="bg-backgroundSecondary rounded-2xl overflow-hidden border border-borderPrimary shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                                >
                                    <div className="h-48 w-full bg-gray-200 relative">
                                        {room.images && room.images.length > 0 ? (
                                            <img
                                                src={room.images[0]}
                                                alt={room.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-textSecondary bg-gray-100">
                                                No Image
                                            </div>
                                        )}
                                        {!room.isAvailable && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="text-white font-bold px-3 py-1 border border-white rounded-full">Booked</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow gap-4">
                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-xl font-bold text-textPrimary">{room.name}</h3>
                                                <div className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                                    <Check className="w-3 h-3" />
                                                    Available
                                                </div>
                                            </div>
                                            <p className="text-textSecondary text-sm line-clamp-2">{room.description}</p>
                                        </div>

                                        <div className="mt-auto space-y-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-1.5 text-textSecondary">
                                                    <Users className="w-4 h-4" />
                                                    <span>{room.capacity} Person(s)</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 font-bold text-primary text-base">
                                                    <Wallet className="w-4 h-4" />
                                                    LKR {room.price.toLocaleString()}
                                                </div>
                                            </div>

                                            <Button className="w-full justify-center" disabled={!room.isAvailable}>
                                                {room.isAvailable ? "Request to Book" : "Currently Unavailable"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
