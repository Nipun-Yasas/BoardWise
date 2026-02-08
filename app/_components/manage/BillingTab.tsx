import { Button } from "@/app/_components/Button";
import Input from "@/app/_components/inputs/Input";
import { Plus, Save, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface BillType {
  id: string;
  name: string;
}

interface Room {
  id: string;
  name: string;
  capacity: number;
  price: number;
  description: string;
  images: string[];
  billTypes: BillType[];
  boardingId: string;
}

interface Boarding {
  id: string;
  name: string;
  totalRooms?: number;
}

interface RoomBill {
  roomId: string;
  month: string;
  bills: Record<string, number>;
  dueDate: string;
}

interface BillingTabProps {
  boardings: Boarding[];
  selectedBoardingId: string;
  setSelectedBoardingId: (id: string) => void;
  rooms: Room[];
  addRoomBillType: (roomId: string, name: string) => void;
  removeRoomBillType: (roomId: string, billTypeId: string) => void;
  roomBills: RoomBill[];
  selectedMonth: string;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
  handleRoomBillAmountChange: (
    roomId: string,
    billTypeId: string,
    amount: number,
  ) => void;
  handleRoomDueDateChange: (roomId: string, date: string) => void;
  saveMonthlyBills: (roomId?: string) => void;
  savingRoomId: string | null;
}

const BillingTab: React.FC<BillingTabProps> = ({
  boardings,
  selectedBoardingId,
  setSelectedBoardingId,
  rooms,
  addRoomBillType,
  removeRoomBillType,
  roomBills,
  selectedMonth,
  setSelectedMonth,
  handleRoomBillAmountChange,
  handleRoomDueDateChange,
  saveMonthlyBills,
  savingRoomId,
}) => {
  const [newBillTypeNames, setNewBillTypeNames] = useState<
    Record<string, string>
  >({});

  const selectedBoarding = boardings?.find((b) => b.id === selectedBoardingId);
  const selectedBoardingRooms =
    rooms?.filter((r) => r.boardingId === selectedBoardingId) || [];

  const getRoomBillData = (roomId: string) => {
    return (
      roomBills?.find(
        (bill) => bill.roomId === roomId && bill.month === selectedMonth,
      ) || {
        roomId,
        month: selectedMonth,
        bills: {},
        dueDate: "",
      }
    );
  };

  // Handle loading state
  if (!boardings || !rooms) {
    return (
      <div className="bg-backgroundSecondary p-8 rounded-xl border border-borderPrimary text-center">
        <p className="text-textSecondary">Loading boarding data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Boarding Selection */}
      <div className="bg-backgroundSecondary p-6 rounded-xl border border-borderPrimary shadow-sm">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">
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

      {/* Month Selection and Room Bills */}
      {selectedBoardingId && selectedBoarding && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-textPrimary">
              Room-Specific Billing for {selectedBoarding.name}
            </h2>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-textPrimary">
                Select Month:
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="p-2 rounded-lg border border-borderPrimary bg-input text-textSecondary outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* No Rooms Message */}
          {selectedBoardingRooms.length === 0 && (
            <div className="bg-backgroundSecondary p-8 rounded-xl border border-borderPrimary text-center">
              <p className="text-textSecondary">
                No rooms available. Please add rooms first in the Rooms tab.
              </p>
            </div>
          )}

          {/* Room Bills */}
          {selectedBoardingRooms.map((room) => {
            const roomBillData = getRoomBillData(room.id);

            return (
              <div
                key={room.id}
                className="bg-backgroundSecondary p-6 rounded-xl border border-borderPrimary shadow-sm"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-textPrimary">
                      {room.name || "Unnamed Room"}
                    </h3>
                    <p className="text-sm text-textSecondary">
                      Capacity: {room.capacity} | Monthly Rent: LKR {room.price}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Bill Types for This Room */}
                  <div className="bg-background p-4 rounded-lg border border-borderPrimary">
                    <h4 className="text-sm font-medium text-textPrimary mb-3">
                      Bill Types for this Room
                    </h4>
                    <div className="mb-3 flex gap-2">
                      <Input
                        placeholder="New Bill Type (e.g. Electricity, Water)"
                        value={newBillTypeNames[room.id] || ""}
                        onChange={(e) =>
                          setNewBillTypeNames({
                            ...newBillTypeNames,
                            [room.id]: e.target.value,
                          })
                        }
                        className="mb-0"
                      />
                      <Button
                        onClick={() => {
                          addRoomBillType(
                            room.id,
                            newBillTypeNames[room.id] || "",
                          );
                          setNewBillTypeNames({
                            ...newBillTypeNames,
                            [room.id]: "",
                          });
                        }}
                        frontIcon={<Plus size={16} />}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {room.billTypes.length === 0 ? (
                        <p className="text-textSecondary text-sm">
                          No bill types added for this room yet.
                        </p>
                      ) : (
                        room.billTypes.map((type) => (
                          <div
                            key={type.id}
                            className="flex items-center gap-2 px-3 py-1.5 bg-backgroundSecondary rounded-full border border-borderPrimary"
                          >
                            <span className="text-sm font-medium">
                              {type.name}
                            </span>
                            <button
                              onClick={() =>
                                removeRoomBillType(room.id, type.id)
                              }
                              className="text-muted-foreground hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Due Date */}
                  <Input
                    type="date"
                    label="Bill Due Date"
                    value={roomBillData.dueDate}
                    onChange={(e) =>
                      handleRoomDueDateChange(room.id, e.target.value)
                    }
                  />

                  {/* Bill Amounts */}
                  <div className="border-t border-borderPrimary pt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                      Bill Amounts for {selectedMonth}
                    </h4>

                    {room.billTypes.length === 0 ? (
                      <p className="text-textSecondary text-sm">
                        Add bill types above to enter amounts.
                      </p>
                    ) : (
                      <div className="grid gap-4">
                        {room.billTypes.map((type) => (
                          <div
                            key={type.id}
                            className="grid grid-cols-3 gap-4 items-center"
                          >
                            <span className="font-medium text-textPrimary">
                              {type.name}
                            </span>
                            <div className="col-span-2">
                              <Input
                                type="number"
                                placeholder="Amount"
                                value={roomBillData.bills[type.id] || ""}
                                onChange={(e) =>
                                  handleRoomBillAmountChange(
                                    room.id,
                                    type.id,
                                    parseFloat(e.target.value) || 0,
                                  )
                                }
                                icon={
                                  <span className="text-muted-foreground text-sm font-semibold">
                                    LKR
                                  </span>
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  {room.billTypes.length > 0 && (
                    <div className="flex justify-between items-center pt-4 border-t border-borderPrimary">
                      <span className="font-semibold text-textPrimary">
                        Total Bills:
                      </span>
                      <span className="text-lg font-bold text-primary">
                        LKR{" "}
                        {Object.values(roomBillData.bills).reduce(
                          (sum, amount) => sum + (amount || 0),
                          0,
                        )}
                      </span>
                    </div>
                  )}

                  {/* Save Button for this Room */}
                  <div className="flex justify-end pt-4">
                    <Button
                      frontIcon={<Save size={16} />}
                      onClick={() => saveMonthlyBills(room.id)}
                      disabled={savingRoomId === room.id}
                    >
                      {savingRoomId === room.id
                        ? "Saving..."
                        : `Save Bills for ${room.name || "Room"}`}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default BillingTab;
