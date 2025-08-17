import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";

// The props have been updated to match the parent component
const ShipmentToolbar = ({
  searchQuery,
  onSearch,
  onStatusChange,
  onExport,
  selectedStatus,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-gray-50 rounded-xl shadow">
      <div className="flex items-center gap-2 w-full md:w-auto">
        <Search className="text-gray-500" />
        <Input
          type="text"
          placeholder="Search by name, ID or destination"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full md:w-64"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="processing">Processing</option>
          <option value="out-for-delivery">Out For Delivery</option>
          <option value="pickup-scheduled">Pickup Scheduled</option>
          <option value="picked-up">Picked Up</option>
          <option value="arrived-at-hub">Arrived at Hub</option>
          <option value="departed-from-hub">Departed from Hub</option>
          <option value="on-hold">On Hold</option>
          <option value="customs-clearance">Customs Clearance</option>
          <option value="Awaiting Pickup">Awaiting Pickup</option>
          <option value="failed-delivery-attempt">Failed Delivery Attempt</option>
          <option value="Arrived Carrier Connecting facility">Arrived Carrier Connecting facility</option>
          <option value="Departed CARGO realm facility (Nig)">Departed CARGO realm facility (Nig)</option>
          <option value="Arrived nearest airport">Arrived nearest airport</option>
          <option value="Shipment is Delayed">Shipment is Delayed</option>
          <option value="Delivery date not available">Delivery date not available</option>
          <option value="Available for pick up,check phone for instructions">Available for pick up,check phone for instructions</option>
          <option value="Processed in Lagos Nigeria">Processed in Lagos Nigeria</option>
          <option value="Pending Carrier lift">Pending Carrier lift</option>
          <option value="Scheduled to depart on the next movement">Scheduled to depart on the next movement</option>
          <option value="Received from flight">Received from flight</option>
          <option value="Package is received and accepted by airline">Package is received and accepted by airline</option>
          <option value="Customs clearance completed">Customs clearance completed</option>
          <option value="Delivery is booked">Delivery is booked</option>
          <option value="Arrived at an international sorting facility and will be ready for delivery soon">Arrived at an international sorting facility and will be ready for delivery soon</option>
        </select>

        <Button variant="outline" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>
    </div>
  );
};

export default ShipmentToolbar;
