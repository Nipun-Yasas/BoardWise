import React from "react";
import { MapPin } from "lucide-react";

type StayStatusIndicatorProps = {
  isAtBoarding: boolean;
  currentStayDuration: number;
};

const StayStatusIndicator = ({
  isAtBoarding,
  currentStayDuration,
}: StayStatusIndicatorProps) => {
  return (
    <div className="bg-backgroundSecondary border border-borderPrimary rounded-2xl p-6 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-full ${
            isAtBoarding
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <MapPin size={24} />
        </div>
        <div>
          <p className="text-sm text-textSecondary">Current Status</p>
          <h2 className="text-lg font-bold text-textPrimary">
            {isAtBoarding ? "In Boarding" : "Away"}
          </h2>
        </div>
      </div>
      {isAtBoarding && (
        <div className="text-right">
          <p className="text-sm text-textSecondary">Duration</p>
          <p className="text-2xl font-bold text-textPrimary">
            {currentStayDuration}{" "}
            <span className="text-sm font-normal text-textSecondary">days</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default StayStatusIndicator;
