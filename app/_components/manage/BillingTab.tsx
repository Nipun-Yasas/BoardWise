import React, { useState } from "react";
import Input from "@/app/_components/inputs/Input";
import { Button } from "@/app/_components/Button";
import { Plus, Trash2, Save } from "lucide-react";

interface BillType {
  id: string;
  name: string;
}

interface MonthlyBill {
  month: string;
  bills: Record<string, number>;
  dueDate: string;
}

interface BillingTabProps {
  billTypes: BillType[];
  addBillType: (name: string) => void;
  removeBillType: (id: string) => void;
  monthlyBills: Record<string, MonthlyBill>;
  selectedMonth: string;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
  handleBillAmountChange: (billTypeId: string, amount: number) => void;
  handleDueDateChange: (date: string) => void;
}

const BillingTab: React.FC<BillingTabProps> = ({
  billTypes,
  addBillType,
  removeBillType,
  monthlyBills,
  selectedMonth,
  setSelectedMonth,
  handleBillAmountChange,
  handleDueDateChange,
}) => {
  const [newBillTypeName, setNewBillTypeName] = useState("");
  const currentBillData = monthlyBills[selectedMonth] || {
    bills: {},
    dueDate: "",
  };

  return (
    <div className="space-y-8">
      <div className="bg-backgroundSecondary p-6 rounded-xl border border-borderPrimary shadow-sm">
        <h2 className="text-xl font-semibold text-textPrimary mb-4">
          Bill Types
        </h2>
        <div className="mb-4 flex gap-2 max-w-md">
          <Input
            placeholder="New Bill Type (e.g. Internet)"
            value={newBillTypeName}
            onChange={(e) => setNewBillTypeName(e.target.value)}
            className="mb-0"
          />
          <Button
            onClick={() => {
              addBillType(newBillTypeName);
              setNewBillTypeName("");
            }}
            frontIcon={<Plus size={16} />}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {billTypes.map((type) => (
            <div
              key={type.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-full border border-borderPrimary"
            >
              <span className="text-sm font-medium">{type.name}</span>
              <button
                onClick={() => removeBillType(type.id)}
                className="text-muted-foreground hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-backgroundSecondary p-6 rounded-xl border border-borderPrimary shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-textPrimary">
            Monthly Billing Values
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

        <div className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4 items-end">
            <div className="col-span-2">
              <Input
                type="date"
                label="Bill Due Date"
                value={currentBillData.dueDate}
                onChange={(e) => handleDueDateChange(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t border-borderPrimary my-4 pt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
              Bill Amounts
            </h3>
            <div className="grid gap-4">
              {billTypes.map((type) => (
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
                      value={currentBillData.bills[type.id] || ""}
                      onChange={(e) =>
                        handleBillAmountChange(
                          type.id,
                          parseFloat(e.target.value)
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
          </div>

          <div className="flex justify-end pt-4">
            <Button frontIcon={<Save size={16} />}>
              Save for {selectedMonth}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingTab;
