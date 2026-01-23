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
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  const capitalizedCompany = company.charAt(0).toUpperCase() + company.slice(1);

  if (isRecruiter) {
    return `Hi ${capitalizedName},

Just following up on the note I sent last week in case it got buried.

I'd love to do a brief 15-minute coffee chat to hear your perspective on the ${jobPosition} role and how the team is thinking about challenges at ${capitalizedCompany} this year.

No pressure at all if the timing isn't right, I'd be glad to stay in touch.

Thanks,
${YOUR_NAME}`;
  } else {
    return `Hi ${capitalizedName},

Just following up on the note I sent last week in case it got buried.

I'd love to do a brief 15-minute coffee chat to hear your perspective on the ${jobPosition} role and how the team is thinking about challenges at ${capitalizedCompany} this year.

No pressure at all if the timing isn't right, I'd be glad to stay in touch.

Thanks,
${YOUR_NAME}`;
  }
}
