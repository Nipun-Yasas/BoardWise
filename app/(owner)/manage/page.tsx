"use client";

import React, { useState } from "react";
import { Home, Box, CreditCard } from "lucide-react";
import GeneralInfoTab from "@/app/_components/manage/GeneralInfoTab";
import RoomsTab from "@/app/_components/manage/RoomsTab";
import BillingTab from "@/app/_components/manage/BillingTab";

interface Room {
  id: string;
  name: string;
  capacity: number;
  price: number;
  description: string;
  images: string[];
}

interface BillType {
  id: string;
  name: string;
}

interface MonthlyBill {
  month: string;
  bills: Record<string, number>;
  dueDate: string;
}

export default function Manage() {
  const [activeTab, setActiveTab] = useState<"general" | "rooms" | "billing">(
    "general"
  );

  const [generalInfo, setGeneralInfo] = useState({
    name: "My Awesome Boarding",
    description: "A comfortable place for students.",
    mainImage: null as string | null,
  });

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      name: "Room 101",
      capacity: 2,
      price: 15000,
      description: "Shared room with balcony",
      images: [],
    },
  ]);

  const totalCapacity = rooms.reduce(
    (sum, room) => sum + (room.capacity || 0),
    0
  );
  const [billTypes, setBillTypes] = useState<BillType[]>([
    { id: "1", name: "Electricity" },
    { id: "2", name: "Water" },
  ]);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [monthlyBills, setMonthlyBills] = useState<Record<string, MonthlyBill>>(
    {}
  );

  const handleGeneralChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setGeneralInfo((prev) => ({ ...prev, [name]: value }));
  };

  const addRoom = () => {
    const newRoom: Room = {
      id: Date.now().toString(),
      name: "",
      capacity: 1,
      price: 0,
      description: "",
      images: [],
    };
    setRooms([...rooms, newRoom]);
  };

  const updateRoom = (id: string, field: keyof Room, value: any) => {
    setRooms(
      rooms.map((room) => (room.id === id ? { ...room, [field]: value } : room))
    );
  };

  const removeRoom = (id: string) => {
    setRooms(rooms.filter((room) => room.id !== id));
  };

  const addRoomImage = (roomId: string) => {
    const mockImage = `https://picsum.photos/seed/${Date.now()}/200/200`;
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      updateRoom(roomId, "images", [...room.images, mockImage]);
    }
  };

  const removeRoomImage = (roomId: string, imageIndex: number) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      const newImages = [...room.images];
      newImages.splice(imageIndex, 1);
      updateRoom(roomId, "images", newImages);
    }
  };

  const addBillType = (name: string) => {
    if (!name) return;
    setBillTypes([...billTypes, { id: Date.now().toString(), name }]);
  };

  const removeBillType = (id: string) => {
    setBillTypes(billTypes.filter((type) => type.id !== id));
  };

  const handleBillAmountChange = (billTypeId: string, amount: number) => {
    setMonthlyBills((prev) => {
      const currentMonthData = prev[selectedMonth] || {
        month: selectedMonth,
        bills: {},
        dueDate: "",
      };
      return {
        ...prev,
        [selectedMonth]: {
          ...currentMonthData,
          bills: {
            ...currentMonthData.bills,
            [billTypeId]: amount,
          },
        },
      };
    });
  };

  const handleDueDateChange = (date: string) => {
    setMonthlyBills((prev) => {
      const currentMonthData = prev[selectedMonth] || {
        month: selectedMonth,
        bills: {},
        dueDate: "",
      };
      return {
        ...prev,
        [selectedMonth]: {
          ...currentMonthData,
          dueDate: date,
        },
      };
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <GeneralInfoTab
            generalInfo={generalInfo}
            setGeneralInfo={setGeneralInfo}
            handleGeneralChange={handleGeneralChange}
            totalCapacity={totalCapacity}
          />
        );
      case "rooms":
        return (
          <RoomsTab
            rooms={rooms}
            addRoom={addRoom}
            updateRoom={updateRoom}
            removeRoom={removeRoom}
            addRoomImage={addRoomImage}
            removeRoomImage={removeRoomImage}
          />
        );
      case "billing":
        return (
          <BillingTab
            billTypes={billTypes}
            addBillType={addBillType}
            removeBillType={removeBillType}
            monthlyBills={monthlyBills}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            handleBillAmountChange={handleBillAmountChange}
            handleDueDateChange={handleDueDateChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary tracking-tight">
            Manage Boarding
          </h1>
          <p className="text-textSecondary mt-2">
            Update your boarding details, manage rooms, and configure billing.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-borderPrimary">
          {[
            { id: "general", label: "General Info", icon: <Home size={18} /> },
            { id: "rooms", label: "Rooms", icon: <Box size={18} /> },
            { id: "billing", label: "Billing", icon: <CreditCard size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-backgroundSecondary text-primary"
                  : "text-textSecondary hover:text-textPrimary hover:bg-backgroundSecondary/50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[500px]">{renderTabContent()}</div>
      </div>
    </div>
  );
}
