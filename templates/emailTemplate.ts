import { LINKEDIN_URL, GITHUB_URL, PORTFOLIO_URL, CONTACT_NUMBER, YOUR_NAME } from "@/lib/constants";


type EmailTemplateParams = {
  name: string;
  job_position: string;
  company: string;
};


export function buildEmailTemplate({ name, job_position, company }: EmailTemplateParams) {
  return `
    <div>
      <p>Hi ${name},</p>

      <p>I hope you're doing well.</p>

      <p>
        I came across the <strong>${job_position}</strong> position at <strong>${company}</strong> and believe it aligns perfectly with my skills and experience.
        I'm highly interested in applying for this role.
      </p>

      <p>
        Could you share any insights or advice about the role and the team?
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
