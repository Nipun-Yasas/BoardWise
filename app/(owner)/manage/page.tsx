"use client";

import BillingTab from "@/app/_components/manage/BillingTab";
import GeneralInfoTab from "@/app/_components/manage/GeneralInfoTab";
import RoomsTab from "@/app/_components/manage/RoomsTab";
import axiosInstance, { API_PATHS } from "@/lib/axios";
import { Box, CreditCard, Home } from "lucide-react";
import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";

// Fetcher for SWR
const fetcher = (url: string) => axiosInstance.get(url).then((res) => res.data);

interface BillType {
  id: string;
  name: string;
}

interface Room {
  id: string;
  boardingId: string;
  name: string;
  capacity: number;
  price: number;
  description: string;
  images: string[];
  billTypes: BillType[];
  isAvailable: boolean;
  tenants?: any[];
  gender: "Male" | "Female";
}

interface Boarding {
  id: string;
  name: string;
  description: string;
  mainImage: string | null;
  totalRooms?: number;
  nearestUniversity?: string;
  distanceFromUniversity?: number;
  distanceUnit?: "km" | "m";
  rooms: Room[];
  isAvailable?: boolean;
}

interface RoomBill {
  roomId: string;
  month: string;
  bills: Record<string, number>;
  dueDate: string;
}

