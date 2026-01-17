


import {
  LINKEDIN_URL,
  GITHUB_URL,
  PORTFOLIO_URL,
  CONTACT_NUMBER,
  YOUR_NAME,
} from "@/lib/constants";

type EmailTemplateParams = {
  name: string;
  jobPosition: string;
  company: string;
  tenureYears?: number; // Optional field
  personalMention?: string; // Optional field
};

export function buildEmailTemplate({
  name,
  jobPosition,
  company,
  tenureYears,
  personalMention,
}: EmailTemplateParams) {
  return `
     <div>
      <p>Hi ${name},</p>
      <p>
      ${
        personalMention
          ? `I have been following your work at ${company} and wanted to reach out directly. ${personalMention}.`
          : `I have been following your work at ${company} and wanted to reach out directly.`
      } 
      </p>

      <p>
        I came across the <strong>${jobPosition}</strong> role at ${company} and believe it aligns perfectly with my skills and experience. I'm highly interested in applying for this role.
      </p>

      <p>
        If you are open to it, I would appreciate any insights you can share about the team. I have attached my resume and, if you think my background fits, I would be grateful if you could pass it along internally.
      </p>

      <p
      >Thank you for your time${
        tenureYears
          ? `, and congratulations on completing ${tenureYears}+ years at ${company}`
          : `.`
      }
      </p>

      <p>
        Best,<br/>
        ${YOUR_NAME}<br/>
        ${CONTACT_NUMBER}<br/>
        <a href="${LINKEDIN_URL}" target="_blank">LinkedIn</a> |
        <a href="${GITHUB_URL}" target="_blank">GitHub</a> |
        <a href="${PORTFOLIO_URL}" target="_blank">Portfolio</a>
      </p>
    </div>
  `;
}
