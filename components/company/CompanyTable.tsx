import React from "react";

type CompanyTableInput = {
  companyName: string;
  recipientCount: number;
  createdAt: Date;
};

type CompanyTableProps = {
  companyTableInput: CompanyTableInput[];
};
export function CompanyTable({ companyTableInput }: CompanyTableProps) {
  console.log(companyTableInput);
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
              Company
            </th>
            <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
              Recipient Count
            </th>
            {/* <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
              Created At
            </th> */}
          </tr>
        </thead>
        <tbody>
          {companyTableInput.map((element: any) => (
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
              >
                {element.companyName}
              </th>
              <td className="px-6 py-4">{element.recipientCount}</td>
              {/* <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                <Date>{element.createdAt}</Date>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CompanyTable;
