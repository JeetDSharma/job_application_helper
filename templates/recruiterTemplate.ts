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
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #2c3e50; max-width: 600px;">
      <p style="margin: 0 0 16px 0; font-size: 15px;">Hi ${name},</p>

      <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.5;">
        I saw the <strong style="color: #2563eb;">${jobPosition}</strong> role at ${company}. I've spent the last 2+ years building and owning production backend and full-stack systems as a founding engineer. I'm graduating <strong>May 2026</strong> from UMass Amherst (MSCS, GPA 3.86) and can start immediately after.
      </p>

      <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 16px 20px; margin: 0 0 20px 0; border-radius: 4px;">
        <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #1e293b;">Selected relevant work:</p>
        
        <ul style="margin: 0; padding-left: 20px; list-style-type: disc;">
          <li style="margin: 0 0 8px 0; font-size: 14px; color: #334155; line-height: 1.5;">
            <strong style="color: #1e293b;">Ownership & architecture:</strong> Founding engineer — architected AI forensics platform, led core system design, shipped <strong style="color: #059669;">20+ production APIs</strong>
          </li>
          
          <li style="margin: 0 0 8px 0; font-size: 14px; color: #334155; line-height: 1.5;">
            <strong style="color: #1e293b;">Backend @ scale:</strong> Built multi-tenant AWS backend (PostgreSQL + PGVector, ECS autoscaling) → <strong style="color: #059669;">30% lower latency</strong>
          </li>
          
          <li style="margin: 0 0 8px 0; font-size: 14px; color: #334155; line-height: 1.5;">
            <strong style="color: #1e293b;">High-stakes data:</strong> Crypto forensics pipelines over 2B+ records supporting $20M+ cases → <strong style="color: #059669;">70% faster</strong> analysis
          </li>
          
          <li style="margin: 0; font-size: 14px; color: #334155; line-height: 1.5;">
            <strong style="color: #1e293b;">Stack match:</strong> Python, TypeScript, React/NextJS, PostgreSQL, MongoDB, Redis, Docker, AWS
          </li>
        </ul>
      </div>

      <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.5;">
        <strong style="color: #059669;">✓ US work authorized</strong> • <strong style="color: #059669;">✓ May 2026 start</strong><br/>
        Resume attached. Happy to chat if you think there's a fit. My calendar is pretty open this week.
      </p>

      <p style="margin: 0 0 20px 0; font-size: 15px; color: #1e293b;">
        Thanks for your time.
      </p>

      <div style="margin: 24px 0 0 0; padding-top: 16px; border-top: 2px solid #e2e8f0;">
        <p style="margin: 0; font-size: 15px; line-height: 1.6;">
          <strong style="font-size: 16px; color: #1e293b;">${YOUR_NAME}</strong><br/>
          <span style="color: #64748b; font-size: 14px;">${CONTACT_NUMBER}</span><br/>
          <a href="${LINKEDIN_URL}" target="_blank" style="color: #2563eb; text-decoration: none; font-size: 14px; margin-right: 12px;">LinkedIn</a>
          <a href="${GITHUB_URL}" target="_blank" style="color: #2563eb; text-decoration: none; font-size: 14px; margin-right: 12px;">GitHub</a>
          <a href="${PORTFOLIO_URL}" target="_blank" style="color: #2563eb; text-decoration: none; font-size: 14px;">Portfolio</a>
        </p>
      </div>
    </div>
  `;
}
