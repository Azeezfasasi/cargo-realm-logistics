import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
// import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const ShipmentToolbar = ({
  searchQuery,
  onSearch,
  onStatusChange,
  onExportCSV,
  onExportXLSX,
  selectedStatus,
}) => {
  const handleCSVDownload = () => {
    if (onExportCSV) onExportCSV();
  };

  const handleExcelDownload = () => {
    if (onExportXLSX) onExportXLSX();
  };

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
          <option value="Pending">Pending</option>
          <option value="In Transit">In Transit</option>
          <option value="Arrived">Arrived</option>
          <option value="Cleared">Cleared</option>
          <option value="Delivered">Delivered</option>
          <option value="Returned">Returned</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <Button variant="outline" onClick={handleCSVDownload}>
          Export CSV
        </Button>
        <Button variant="outline" onClick={handleExcelDownload}>
          Export Excel
        </Button>
      </div>
    </div>
  );
};

export default ShipmentToolbar;
