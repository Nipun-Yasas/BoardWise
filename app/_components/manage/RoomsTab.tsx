import React from "react";
import Input from "@/app/_components/inputs/Input";
import { Button } from "@/app/_components/Button";
import { Plus, Trash2, Save } from "lucide-react";

interface Room {
    id: string;
    name: string;
    capacity: number;
    price: number;
    description: string;
    images: string[];
}

interface RoomsTabProps {
    rooms: Room[];
    addRoom: () => void;
    updateRoom: (id: string, field: keyof Room, value: any) => void;
    removeRoom: (id: string) => void;
    addRoomImage: (roomId: string) => void;
    removeRoomImage: (roomId: string, imageIndex: number) => void;
}

const RoomsTab: React.FC<RoomsTabProps> = ({
    rooms,
    addRoom,
    updateRoom,
    removeRoom,
    addRoomImage,
    removeRoomImage,
}) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-textPrimary">Rooms</h2>
                <Button onClick={addRoom} frontIcon={<Plus size={16} />}>
                    Add Room
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className="bg-backgroundSecondary p-6 rounded-xl border border-borderPrimary shadow-sm relative group space-y-6"
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-textPrimary">Room Details</h3>
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
                                    onChange={(e) => updateRoom(room.id, "name", e.target.value)}
                                    placeholder="e.g. Master Bedroom"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Capacity"
                                        type="number"
                                        value={room.capacity}
                                        onChange={(e) =>
                                            updateRoom(room.id, "capacity", parseInt(e.target.value) || 0)
                                        }
                                    />
                                    <Input
                                        label="Price (Monthly)"
                                        type="number"
                                        value={room.price}
                                        onChange={(e) =>
                                            updateRoom(room.id, "price", parseFloat(e.target.value) || 0)
                                        }
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
                                    <button
                                        onClick={() => addRoomImage(room.id)}
                                        className="aspect-square rounded-lg border-2 border-dashed border-borderPrimary flex flex-col items-center justify-center text-muted-foreground hover:bg-background/50 hover:text-primary transition-colors"
                                    >
                                        <Plus size={20} />
                                        <span className="text-xs mt-1">Add</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {rooms.length > 0 && (
                <div className="flex justify-end mt-4">
                    <Button frontIcon={<Save size={16} />}>Save Rooms</Button>
                </div>
            )}
        </div>
    );
};

export default RoomsTab;
