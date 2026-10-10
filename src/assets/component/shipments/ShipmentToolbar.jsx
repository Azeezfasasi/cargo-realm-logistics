import React from "react";
import { Download, Search, X, Building2, ListFilter, ChevronDown } from "lucide-react";

const FALLBACK_FACILITIES = [
  "Atlanta", "Indianapolis", "New York", "New jersey", "Maryland", "Dallas", "Houston",
  "United States of America", "Canada", "Ontario", "Calgary", "Edmonton", "United Kingdom",
];

const FALLBACK_STATUSES = [
  ["pending", "Pending"], ["in-transit", "In Transit"], ["delivered", "Delivered"],
  ["cancelled", "Cancelled"], ["processing", "Processing"], ["out-for-delivery", "Out For Delivery"],
  ["pickup-scheduled", "Pickup Scheduled"], ["picked-up", "Picked Up"], ["arrived-at-hub", "Arrived at Hub"],
  ["departed-from-hub", "Departed from Hub"], ["on-hold", "On Hold"], ["customs-clearance", "Customs Clearance"],
];

function FilterSelect({ icon, value, onChange, children, className = "" }) {
  const Icon = icon;
  return (
    <div className={`relative ${className}`}>
      <Icon size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-10 w-full cursor-pointer appearance-none truncate rounded-xl border bg-white pl-9 pr-9 text-sm text-gray-700 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 ${
          value ? "border-green-300 bg-green-50/50" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {children}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

const ShipmentToolbar = ({
  searchQuery,
  onSearch,
  onStatusChange,
  onExport,
  selectedStatus,
  onFacilityChange,
  selectedFacility,
  facilities = [],
  statuses = [],
  onClearFilters,
}) => {
  const hasFilters = Boolean(searchQuery || selectedStatus || selectedFacility);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm lg:flex-row lg:items-center">
      <div className="relative w-full lg:max-w-sm lg:flex-1">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search tracking no, sender, receiver, destination…"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50/60 pl-9 pr-9 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
        />
        {searchQuery && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onSearch("")}
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:ml-auto">
        <FilterSelect icon={Building2} value={selectedFacility} onChange={onFacilityChange} className="sm:w-52">
          <option value="">All facilities</option>
          {Array.isArray(facilities) && facilities.length > 0
            ? facilities.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name}{f.count != null ? ` (${f.count})` : ""}
                </option>
              ))
            : FALLBACK_FACILITIES.map((name) => <option key={name} value={name}>{name}</option>)}
        </FilterSelect>

        <FilterSelect icon={ListFilter} value={selectedStatus} onChange={onStatusChange} className="sm:w-56">
          <option value="">All statuses</option>
          {Array.isArray(statuses) && statuses.length > 0
            ? statuses.map((status) =>
                status.isActive && (
                  <option key={status._id} value={status.code || status.name.toLowerCase()}>
                    {status.name}
                  </option>
                )
              )
            : FALLBACK_STATUSES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </FilterSelect>

        <div className="flex gap-2">
          {onClearFilters && hasFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 sm:flex-none"
            >
              <X size={15} /> Clear
            </button>
          )}
          <button
            type="button"
            onClick={onExport}
            className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-xs transition-colors hover:border-gray-300 hover:bg-gray-50 sm:flex-none"
          >
            <Download size={15} /> Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShipmentToolbar;
