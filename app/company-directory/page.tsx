"use client";
import CompanyCard from "@/components/company/CompanyCard";
import CompanyStatsCard from "@/components/company/CompanyStatsCard";
import CompanyTable from "@/components/company/CompanyTable";
import React, { useEffect, useState } from "react";
type CompanyTableInput = {
  companyName: string;
  recipientCount: number;
  createdAt: Date;
};

type CompanyStatsInput = {
  companyCount: number;
  recipientCount: number;
};

export function CompanyDirectory() {
  const [companyData, setCompanyData] = useState<CompanyTableInput[]>([]);
  const [companyStats, setCompanyStats] = useState<CompanyStatsInput>({
    companyCount: 0,
    recipientCount: 0,
  });

  useEffect(() => {
    async function fetchCompanyData() {
      try {
        const response = await fetch("/api/fetch-company");
        const data = await response.json();
        console.log(data);
        setCompanyData(data);
      } catch (error) {
        console.error("Failed to fetch company data:", error);
      }
    }
    async function fetchCompanyStats() {
      try {
        const response = await fetch("/api/fetch-company-stats");
        const data = await response.json();
        console.log(data);
        setCompanyStats(data);
      } catch (error) {
        console.error("Failed to fetch company stats data:", error);
      }
    }
    fetchCompanyData();
    fetchCompanyStats();
  }, []);

  const companyTableInput: CompanyTableInput[] = [
    {
      companyName: "Amazon",
      recipientCount: 10,
      createdAt: new Date("10/10/2025"),
    },
  ];

  return (
    <div className="flex flex-col">
      <CompanyStatsCard
        companyCount={companyStats.companyCount}
        recipientCount={companyStats.recipientCount}
      />
      <div className="flex flex-wrap gap-8 mx-auto justify-center px-4">
        {companyData.map((company) => (
          <CompanyCard
            companyName={company.companyName}
            recipientCount={company.recipientCount}
          />
        ))}
      </div>
      {/* <CompanyCard companyName="AMAZON" recipientCount={5} /> */}
      {/* <CompanyTable companyTableInput={companyData} /> */}
    </div>
  );
}

export default CompanyDirectory;
