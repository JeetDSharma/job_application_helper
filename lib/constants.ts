export const UNIVERSITY_NAME = "University of Massachusetts - Amherst";
export const RESUME_NAME = "Jeet_Sharma_Resume.pdf";
export const LINKEDIN_URL = "https://www.linkedin.com/in/jeet-sharma/";
export const GITHUB_URL = "https://github.com/JeetDSharma";
export const PORTFOLIO_URL = "https://www.jeetsharma.com/";
export const CONTACT_NUMBER = "+1 (413) 466-5844";
export const YOUR_NAME = "JEET SHARMA";

// Response Types for Email Tracking
export const RESPONSE_TYPES = {
  // Positive
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  INTERESTED_MORE_INFO: "Interested - Requested More Info",
  FORWARDED_TO_TEAM: "Forwarded to Hiring Team",
  NETWORKING_CALL: "Networking Call Scheduled",
  REFERRAL_PROVIDED: "Referral Provided",

  // Neutral
  NO_CURRENT_OPENINGS: "No Current Openings",
  KEEP_IN_TOUCH: "Keep in Touch",
  APPLIED_THROUGH_PORTAL: "Applied Through Portal",

  // Negative
  NOT_INTERESTED: "Not Interested",
  POSITION_FILLED: "Position Already Filled",
  NO_RESPONSE: "No Response (30+ days)",

  // Special
  AUTO_REPLY: "Auto-Reply Only",
  OUT_OF_OFFICE: "Out of Office",
} as const;

export const RESPONSE_CATEGORIES = {
  POSITIVE: {
    label: "Positive Response",
    color: "green",
    icon: "✅",
    types: [
      RESPONSE_TYPES.INTERVIEW_SCHEDULED,
      RESPONSE_TYPES.INTERESTED_MORE_INFO,
      RESPONSE_TYPES.FORWARDED_TO_TEAM,
      RESPONSE_TYPES.NETWORKING_CALL,
      RESPONSE_TYPES.REFERRAL_PROVIDED,
    ],
  },
  NEUTRAL: {
    label: "Neutral Response",
    color: "yellow",
    icon: "➡️",
    types: [
      RESPONSE_TYPES.NO_CURRENT_OPENINGS,
      RESPONSE_TYPES.KEEP_IN_TOUCH,
      RESPONSE_TYPES.APPLIED_THROUGH_PORTAL,
    ],
  },
  NEGATIVE: {
    label: "Negative/No Response",
    color: "red",
    icon: "❌",
    types: [
      RESPONSE_TYPES.NOT_INTERESTED,
      RESPONSE_TYPES.POSITION_FILLED,
      RESPONSE_TYPES.NO_RESPONSE,
    ],
  },
  SPECIAL: {
    label: "Special",
    color: "gray",
    icon: "ℹ️",
    types: [RESPONSE_TYPES.AUTO_REPLY, RESPONSE_TYPES.OUT_OF_OFFICE],
  },
} as const;

// Application Stages for Pipeline View
export const APPLICATION_STAGES = {
  EMAIL_SENT: "Email Sent",
  FOLLOWED_UP: "Follow-up Sent",
  RESPONSE_RECEIVED: "Response Received",
  SCREENING_CALL: "Screening Call",
  TECHNICAL_INTERVIEW: "Technical Interview",
  ONSITE_INTERVIEW: "Onsite Interview",
  OFFER_RECEIVED: "Offer Received",
  OFFER_ACCEPTED: "Offer Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
  GHOSTED: "No Response (30+ days)",
} as const;
