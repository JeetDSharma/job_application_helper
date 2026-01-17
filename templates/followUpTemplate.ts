import {
  LINKEDIN_URL,
  GITHUB_URL,
  PORTFOLIO_URL,
  CONTACT_NUMBER,
  YOUR_NAME,
} from "@/lib/constants";

type FollowUpTemplateParams = {
  name: string;
  company: string;
  jobPosition: string;
  isRecruiter: boolean;
};

export function buildFollowUpTemplate({
  name,
  company,
  jobPosition,
  isRecruiter,
}: FollowUpTemplateParams): string {
  if (isRecruiter) {
    // Recruiter follow-up: Short, direct, value reminder
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Hi ${name},</p>
        
        <p>Following up on my previous email about the <strong>${jobPosition}</strong> role.</p>
        
        <p><strong>Quick recap:</strong></p>
        <ul>
          <li>2+ years as founding engineer building production systems</li>
          <li>MS in Computer Science from UMass Amherst (May 2026)</li>
          <li>Backend, full-stack, distributed systems experience</li>
        </ul>
        
        <p>Available for a 15-minute call this week if you see a fit. Resume attached again for reference.</p>
        
        <p>Best,<br>
        ${YOUR_NAME}<br>
        <a href="${LINKEDIN_URL}">LinkedIn</a> | <a href="${GITHUB_URL}">GitHub</a> | <a href="${PORTFOLIO_URL}">Portfolio</a><br>
        ${CONTACT_NUMBER}</p>
      </div>
    `;
  } else {
    // Engineer/General follow-up: Polite, specific value-add
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Hi ${name},</p>
        
        <p>Wanted to follow up on my previous message about connecting regarding your experience at ${company}.</p>
        
        <p>I know you're busy, so I'll be specific: I'm trying to understand what differentiates strong candidates in technical roles at ${company}. Even a 10-minute conversation would be incredibly valuable as I prepare my application.</p>
        
        <p><strong>Context on me:</strong></p>
        <ul>
          <li>MS Computer Science, UMass Amherst (graduating May 2026)</li>
          <li>2+ years as founding engineer at a startup</li>
          <li>Built and owned production backend systems from scratch</li>
        </ul>
        
        <p>Would any time this week or next work for a brief call?</p>
        
        <p>Thanks for considering,<br>
        ${YOUR_NAME}<br>
        <a href="${LINKEDIN_URL}">LinkedIn</a> | <a href="${GITHUB_URL}">GitHub</a> | <a href="${PORTFOLIO_URL}">Portfolio</a><br>
        ${CONTACT_NUMBER}</p>
      </div>
    `;
  }
}
