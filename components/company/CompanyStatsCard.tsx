import React from "react";

type CompanyStatsCardInput = {
  companyCount: number;
  recipientCount: number;
};

function CompanyStatsCard({
  companyCount,
  recipientCount,
}: CompanyStatsCardInput) {
  return (
    <div className="bg-gray-100 min-h-36">
      <div className="max-w-lg flex flex-row items-center justify-center mx-auto min-h-32 shadow-md rounded-md cursor-pointer bg-cyan-200">
        <div className="bg-cyan-100 shadow-sm mx-4 px-16 py-4">
          <p className="font-semibold text-3xl text-left">{companyCount}</p>

          <p className="text-sm">Total Companies</p>
        </div>
        <div className="bg-cyan-100 shadow-sm mx-4 px-16 py-4">
          <p className="font-semibold text-3xl text-left">{recipientCount}</p>

          <p className="text-sm">Total Recipients</p>
        </div>
      </div>
    </div>
  );
}

export default CompanyStatsCard;
