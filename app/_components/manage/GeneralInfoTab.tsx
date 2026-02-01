import { Button } from "@/app/_components/Button";
import Input from "@/app/_components/inputs/Input";
import { Building2, Image as ImageIcon, Plus, Save, X } from "lucide-react";
import React from "react";

interface Boarding {
  id: string;
  name: string;
  description: string;
  mainImage: string | null;
  totalRooms?: number;
}

interface GeneralInfoTabProps {
  boardings: Boarding[];
  selectedBoardingId: string;
  setSelectedBoardingId: (id: string) => void;
  selectedBoarding: Boarding | null;
  updateBoardingInfo: (field: keyof Boarding, value: any) => void;
  handleGeneralChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  totalCapacity: number;
  addBoarding: () => void;
  saveBoardingDetails: () => void;
  saving: boolean;
}

const GeneralInfoTab: React.FC<GeneralInfoTabProps> = ({
  boardings,
  selectedBoardingId,
  setSelectedBoardingId,
  selectedBoarding,
  updateBoardingInfo,
  handleGeneralChange,
  totalCapacity,
  addBoarding,
  saveBoardingDetails,
  saving,
}) => {
  const detailsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (selectedBoarding?.id?.startsWith("temp-") && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedBoarding?.id]);

  return (
    <div className="space-y-6">
      {/* Boarding Selection */}
      <div className="bg-backgroundSecondary p-6 rounded-xl border border-borderPrimary shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-textPrimary flex items-center gap-2">
            <Building2 size={24} />
            Your Boardings
          </h2>
          <Button onClick={addBoarding} frontIcon={<Plus size={16} />}>
            Add New Boarding
          </Button>
        </div>

        {/* Boarding List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boardings.filter((b) => b.id && !b.id.startsWith("temp-")).length ===
          0 ? (
            <div className="col-span-full text-center py-8 text-textSecondary">
              No Boardings yet
            </div>
          ) : (
            boardings
              .filter(
                (boarding) => boarding.id && !boarding.id.startsWith("temp-"),
              )
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
                  {boarding.mainImage ? (
                    <img
                      src={boarding.mainImage}
                      alt={boarding.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  ) : (
                    <div className="w-full h-32 bg-background rounded-lg mb-3 flex items-center justify-center">
                      <ImageIcon size={32} className="text-muted-foreground" />
                    </div>
                  )}
                  <h3 className="font-semibold text-textPrimary truncate">
                    {boarding.name || "Unnamed Boarding"}
                  </h3>
                  <p className="text-sm text-textSecondary truncate">
                    {boarding.description || "No description"}
                  </p>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Selected Boarding Details */}
      {selectedBoarding && (
        <div
          ref={detailsRef}
          className="bg-backgroundSecondary p-6 rounded-xl border border-borderPrimary shadow-sm"
        >
          <h2 className="text-xl font-semibold text-textPrimary mb-6">
            {selectedBoarding.id?.startsWith("temp-")
              ? "Add New Boarding"
              : `Edit: ${selectedBoarding.name || "Unnamed Boarding"}`}
          </h2>

          <div className="space-y-6">
            {/* Main Image */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-textPrimary">
                Boarding Image
              </label>
              <div className="flex gap-4 items-start">
                <label
                  htmlFor="boarding-main-image"
                  className={`w-full aspect-video rounded-lg border-2 border-dashed border-borderPrimary flex flex-col items-center justify-center text-muted-foreground hover:bg-background/50 cursor-pointer transition-colors relative overflow-hidden ${
                    !selectedBoarding.mainImage ? "p-8" : ""
                  }`}
                >
                  {selectedBoarding.mainImage ? (
                    <>
                      <img
                        src={selectedBoarding.mainImage}
                        alt="Main"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          updateBoardingInfo("mainImage", null);
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
                  <input
                    id="boarding-main-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updateBoardingInfo(
                            "mainImage",
                            reader.result as string,
                          );
                        };
                        reader.readAsDataURL(file);
                        e.target.value = ""; // Reset input
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Boarding Name */}
            <Input
              label="Boarding Name"
              name="name"
              value={selectedBoarding.name}
              onChange={handleGeneralChange}
              placeholder="Enter boarding name"
            />

            {/* Total Rooms */}
            <Input
              label="Total Number of Rooms"
              name="totalRooms"
              type="number"
              value={selectedBoarding.totalRooms}
              onChange={handleGeneralChange}
              placeholder="Enter total number of rooms"
              min="0"
            />

            {/* Total Room Capacity (Calculated) */}

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-textPrimary">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={selectedBoarding.description}
                onChange={handleGeneralChange}
                className="w-full p-2 text-textSecondary border border-borderPrimary rounded-lg bg-input focus:ring-2 focus:ring-primary outline-none transition-colors"
                placeholder="Describe your boarding place..."
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={saveBoardingDetails}
                frontIcon={<Save size={16} />}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : selectedBoarding.id?.startsWith("temp-")
                    ? "Create Boarding"
                    : "Save Details"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralInfoTab;
