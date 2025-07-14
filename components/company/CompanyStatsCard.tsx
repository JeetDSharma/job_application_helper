import React from "react";
import {
  BuildingOffice2Icon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

type CompanyStatsCardInput = {
  companyCount: number;
  recipientCount: number;
};

function CompanyStatsCard({
  companyCount,
  recipientCount,
}: CompanyStatsCardInput) {
  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Company Card */}
        <div className="flex items-center space-x-4 p-6 bg-cyan-100 rounded-lg shadow-md transition hover:shadow-xl hover:scale-[1.02] cursor-pointer">
          <BuildingOffice2Icon className="h-10 w-10 text-cyan-600" />
          <div>
            <p className="text-3xl font-bold text-gray-800">{companyCount}</p>
            <p className="text-sm text-gray-700">Total Companies</p>
          </div>
        </div>

        {/* Recipient Card */}
        <div className="flex items-center space-x-4 p-6 bg-cyan-100 rounded-lg shadow-md transition hover:shadow-xl hover:scale-[1.02] cursor-pointer">
          <UserGroupIcon className="h-10 w-10 text-cyan-600" />
          <div>
            <p className="text-3xl font-bold text-gray-800">{recipientCount}</p>
            <p className="text-sm text-gray-700">Total Recipients</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyStatsCard;
