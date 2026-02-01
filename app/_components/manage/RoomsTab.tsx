import React from "react";
import Input from "@/app/_components/inputs/Input";
import { Button } from "@/app/_components/Button";
import { Plus, Trash2, Save, Building2 } from "lucide-react";

interface Room {
  id: string;
  boardingId: string;
  name: string;
  capacity: number;
  price: number;
  description: string;
  images: string[];
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
}) => {
  const selectedBoarding = boardings.find((b) => b.id === selectedBoardingId);
  const selectedBoardingRooms = rooms.filter(
    (r) => r.boardingId === selectedBoardingId
  );

  return (
    <div className="space-y-6">
      {/* Boarding Selection */}
      <div className="bg-backgroundSecondary p-6 rounded-xl border border-borderPrimary shadow-sm">
        <h2 className="text-xl font-semibold text-textPrimary mb-4 flex items-center gap-2">
          <Building2 size={24} />
          Select Boarding
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boardings.filter((b) => b.id && !b.id.startsWith("temp-")).length === 0 ? (
            <div className="col-span-full text-center py-8 text-textSecondary">
              No Boardings available. Please add a boarding first in the General tab.
            </div>
          ) : (
            boardings
              .filter((b) => b.id && !b.id.startsWith("temp-"))
              .map((boarding) => (
                <div
                  key={boarding.id}
                  onClick={() => setSelectedBoardingId(boarding.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedBoardingId === boarding.id
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
                    <h3 className="text-lg font-medium text-textPrimary">
                      Room Details
                    </h3>
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
                              parseInt(e.target.value) || 0
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
                              parseFloat(e.target.value) || 0
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