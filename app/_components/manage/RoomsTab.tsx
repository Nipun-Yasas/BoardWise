import { Button } from "@/app/_components/Button";
import Input from "@/app/_components/inputs/Input";
import { Building2, Plus, Save, Trash2, UserPlus, X } from "lucide-react";
import React, { useState } from "react";

interface Tenant {
  _id: string;
  name: string;
  email: string;
  mobile_number: string;
}

interface Room {
  id: string;
  boardingId: string;
  name: string;
  capacity: number;
  price: number;
  description: string;
  images: string[];
  isAvailable: boolean;
}

interface Boarding {
  id: string;
  name: string;
  totalRooms?: number;
}

interface RoomsTabProps {
  boardings: Boarding[];
  selectedBoardingId: string;
  setSelectedBoardingId: (id: string) => void;
  rooms: Room[];
  addRoom: () => void;
  updateRoom: (id: string, field: keyof Room, value: any) => void;
  removeRoom: (id: string) => void;
  saveRooms: () => void;
  saving: boolean;
  addRoomImage: (roomId: string, file: File) => void;
  removeRoomImage: (roomId: string, imageIndex: number) => void;
  refreshData?: () => void; // Callback to refresh data after tenant updates
}

const RoomsTab: React.FC<RoomsTabProps> = ({
  boardings,
  selectedBoardingId,
  setSelectedBoardingId,
  rooms,
  addRoom,
  updateRoom,
  removeRoom,
  saveRooms,
  saving,
  addRoomImage,
  removeRoomImage,
  refreshData,
}) => {
  const selectedBoarding = boardings.find((b) => b.id === selectedBoardingId);
  const selectedBoardingRooms = rooms.filter(
    (r) => r.boardingId === selectedBoardingId,
  );

  const [newTenantEmails, setNewTenantEmails] = useState<Record<string, string>>(
    {}
  );
  const [addingTenantMap, setAddingTenantMap] = useState<Record<string, boolean>>(
    {}
  );

  const handleAddTenant = async (roomId: string) => {
    const email = newTenantEmails[roomId];
    if (!email) return;

    setAddingTenantMap((prev) => ({ ...prev, [roomId]: true }));

    try {
      const res = await fetch(`/api/rooms/${roomId}/tenants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "add" }),
      });

      const data = await res.json();

      if (res.ok) {
        // Clear input
        setNewTenantEmails((prev) => ({ ...prev, [roomId]: "" }));
        // Refresh data to show new tenant
        if (refreshData) refreshData();
      } else {
        alert(data.error || "Failed to add tenant");
      }
    } catch (error) {
      console.error("Error adding tenant:", error);
      alert("Failed to add tenant");
    } finally {
      setAddingTenantMap((prev) => ({ ...prev, [roomId]: false }));
    }
  };

  const handleRemoveTenant = async (roomId: string, email: string) => {
    if (!confirm("Are you sure you want to remove this tenant?")) return;

    try {
      const res = await fetch(`/api/rooms/${roomId}/tenants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "remove" }),
      });

      if (res.ok) {
        if (refreshData) refreshData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to remove tenant");
      }
    } catch (error) {
      console.error("Error removing tenant:", error);
      alert("Failed to remove tenant");
    }
  };

  return (
    <div className="space-y-6">
      {/* Boarding Selection */}
      <div className="bg-backgroundSecondary p-6 rounded-xl border border-borderPrimary shadow-sm">
        <h2 className="text-xl font-semibold text-textPrimary mb-4 flex items-center gap-2">
          <Building2 size={24} />
          Select Boarding
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
                    Capacity: {boarding.totalRooms || 0} rooms
                  </p>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Room Management Section */}
      {selectedBoardingId && selectedBoarding && (
        <div className="bg-backgroundSecondary p-6 rounded-xl border border-borderPrimary shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-textPrimary">
              Rooms for {selectedBoarding.name}
            </h2>
            <Button onClick={addRoom} frontIcon={<Plus size={16} />}>
              Add Room
            </Button>
          </div>

          {selectedBoardingRooms.length === 0 ? (
            <div className="text-center py-8 text-textSecondary">
              No rooms added yet. Click &quot;Add Room&quot; to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {selectedBoardingRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-background p-6 rounded-xl border border-borderPrimary shadow-sm relative group space-y-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-medium text-textPrimary">
                        Room Details
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-textSecondary">
                          {room.isAvailable ? "Available" : "Unavailable"}
                        </span>
                        <button
                          onClick={() =>
                            updateRoom(
                              room.id,
                              "isAvailable",
                              !room.isAvailable,
                            )
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            room.isAvailable ? "bg-primary" : "bg-gray-300"
                          }`}
                          title="Toggle availability"
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              room.isAvailable
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeRoom(room.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-full"
                      title="Remove Room"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Input
                        label="Room Name"
                        value={room.name}
                        onChange={(e) =>
                          updateRoom(room.id, "name", e.target.value)
                        }
                        placeholder="e.g. Master Bedroom"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Capacity"
                          type="number"
                          value={room.capacity}
                          onChange={(e) =>
                            updateRoom(
                              room.id,
                              "capacity",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          min="1"
                        />
                        <Input
                          label="Price (Monthly)"
                          type="number"
                          value={room.price}
                          onChange={(e) =>
                            updateRoom(
                              room.id,
                              "price",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          min="0"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-textPrimary">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={room.description}
                          onChange={(e) =>
                            updateRoom(room.id, "description", e.target.value)
                          }
                          className="w-full p-2 text-textSecondary border border-borderPrimary rounded-lg bg-input focus:ring-2 focus:ring-primary outline-none transition-colors"
                          placeholder="Room specific details..."
                        />
                      </div>

                      {/* Tenants Section */}
                      {!room.id.startsWith("temp-") && (
                        <div className="mt-4 pt-4 border-t border-borderPrimary">
                          <label className="text-sm font-medium text-textPrimary block mb-2">
                            Current Tenants ({room.tenants?.length || 0} / {room.capacity})
                          </label>

                          {/* Add Tenant Form */}
                          <div className="flex gap-2 mb-3">
                            <Input
                              placeholder="Student Email"
                              value={newTenantEmails[room.id] || ""}
                              onChange={(e) =>
                                setNewTenantEmails({
                                  ...newTenantEmails,
                                  [room.id]: e.target.value,
                                })
                              }
                              className="mb-0"
                            />
                            <Button
                              onClick={() => handleAddTenant(room.id)}
                              disabled={
                                addingTenantMap[room.id] ||
                                !newTenantEmails[room.id] ||
                                (room.tenants?.length || 0) >= room.capacity
                              }
                              frontIcon={<UserPlus size={16} />}
                            >
                              Add
                            </Button>
                          </div>

                          {/* Tenant List */}
                          <div className="space-y-2">
                            {room.tenants && room.tenants.length > 0 ? (
                              room.tenants.map((tenant) => (
                                <div
                                  key={tenant._id}
                                  className="flex items-center justify-between p-2 bg-backgroundSecondary rounded-lg border border-borderPrimary text-sm"
                                >
                                  <div>
                                    <p className="font-medium text-textPrimary">{tenant.name}</p>
                                    <p className="text-xs text-textSecondary">{tenant.email}</p>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveTenant(room.id, tenant.email)}
                                    className="text-muted-foreground hover:text-red-500 p-1"
                                    title="Remove Tenant"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-textSecondary italic">
                                No tenants assigned.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Room Images */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-textPrimary block">
                        Room Images
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {room.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="aspect-square rounded-lg relative group overflow-hidden border border-borderPrimary"
                          >
                            <img
                              src={img}
                              alt={`Room ${idx}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => removeRoomImage(room.id, idx)}
                                className="text-white hover:text-red-400"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <label
                          htmlFor={`room-image-${room.id}`}
                          className="aspect-square rounded-lg border-2 border-dashed border-borderPrimary flex flex-col items-center justify-center text-muted-foreground hover:bg-background/50 hover:text-primary transition-colors cursor-pointer"
                        >
                          <Plus size={20} />
                          <span className="text-xs mt-1">Add</span>
                          <input
                            id={`room-image-${room.id}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                addRoomImage(room.id, file);
                                e.target.value = ""; // Reset input
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedBoardingRooms.length > 0 && (
            <div className="flex justify-end mt-6">
              <Button
                onClick={saveRooms}
                frontIcon={<Save size={16} />}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Rooms"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomsTab;
