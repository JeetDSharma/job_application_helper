import {
  LINKEDIN_URL,
  GITHUB_URL,
  PORTFOLIO_URL,
  CONTACT_NUMBER,
  YOUR_NAME,
} from "@/lib/constants";

type AlumTemplateParams = {
  name: string;
  jobPosition: string;
  company: string;
  university: string;
};

export function buildAlumTemplate({
  name,
  jobPosition,
  company,
  university,
}: AlumTemplateParams): string {
  return `
    <div style="font-family: sans-serif; line-height: 1.5;">
      <p>Hi ${name},</p>

      <p>I hope you're doing well.</p>

      <p>
        I noticed that we both attended <strong>${university}</strong>, and I always appreciate connecting with fellow alumni.
        I recently came across the <strong>${jobPosition}</strong> position at <strong>${company}</strong> and believe it aligns perfectly with my skills and experience.
      </p>

      <p>
        Given our shared background at ${university}, I was hoping you could share any insights or advice about the role and the team.
        I've attached my resume for your reference and would appreciate it if you could forward it to the hiring team.
      </p>

      <p>Thank you for your time and assistance.</p>

      <p>
        Best regards,<br/>
        ${YOUR_NAME}<br/>
        ${CONTACT_NUMBER}<br/>
        <a href="${LINKEDIN_URL}" target="_blank">LinkedIn</a> |
        <a href="${GITHUB_URL}" target="_blank">GitHub</a> |
        <a href="${PORTFOLIO_URL}" target="_blank">Portfolio</a>
      </p>
    </div>
  `;
}
