import React from "react";
import Input from "@/app/_components/inputs/Input";
import { Button } from "@/app/_components/Button";
import { Save, Image as ImageIcon, X } from "lucide-react";

interface GeneralInfo {
  name: string;
  description: string;
  mainImage: string | null;
}

interface GeneralInfoTabProps {
  generalInfo: GeneralInfo;
  setGeneralInfo: React.Dispatch<React.SetStateAction<GeneralInfo>>;
  handleGeneralChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  totalCapacity: number;
}

const GeneralInfoTab: React.FC<GeneralInfoTabProps> = ({
  generalInfo,
  setGeneralInfo,
  handleGeneralChange,
  totalCapacity,
}) => {
  return (
    <div className="space-y-6 bg-backgroundSecondary p-6 rounded-xl border border-borderPrimary shadow-sm">
      <h2 className="text-xl font-semibold text-textPrimary">
        General Information
      </h2>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-textPrimary">
          Boarding Image
        </label>
        <div className="flex gap-4 items-start">
          <div
            className={`w-full aspect-video rounded-lg border-2 border-dashed border-borderPrimary flex flex-col items-center justify-center text-muted-foreground hover:bg-background/50 cursor-pointer transition-colors relative overflow-hidden ${
              !generalInfo.mainImage ? "p-8" : ""
            }`}
            onClick={() =>
              !generalInfo.mainImage &&
              setGeneralInfo((prev) => ({
                ...prev,
                mainImage: "https://picsum.photos/seed/boarding/800/600",
              }))
            }
          >
            {generalInfo.mainImage ? (
              <>
                <img
                  src={generalInfo.mainImage}
                  alt="Main"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setGeneralInfo((prev) => ({ ...prev, mainImage: null }));
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <ImageIcon size={32} className="mb-2" />
                <span>Click to Upload Main Image</span>
              </>
            )}
          </div>
        </div>
      </div>

      <Input
        label="Boarding Name"
        name="name"
        value={generalInfo.name}
        onChange={handleGeneralChange}
        placeholder="Enter boarding name"
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-textPrimary">
          Number of Rooms (Calculated)
        </label>
        <div className="w-full p-2 text-textSecondary border border-borderPrimary rounded-lg bg-input cursor-not-allowed">
          {totalCapacity} Rooms
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-textPrimary">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          value={generalInfo.description}
          onChange={handleGeneralChange}
          className="w-full p-2 text-textSecondary border border-borderPrimary rounded-lg bg-input focus:ring-2 focus:ring-primary outline-none transition-colors"
          placeholder="Describe your boarding place..."
        />
      </div>
      <div className="flex justify-end">
        <Button frontIcon={<Save size={16} />}>Save Details</Button>
      </div>
    </div>
  );
};

export default GeneralInfoTab;
