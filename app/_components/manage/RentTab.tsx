
import React from "react";
import RentTracker from "@/app/_components/manage/RentTracker";
import { Building2 } from "lucide-react";

interface Room {
    id: string;
    name: string;
    price: number;
    tenants?: any[];
    capacity: number;
}

interface Boarding {
    id: string;
    name: string;
    totalRooms?: number;
    rooms: Room[];
}

interface RentTabProps {
    boardings: Boarding[];
    selectedBoardingId: string;
    setSelectedBoardingId: (id: string) => void;
    selectedMonth: string;
    setSelectedMonth: (month: string) => void;
}

const RentTab: React.FC<RentTabProps> = ({
    boardings,
    selectedBoardingId,
    setSelectedBoardingId,
    selectedMonth,
    setSelectedMonth,
}) => {
    const selectedBoarding = boardings.find((b) => b.id === selectedBoardingId);

    return (
        <div className="space-y-6">
            {/* Boarding Selection */}
            <div className="bg-backgroundSecondary p-6 rounded-xl border border-borderPrimary shadow-sm">
                <h2 className="text-xl font-semibold text-textPrimary flex items-center gap-2 mb-4">
                    <Building2 size={24} />
                    Select Boarding for Rent Tracking
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {boardings.filter((b) => b.id && !b.id.startsWith("temp-")).length ===
                        0 ? (
                        <div className="col-span-full text-center py-8 text-textSecondary">
                            No Boardings available. Please add a boarding first in the General
                            tab.
                        </div>
                    ) : (
                        boardings
                            .filter((b) => b.id && !b.id.startsWith("temp-"))
                            .map((boarding) => (
                                <div
                                    key={boarding.id}
                                    onClick={() => setSelectedBoardingId(boarding.id)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedBoardingId === boarding.id
                                        ? "border-primary bg-primary/5"
                                        : "border-borderPrimary hover:border-primary/50"
                                        }`}
                                >
                                    <h3 className="font-semibold text-textPrimary mb-2">
                                        {boarding.name}
                                    </h3>
                                    <p className="text-sm text-textSecondary">
                                        Total Rooms: {boarding.totalRooms || boarding.rooms?.length || 0}
                                    </p>
                                </div>
                            ))
                    )}
                </div>
            </div>

            {/* Rent Tracker Content */}
            {selectedBoarding && (
                <div className="mt-8">
                    <RentTracker
                        boardings={boardings}
                        selectedBoardingId={selectedBoardingId}
                        rooms={selectedBoarding.rooms || []}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                    />
                </div>
            )}
        </div>
    );
};

export default RentTab;
