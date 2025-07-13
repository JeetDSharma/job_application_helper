import { BuildingOfficeIcon, UserGroupIcon } from "@heroicons/react/24/outline";

type CompanyCardProps = {
  companyName: string;
  recipientCount: number;
};

export default function CompanyCard({
  companyName,
  recipientCount,
}: CompanyCardProps) {
  return (
    <div className="bg-white w-60 p-4 py-8 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition cursor-pointer">
      <div className="flex items-center gap-2 mb-2">
        <BuildingOfficeIcon className="h-5 w-5 text-indigo-500" />
        <h3 className="text-base font-semibold text-gray-800">{companyName}</h3>
      </div>

      <div className="flex items-center gap-1 text-sm text-gray-600">
        <UserGroupIcon className="h-4 w-4" />
        <span>
          {recipientCount} recipient{recipientCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
