import React from "react";
import Input from "../inputs/Input";
import Select from "../inputs/Select";

interface Filters {
  search: string;
  university: string;
  maxDistance: number;
  maxRental: number;
  persons: string;
}

interface BoardingFiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string | number) => void;
}

const BoardingFilters: React.FC<BoardingFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="bg-backgroundSecondary p-6 rounded-xl shadow-md border border-borderPrimary mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            label="Search"
            type="text"
            placeholder="Search details..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
        </div>

        {/* University Filter */}
        <div>
          <Select
            label="University"
            value={filters.university}
            onChange={(e) => onFilterChange("university", e.target.value)}
          >
            <option value="">All Universities</option>
            <option value="UOM">UOM</option>
            <option value="UOC">UOC</option>
            <option value="USJ">USJ</option>
            <option value="Kelaniya">Kelaniya</option>
            <option value="SLIIT">SLIIT</option>
          </Select>
        </div>

        {/* Persons Filter */}
        <div>
          <Select
            label="Persons"
            value={filters.persons}
            onChange={(e) => onFilterChange("persons", e.target.value)}
          >
            <option value="">Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4+">4+</option>
          </Select>
        </div>

        {/* Max Rental Filter */}
        <div>
          <Input
            label="Max Rental (LKR)"
            type="number"
            placeholder="Max Rental"
            value={filters.maxRental || ""}
            onChange={(e) =>
              onFilterChange(
                "maxRental",
                e.target.value ? Number(e.target.value) : 0
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default BoardingFilters;
