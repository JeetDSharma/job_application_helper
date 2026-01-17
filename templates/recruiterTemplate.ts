import {
  LINKEDIN_URL,
  GITHUB_URL,
  PORTFOLIO_URL,
  CONTACT_NUMBER,
  YOUR_NAME,
} from "@/lib/constants";

type RecruiterTemplateParams = {
  name: string;
  jobPosition: string;
  company: string;
};

export function buildRecruiterTemplate({
  name,
  jobPosition,
  company,
}: RecruiterTemplateParams): string {
  return `
    <div style="font-family: sans-serif; line-height: 1.5;">
      <p>Hi ${name},</p>

      <p>
        I'm currently pursuing my Master's in Computer Science at University of Massachusetts Amherst and actively seeking <strong>${jobPosition}</strong> opportunities.
      </p>

      <p>
        I noticed you're recruiting for ${company}, and I'm very interested in exploring roles that align with my background in software engineering. 
        I have 1+ year of experience building scalable applications and excel in full-stack development, data analysis, and system design.
      </p>

      <p>
        I've attached my resume for your review. I'd appreciate the opportunity to discuss how my skills could contribute to ${company}'s team. 
        I'm happy to provide any additional information or schedule a brief call at your convenience.
      </p>

      <p>Thank you for considering my application.</p>

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
