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
  tenureYears?: number;
  personalMention?: string;
};

export function buildEmailTemplate({
  name,
  jobPosition,
  company,
  tenureYears,
  personalMention,
}: EmailTemplateParams) {
  const mentionText = personalMention
    ? `I came across your profile while researching software roles at ${company}, and your experience stood out to me. ${personalMention}`
    : `I came across your profile while researching software roles at ${company}, and your experience stood out to me.`;

  const tenureText = tenureYears
    ? `Thank you for your time, and congratulations on completing ${tenureYears}+ years at ${company}.`
    : `Thank you for your time.`;

  return `
    <div>
      <p>Hi ${name},</p>

      <p>
        I’m pursuing my Master’s in Computer Science at University of Massachusetts Amherst. I was researching about ${company} and your profile caught my attention.
      </p>

      <p>
        Would you be open to a <strong>10–12 minute chat</strong>? I have <strong>three focused questions</strong> about what makes a strong engineer and your advice for early-career professionals.
      </p>

      <p>
        If it’s easier, here’s my <a href="https://calendly.com/jeetsharma2112/30min" target="_blank">Calendly link</a>, but I’d be happy to work around your schedule. Either way, I admire the work you’re doing at ${company}.
      </p>

      <p>${tenureText}</p>

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
