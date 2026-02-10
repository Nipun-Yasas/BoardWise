import { Button } from "@/app/_components/Button";
import axiosInstance, { API_PATHS } from "@/lib/axios";
import { Building2, Check, DollarSign, Wallet, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface Tenant {
  _id: string;
  name: string;
  email: string;
  mobile_number: string;
}

interface RentPayment {
  _id: string;
  tenantId: Tenant;
  month: string;
  rentAmount: number;
  isPaid: boolean;
  paidDate?: string;
  notes: string;
}

interface Room {
  id: string;
  name: string;
  price: number;
  tenants: any[];
  capacity: number;
}

interface RentTrackerProps {
  boardings: any[];
  selectedBoardingId: string;
  rooms: Room[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

const RentTracker: React.FC<RentTrackerProps> = ({
  boardings,
  selectedBoardingId,
  rooms,
  selectedMonth,
  setSelectedMonth,
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rentPayments, setRentPayments] = useState<RentPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const selectedRoomData = rooms.find((r) => r.id === selectedRoomId);

  // Fetch rent payments when room or month changes
  useEffect(() => {
    if (selectedRoomId && selectedMonth) {
      // Clear previous data to show loading state
      setRentPayments([]);
      fetchRentPayments();
    }
  }, [selectedRoomId, selectedMonth]);

  // Update selected room data
  useEffect(() => {
    if (selectedRoomData) {
      setSelectedRoom(selectedRoomData);
    }
  }, [selectedRoomId, selectedRoomData]);

  const fetchRentPayments = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.RENT_PAYMENT.GET_ALL(selectedRoomId, selectedMonth));
      const payments = response.data.rentPayments || [];
      
      // If no payments exist, create them
      if (payments.length === 0) {
        await createRentPayments();
      } else {
        setRentPayments(payments);
      }
    } catch (error: any) {
      console.error("Error fetching rent payments:", error);
      toast.error("Failed to fetch rent payments");
    } finally {
      setLoading(false);
    }
  };

  const createRentPayments = async () => {
    try {
      const response = await axiosInstance.post(API_PATHS.RENT_PAYMENT.CREATE, {
        roomId: selectedRoomId,
        month: selectedMonth,
      });
      const payments = response.data.rentPayments || [];
      setRentPayments(payments);
      if (payments.length === 0) {
        toast.info("No tenants assigned to this room");
      }
    } catch (error: any) {
      console.error("Error creating rent payments:", error);
      if (error.response?.data?.error === "Add tenants first") {
        toast.error("Please add tenants to this room first");
      } else {
        toast.error("Failed to create rent payments");
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (
    paymentId: string,
    isPaid: boolean,
  ) => {
    try {
      setUpdating(paymentId);
      const response = await axiosInstance.patch(
        API_PATHS.RENT_PAYMENT.UPDATE(paymentId),
        {
          isPaid,
          paidDate: isPaid ? new Date().toISOString() : null,
        },
      );

      // Update local state
      setRentPayments(
        rentPayments.map((payment) =>
          payment._id === paymentId
            ? response.data.rentPayment
            : payment,
        ),
      );

      toast.success(
        isPaid ? "Marked as paid" : "Marked as unpaid",
      );
    } catch (error: any) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    } finally {
      setUpdating(null);
    }
  };

  const calculateRevenue = () => {
    return rentPayments.reduce(
      (sum, payment) => sum + (payment.isPaid ? payment.rentAmount : 0),
      0,
    );
  };

  const calculateTotalDue = () => {
    return rentPayments.reduce((sum, payment) => sum + payment.rentAmount, 0);
  };

  const totalPaid = calculateRevenue();
  const totalDue = calculateTotalDue();
  const paidCount = rentPayments.filter((p) => p.isPaid).length;
  const totalCount = rentPayments.length;

  return (
    <div className="space-y-6">
      {/* Room Selection */}
      <div className="bg-backgroundSecondary p-6 rounded-xl border border-borderPrimary shadow-sm">
        <h2 className="text-xl font-semibold text-textPrimary flex items-center gap-2 mb-4">
          <Building2 size={24} />
          Select Room
        </h2>

        {rooms.length === 0 ? (
          <div className="text-center py-8 text-textSecondary">
            No rooms available. Add rooms first.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRoomId === room.id
                    ? "border-primary bg-primary/5"
                    : "border-borderPrimary hover:border-primary/50"
                }`}
              >
                <h3 className="font-semibold text-textPrimary mb-2">
                  {room.name}
                </h3>
                <div className="text-sm text-textSecondary space-y-1">
                  <p>Rent: Rs. {room.price.toLocaleString()}</p>
                  <p>
                    Tenants: {room.tenants?.length || 0} / {room.capacity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Room Details and Payments */}
      {selectedRoom && (
        <div className="bg-backgroundSecondary p-6 rounded-xl border border-borderPrimary shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-textPrimary">
                {selectedRoom.name} - Rent Tracker
              </h2>
              <p className="text-sm text-textSecondary mt-1">
                Total Rent: Rs. {selectedRoom.price.toLocaleString()}
              </p>
            </div>

            {/* Month Selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-textPrimary">
                Month:
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 text-textSecondary border border-borderPrimary rounded-lg bg-input focus:ring-2 focus:ring-primary outline-none transition-colors"
              />
            </div>
          </div>

          {/* No Tenants Message */}
          {(!selectedRoom.tenants || selectedRoom.tenants.length === 0) && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                Please add tenants to this room first to track rent payments.
              </p>
            </div>
          )}

          {selectedRoom.tenants && selectedRoom.tenants.length > 0 && (
            <>
              {/* Revenue Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-background p-4 rounded-lg border border-borderPrimary">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-textSecondary uppercase">
                        Total Due
                      </p>
                      <p className="text-2xl font-bold text-textPrimary mt-1">
                        Rs. {totalDue.toLocaleString()}
                      </p>
                    </div>
                    <DollarSign
                      size={32}
                      className="text-yellow-500 opacity-20"
                    />
                  </div>
                </div>

                <div className="bg-background p-4 rounded-lg border border-borderPrimary">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-textSecondary uppercase">
                        Total Paid
                      </p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        Rs. {totalPaid.toLocaleString()}
                      </p>
                    </div>
                    <Check
                      size={32}
                      className="text-green-500 opacity-20"
                    />
                  </div>
                </div>

                <div className="bg-background p-4 rounded-lg border border-borderPrimary">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-textSecondary uppercase">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-red-600 mt-1">
                        Rs. {(totalDue - totalPaid).toLocaleString()}
                      </p>
                    </div>
                    <Wallet
                      size={32}
                      className="text-red-500 opacity-20"
                    />
                  </div>
                </div>

                <div className="bg-background p-4 rounded-lg border border-borderPrimary">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-textSecondary uppercase">
                        Payment Rate
                      </p>
                      <p className="text-2xl font-bold text-primary mt-1">
                        {totalCount > 0
                          ? Math.round((paidCount / totalCount) * 100)
                          : 0}
                        %
                      </p>
                    </div>
                    <div className="text-sm text-textSecondary">
                      {paidCount}/{totalCount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tenants Rent Table */}
              {loading && rentPayments.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-borderPrimary">
                        <th className="text-left py-3 px-4 font-semibold text-textPrimary text-sm">
                          Tenant Name
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-textPrimary text-sm">
                          Email
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-textPrimary text-sm">
                          Rent Due
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-textPrimary text-sm">
                          Status
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-textPrimary text-sm">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rentPayments.map((payment) => (
                        <tr
                          key={payment._id}
                          className="border-b border-borderPrimary hover:bg-background/50"
                        >
                          <td className="py-3 px-4 text-textPrimary">
                            {payment.tenantId?.name || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-textSecondary text-sm">
                            {payment.tenantId?.email || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-right text-textPrimary font-medium">
                            Rs. {payment.rentAmount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                payment.isPaid
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                            >
                              {payment.isPaid ? "Paid" : "Unpaid"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() =>
                                updatePaymentStatus(
                                  payment._id,
                                  !payment.isPaid,
                                )
                              }
                              disabled={updating === payment._id}
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                payment.isPaid
                                  ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                  : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                              } disabled:opacity-50`}
                            >
                              {updating === payment._id ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                </>
                              ) : payment.isPaid ? (
                                <>
                                  <X size={14} />
                                  Mark Unpaid
                                </>
                              ) : (
                                <>
                                  <Check size={14} />
                                  Mark Paid
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RentTracker;
