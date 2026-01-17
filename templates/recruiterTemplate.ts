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
        I saw you're hiring for <strong style="color: #2563eb;">${jobPosition}</strong> at ${company}. I'm graduating <strong>May 2026</strong> (UMass Amherst, CS, GPA 3.86) with <strong>2+ years production engineering</strong> experience.
      </p>

      <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 16px 20px; margin: 0 0 20px 0; border-radius: 4px;">
        <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #1e293b;">Key Experience:</p>
        
        <div style="margin: 0 0 10px 0;">
          <span style="display: inline-block; background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 3px; font-size: 12px; font-weight: 600; margin-right: 6px;">AWS RAG Systems</span>
          <span style="font-size: 14px; color: #334155;">Multi-tenant backend, PostgreSQL + PGVector, ECS autoscaling → <strong style="color: #059669;">30% faster</strong></span>
        </div>
        
        <div style="margin: 0 0 10px 0;">
          <span style="display: inline-block; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 3px; font-size: 12px; font-weight: 600; margin-right: 6px;">Founding Engineer</span>
          <span style="font-size: 14px; color: #334155;">AI forensics startup → architected platform, led team, built <strong>20+ APIs</strong>, enterprise NextJS UIs</span>
        </div>
        
        <div style="margin: 0 0 10px 0;">
          <span style="display: inline-block; background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 3px; font-size: 12px; font-weight: 600; margin-right: 6px;">High-Impact Work</span>
          <span style="font-size: 14px; color: #334155;">Crypto forensics → <strong style="color: #059669;">70% faster</strong> processing, 2B+ records, $20M+ cases</span>
        </div>
        
        <div style="margin: 0 0 10px 0;">
          <span style="display: inline-block; background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 3px; font-size: 12px; font-weight: 600; margin-right: 6px;">Tech Stack</span>
          <span style="font-size: 14px; color: #334155;">Python • TypeScript • NextJS • React • PostgreSQL • MongoDB • Redis • Docker • AWS • Azure</span>
        </div>

        <div style="margin: 0;">
          <span style="display: inline-block; background: #fce7f3; color: #831843; padding: 2px 8px; border-radius: 3px; font-size: 12px; font-weight: 600; margin-right: 6px;">Patent</span>
          <span style="font-size: 14px; color: #334155;">Granted patent on blockchain medical logistics</span>
        </div>
      </div>

      <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.5;">
        <strong style="color: #059669;">✓ US work authorized</strong> • <strong style="color: #059669;">✓ Available May 2026</strong><br/>
        Resume attached. Happy to discuss on a <strong>15-min call</strong> this week.
      </p>

      <p style="margin: 0 0 20px 0; font-size: 15px; font-weight: 600; color: #2563eb;">
        What's the best next step in your process?
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