export default function Manage() {
  const idCounterRef = React.useRef(1);
  const getNextId = () => String(idCounterRef.current++);

  const [activeTab, setActiveTab] = useState<"general" | "rooms" | "billing">(
    "general",
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingRoomId, setSavingRoomId] = useState<string | null>(null);

  const [boardings, setBoardings] = useState<Boarding[]>([]);
  const [selectedBoardingId, setSelectedBoardingId] = useState<string>("");
  const selectedBoarding = boardings.find((b) => b.id === selectedBoardingId);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [roomBills, setRoomBills] = useState<RoomBill[]>([]);

  const totalCapacity =
    selectedBoarding?.rooms?.reduce(
      (sum, room) => sum + (room.capacity || 0),
      0,
    ) || 0;

  // SWR for Boardings
  const { data: fetchedBoardings, error: boardingsError, isLoading: boardingsLoading, mutate: mutateBoardings } = useSWR(
    API_PATHS.BOARDING.GET_ALL,
    fetcher,
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        // Sync to local state only if not already editing?
        // For simplicity in this refactor, we sync when data arrives, assuming mainly on mount or explicit mutation.
        if (data && data.length > 0) {
          const boardingsWithBillTypes = data.map(
            (boarding: Boarding) => ({
              ...boarding,
              rooms: boarding.rooms.map((room: Room) => ({
                ...room,
                billTypes: room.billTypes || [],
              })),
            }),
          );
          setBoardings(boardingsWithBillTypes);
          if (!selectedBoardingId) {
            setSelectedBoardingId(boardingsWithBillTypes[0].id);
          }
        } else if (data && data.length === 0) {
          setBoardings([]);
          setSelectedBoardingId("");
        }
        setLoading(false);
      },
      onError: (err) => {
        console.error("Error fetching boardings:", err);
        toast.error("Failed to load boardings");
        setLoading(false);
      }
    }
  );


  // SWR for Monthly Bills
  const billsKey = (selectedBoardingId && !selectedBoardingId.startsWith("temp-"))
    ? API_PATHS.MONTHLY_BILL.GET_ALL(selectedBoardingId, selectedMonth)
    : null;

  const { data: fetchedBills, mutate: mutateBills } = useSWR(
    billsKey,
    fetcher,
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        setRoomBills(data);
      },
      onError: (err) => {
        console.error("Error fetching monthly bills:", err);
        // Don't show error toast for empty results (404)
        if (err.response?.status !== 404) {
          console.log("No bills found for this month");
        }
      }
    }
  );

  // Initial loading state handled by SWR onSuccess/onError or effect
  // But we also have local loading state for UI.
  // We can sync them or just rely on SWR's isLoading for initial load.
  // Currently `loading` state is used for the spinner.
  useEffect(() => {
    if (boardingsLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [boardingsLoading]);

  // We don't need the manual fetch functions anymore, but 'fetchBoardings' passed to child components as 'refreshData' might be needed.
  // We can define a wrapper around mutate.
  const refreshBoardings = () => mutateBoardings();
  const refreshBills = () => mutateBills();

  // Add new boarding (creates temporary local boarding)
  const addBoarding = () => {
    const tempId = `temp-${getNextId()}`;
    const newBoarding: Boarding = {
      id: tempId,
      name: "",
      description: "",
      mainImage: null,
      totalRooms: 0,
      nearestUniversity: "",
      distanceFromUniversity: 0,
      rooms: [],
    };
    setBoardings([...boardings, newBoarding]);
    setSelectedBoardingId(tempId);
  };
  // Save boarding details
  const saveBoardingDetails = async () => {
    if (!selectedBoarding) return;

    // Validate required fields
    if (!selectedBoarding.name.trim()) {
      toast.error("Boarding name is required");
      return;
    }

    try {
      setSaving(true);
      const isNewBoarding = selectedBoarding.id?.startsWith("temp-");

      if (isNewBoarding) {
        // Create new boarding
        const response = await axiosInstance.post(API_PATHS.BOARDING.CREATE, {
          name: selectedBoarding.name,
          description: selectedBoarding.description,
          mainImage: selectedBoarding.mainImage,
          totalRooms: selectedBoarding.totalRooms || 0,
          nearestUniversity: selectedBoarding.nearestUniversity || "",
          distanceFromUniversity: selectedBoarding.distanceFromUniversity || 0,
          distanceUnit: selectedBoarding.distanceUnit || "km",
        });

        // Extract boarding from nested response
        const createdBoarding = response.data.boarding || response.data;

        // Ensure the created boarding has a rooms array
        if (!createdBoarding.rooms) {
          createdBoarding.rooms = [];
        }

        // Replace temporary boarding with the real one from the server
        const updatedBoardings = boardings.map((b) =>
          b.id === selectedBoarding.id ? createdBoarding : b,
        );

        setBoardings(updatedBoardings);
        setSelectedBoardingId(createdBoarding.id);
        toast.success("Saved successfully");
      } else {
        // Update existing boarding
        await axiosInstance.put(
          API_PATHS.BOARDING.UPDATE(selectedBoarding.id),
          {
            name: selectedBoarding.name,
            description: selectedBoarding.description,
            mainImage: selectedBoarding.mainImage,
            totalRooms: selectedBoarding.totalRooms || 0,
            nearestUniversity: selectedBoarding.nearestUniversity || "",
            distanceFromUniversity: selectedBoarding.distanceFromUniversity || 0,
            distanceUnit: selectedBoarding.distanceUnit || "km",
          },
        );

        // Update the boarding in the local state
        setBoardings(
          boardings.map((b) =>
            b.id === selectedBoarding.id
              ? {
                ...b,
                name: selectedBoarding.name,
                description: selectedBoarding.description,
                mainImage: selectedBoarding.mainImage,
                totalRooms: selectedBoarding.totalRooms,
                nearestUniversity: selectedBoarding.nearestUniversity,
                distanceFromUniversity: selectedBoarding.distanceFromUniversity,
                distanceUnit: selectedBoarding.distanceUnit,
              }
              : b,
          ),
        );
        toast.success("Saved successfully");
      }
    } catch (error: any) {
      console.error("Error saving boarding:", error);
      toast.error(
        selectedBoarding.id?.startsWith("temp-")
          ? "Failed to create boarding"
          : "Failed to save boarding details",
      );
    } finally {
      setSaving(false);
    }
  };

  // Update boarding general info (local state)
  const updateBoardingInfo = async (field: keyof Boarding, value: any) => {
    // Update local state first
    setBoardings(
      boardings.map((b) =>
        b.id === selectedBoardingId ? { ...b, [field]: value } : b,
      ),
    );

    // Auto-save mainImage deletion for existing boardings
    if (
      field === "mainImage" &&
      value === null &&
      selectedBoardingId &&
      !selectedBoardingId.startsWith("temp-")
    ) {
      try {
        const currentBoarding = boardings.find(
          (b) => b.id === selectedBoardingId,
        );
        if (currentBoarding) {
          await axiosInstance.put(
            API_PATHS.BOARDING.UPDATE(selectedBoardingId),
            {
              name: currentBoarding.name,
              description: currentBoarding.description,
              mainImage: null,
              totalRooms: currentBoarding.totalRooms || 0,
              nearestUniversity: currentBoarding.nearestUniversity || "",
              distanceFromUniversity: currentBoarding.distanceFromUniversity || 0,
            },
          );
          toast.success("Image removed successfully!");
        }
      } catch (error: any) {
        console.error("Error removing image:", error);
        toast.error("Failed to remove image");
        // Revert the change on error
        const currentBoarding = boardings.find(
          (b) => b.id === selectedBoardingId,
        );
        if (currentBoarding) {
          setBoardings(
            boardings.map((b) =>
              b.id === selectedBoardingId
                ? { ...b, mainImage: currentBoarding.mainImage }
                : b,
            ),
          );
        }
      }
    }
  };
  const handleGeneralChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any,
  ) => {
    const { name, value } = e.target;
    // Convert totalRooms and distanceFromUniversity to number
    if (name === "totalRooms" || name === "distanceFromUniversity") {
      updateBoardingInfo(name as keyof Boarding, parseInt(value) || 0);
    } else {
      updateBoardingInfo(name as keyof Boarding, value);
    }
  };

  // Room management
  const addRoom = () => {
    if (!selectedBoarding) return;
    const newRoom: Room = {
      id: `temp-${getNextId()}`,
      boardingId: selectedBoardingId,
      name: "",
      capacity: 1,
      price: 0,
      description: "",
      images: [],
      billTypes: [
        { id: `temp-${getNextId()}`, name: "Electricity" },
        { id: `temp-${getNextId()}`, name: "Water" },
      ],
      isAvailable: true,
      gender: "Male",
    };
    updateBoardingInfo("rooms", [...selectedBoarding.rooms, newRoom]);
  };

  const updateRoom = (roomId: string, field: keyof Room, value: any) => {
    if (!selectedBoarding) return;
    const updatedRooms = selectedBoarding.rooms.map((room) =>
      room.id === roomId ? { ...room, [field]: value } : room,
    );
    updateBoardingInfo("rooms", updatedRooms);
  };

  const toggleRoomAvailability = async (roomId: string, currentStatus: boolean) => {
    if (!selectedBoarding) return;

    // Optimistic update
    const newStatus = !currentStatus;
    updateRoom(roomId, "isAvailable", newStatus);

    // If it's a temp room, we are done (local state only)
    if (roomId.startsWith("temp-")) return;

    try {
      // Helper to check if ID is a valid MongoDB ObjectId
      const isValidMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);

      if (isValidMongoId(roomId)) {
        await axiosInstance.patch(API_PATHS.ROOM.UPDATE(roomId), {
          isAvailable: newStatus,
        });
        toast.success(`Room marked as ${newStatus ? "available" : "unavailable"}`);
        // Refresh boardings to ensure parent boarding availability is synced
        refreshBoardings();
      }
    } catch (error: any) {
      console.error("Error toggling room availability:", error);
      toast.error("Failed to update status");
      // Revert on error
      updateRoom(roomId, "isAvailable", currentStatus);
    }
  };

  const removeRoom = async (roomId: string) => {
    if (!selectedBoarding) return;

    // Helper to check if ID is a valid MongoDB ObjectId
    const isValidMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);

    try {
      // If it's a real room from the database, delete it
      if (!roomId.startsWith("temp-") && isValidMongoId(roomId)) {
        await axiosInstance.delete(API_PATHS.ROOM.DELETE(roomId));
        toast.success("Room deleted successfully!");
      }

      // Update local state
      updateBoardingInfo(
        "rooms",
        selectedBoarding.rooms.filter((r) => r.id !== roomId),
      );
      setRoomBills(roomBills.filter((bill) => bill.roomId !== roomId));

      // Refresh boardings if it was a database room
      if (!roomId.startsWith("temp-") && isValidMongoId(roomId)) {
        await refreshBoardings();
      }
    } catch (error: any) {
      console.error("Error deleting room:", error);
      toast.error(error.response?.data?.error || "Failed to delete room");
    }
  };

  const saveRooms = async () => {
    if (!selectedBoarding) {
      toast.error("Please select a boarding first");
      return;
    }

    try {
      setSaving(true);

      // Helper to check if ID is a valid MongoDB ObjectId (24 char hex string)
      const isValidMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);

      // Separate new rooms from existing rooms
      const newRooms = selectedBoarding.rooms.filter(
        (room) => room.id.startsWith("temp-") || !isValidMongoId(room.id),
      );
      const existingRooms = selectedBoarding.rooms.filter(
        (room) => !room.id.startsWith("temp-") && isValidMongoId(room.id),
      );

      if (newRooms.length === 0 && existingRooms.length === 0) {
        toast.error("No rooms to save");
        return;
      }

      // Create new rooms
      for (const room of newRooms) {
        await axiosInstance.post(API_PATHS.ROOM.CREATE, {
          boardingId: selectedBoarding.id,
          name: room.name,
          capacity: room.capacity,
          price: room.price,
          description: room.description,
          images: room.images,
        });
      }

      // Update existing rooms
      if (existingRooms.length > 0) {
        await axiosInstance.put(API_PATHS.ROOM.UPDATE_BULK, {
          rooms: existingRooms,
        });
      }

      toast.success("Rooms saved successfully!");
      // Refresh boardings to get updated room data
      await refreshBoardings();
    } catch (error: any) {
      console.error("Error saving rooms:", error);
      toast.error(error.response?.data?.error || "Failed to save rooms");
    } finally {
      setSaving(false);
    }
  };

  const addRoomImage = (roomId: string, file: File) => {
    if (!selectedBoarding) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const room = selectedBoarding.rooms.find((r) => r.id === roomId);
      if (room) {
        updateRoom(roomId, "images", [...room.images, base64String]);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeRoomImage = async (roomId: string, imageIndex: number) => {
    if (!selectedBoarding) return;

    // Helper to check if ID is a valid MongoDB ObjectId
    const isValidMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);

    const room = selectedBoarding.rooms.find((r) => r.id === roomId);
    if (room) {
      const newImages = [...room.images];
      newImages.splice(imageIndex, 1);
      updateRoom(roomId, "images", newImages);

      // Auto-save if it's an existing room in the database
      if (!roomId.startsWith("temp-") && isValidMongoId(roomId)) {
        try {
          await axiosInstance.patch(API_PATHS.ROOM.UPDATE(roomId), {
            images: newImages,
          });
          toast.success("Image removed successfully!");
        } catch (error: any) {
          console.error("Error removing image:", error);
          toast.error("Failed to remove image");
          // Revert the change on error
          updateRoom(roomId, "images", room.images);
        }
      }
    }
  };

  const addRoomBillType = async (roomId: string, name: string) => {
    if (!name || !selectedBoarding) return;

    // Helper to check if ID is a valid MongoDB ObjectId
    const isValidMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);

    const room = selectedBoarding.rooms.find((r) => r.id === roomId);
    if (room) {
      // For existing rooms, save to database
      if (!roomId.startsWith("temp-") && isValidMongoId(roomId)) {
        try {
          const response = await axiosInstance.post(
            API_PATHS.BILL_TYPE.CREATE,
            {
              roomId,
              name,
            },
          );

          const newBillType: BillType = {
            id: response.data.billType.id,
            name: response.data.billType.name,
          };

          updateRoom(roomId, "billTypes", [...room.billTypes, newBillType]);
          toast.success("Bill type added successfully!");
        } catch (error: any) {
          console.error("Error adding bill type:", error);
          toast.error("Failed to add bill type");
        }
      } else {
        // For temp rooms, just update local state
        const newBillType: BillType = {
          id: `temp-${getNextId()}`,
          name,
        };
        updateRoom(roomId, "billTypes", [...room.billTypes, newBillType]);
      }
    }
  };

  const removeRoomBillType = async (roomId: string, billTypeId: string) => {
    if (!selectedBoarding) return;

    // Helper to check if ID is a valid MongoDB ObjectId
    const isValidMongoId = (id: string) => /^[a-f\d]{24}$/i.test(id);

    const room = selectedBoarding.rooms.find((r) => r.id === roomId);
    if (room) {
      // For existing bill types, delete from database
      if (!billTypeId.startsWith("temp-") && isValidMongoId(billTypeId)) {
        try {
          await axiosInstance.delete(API_PATHS.BILL_TYPE.DELETE(billTypeId));
          toast.success("Bill type removed successfully!");
        } catch (error: any) {
          console.error("Error removing bill type:", error);
          toast.error("Failed to remove bill type");
          return;
        }
      }

      updateRoom(
        roomId,
        "billTypes",
        room.billTypes.filter((type) => type.id !== billTypeId),
      );

      setRoomBills((prev) =>
        prev.map((bill) => {
          if (bill.roomId === roomId) {
            const updatedBills = { ...bill.bills };
            delete updatedBills[billTypeId];
            return { ...bill, bills: updatedBills };
          }
          return bill;
        }),
      );
    }
  };

  const handleRoomBillAmountChange = (
    roomId: string,
    billTypeId: string,
    amount: number,
  ) => {
    setRoomBills((prev) => {
      const existingBillIndex = prev.findIndex(
        (bill) => bill.roomId === roomId && bill.month === selectedMonth,
      );

      if (existingBillIndex >= 0) {
        const updated = [...prev];
        updated[existingBillIndex] = {
          ...updated[existingBillIndex],
          bills: {
            ...updated[existingBillIndex].bills,
            [billTypeId]: amount,
          },
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            roomId,
            month: selectedMonth,
            bills: { [billTypeId]: amount },
            dueDate: "",
          },
        ];
      }
    });
  };

  const handleRoomDueDateChange = (roomId: string, date: string) => {
    setRoomBills((prev) => {
      const existingBillIndex = prev.findIndex(
        (bill) => bill.roomId === roomId && bill.month === selectedMonth,
      );

      if (existingBillIndex >= 0) {
        const updated = [...prev];
        updated[existingBillIndex] = {
          ...updated[existingBillIndex],
          dueDate: date,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            roomId,
            month: selectedMonth,
            bills: {},
            dueDate: date,
          },
        ];
      }
    });
  };

  const saveMonthlyBills = async (roomId?: string) => {
    if (!selectedBoarding) {
      toast.error("Please select a boarding first");
      return;
    }

    try {
      if (roomId) {
        setSavingRoomId(roomId);
      } else {
        setSaving(true);
      }

      // Filter bills for specific room if roomId provided, otherwise all rooms
      let billsToSave = roomBills.filter(
        (bill) => bill.month === selectedMonth && bill.dueDate,
      );

      if (roomId) {
        billsToSave = billsToSave.filter((bill) => bill.roomId === roomId);
      }

      if (billsToSave.length === 0) {
        toast.error("Please set due dates for the bills");
        return;
      }

      const response = await axiosInstance.post(API_PATHS.MONTHLY_BILL.SAVE, {
        bills: billsToSave,
      });

      if (response.data.success) {
        const roomName = roomId
          ? selectedBoarding.rooms.find((r) => r.id === roomId)?.name || "room"
          : "all rooms";
        toast.success(`Bills saved for ${roomName}!`);
        // Refresh monthly bills after saving
        await refreshBills();
      }
    } catch (error: any) {
      console.error("Error saving monthly bills:", error);
      toast.error(error.response?.data?.error || "Failed to save bills");
    } finally {
      setSaving(false);
      setSavingRoomId(null);
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "general":
        return (
          <GeneralInfoTab
            boardings={boardings}
            selectedBoardingId={selectedBoardingId}
            setSelectedBoardingId={setSelectedBoardingId}
            selectedBoarding={selectedBoarding || null}
            updateBoardingInfo={updateBoardingInfo}
            handleGeneralChange={handleGeneralChange}
            totalCapacity={totalCapacity}
            addBoarding={addBoarding}
            saveBoardingDetails={saveBoardingDetails}
            saving={saving}
          />
        );
      case "rooms":
        return (
          <RoomsTab
            boardings={boardings}
            selectedBoardingId={selectedBoardingId}
            setSelectedBoardingId={setSelectedBoardingId}
            rooms={selectedBoarding?.rooms || []}
            addRoom={addRoom}
            updateRoom={updateRoom}
            removeRoom={removeRoom}
            saveRooms={saveRooms}
            saving={saving}
            addRoomImage={addRoomImage}
            removeRoomImage={removeRoomImage}
            refreshData={refreshBoardings}
            toggleRoomAvailability={toggleRoomAvailability}
          />
        );
      case "billing":
        return (
          <BillingTab
            boardings={boardings}
            selectedBoardingId={selectedBoardingId}
            setSelectedBoardingId={setSelectedBoardingId}
            rooms={selectedBoarding?.rooms || []}
            addRoomBillType={addRoomBillType}
            removeRoomBillType={removeRoomBillType}
            roomBills={roomBills}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            handleRoomBillAmountChange={handleRoomBillAmountChange}
            handleRoomDueDateChange={handleRoomDueDateChange}
            saveMonthlyBills={saveMonthlyBills}
            savingRoomId={savingRoomId}
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
            Manage Boardings
          </h1>
          <p className="text-textSecondary mt-2">
            Update your boarding details, manage rooms, and configure billing.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-borderPrimary">
          {[
            { id: "general", label: "General Info", icon: <Home size={18} /> },
            { id: "rooms", label: "Rooms", icon: <Box size={18} /> },
            { id: "billing", label: "Billing", icon: <CreditCard size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                ? "bg-backgroundSecondary text-primary"
                : "text-textSecondary hover:text-textPrimary hover:bg-backgroundSecondary/50"
                }`}
              suppressHydrationWarning
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