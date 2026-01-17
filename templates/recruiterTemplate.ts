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
        I saw you're hiring for <strong>${jobPosition}</strong> at ${company}. I'm a Master's in CS student at UMass Amherst (GPA 3.86, graduating May 2026) with 2+ years of production software engineering experience as a founding engineer and full-stack developer.
      </p>

      <p><strong>Quick highlights:</strong></p>
      <ul>
        <li><strong>Built multi-tenant RAG systems</strong> on AWS with semantic retrieval (PostgreSQL + PGVector), deployed on ECS with autoscaling—reduced latency 30%</li>
        <li><strong>Founding engineer</strong> at an AI-driven forensics startup—architected the platform, led an engineering team, built 20+ REST APIs and enterprise UIs in NextJS</li>
        <li><strong>Reduced processing time by 70%</strong> on crypto forensics solution handling 2B+ transaction records for high-profile $20M+ cases</li>
        <li><strong>Tech stack:</strong> Python, TypeScript/JavaScript, NextJS, React, PostgreSQL, MongoDB, Redis, Docker, AWS, Azure, CI/CD</li>
        <li><strong>Published patent</strong> (granted) on blockchain-based medical logistics systems</li>
      </ul>

      <p>
        I'm authorized to work in the US and available to start immediately after May graduation. Resume attached—happy to jump on a 15-min call to discuss how I can contribute to ${company}.
      </p>

      <p>
        What's the best next step in your process?
      </p>

      <p>
        Best,<br/>
        ${YOUR_NAME}<br/>
        ${CONTACT_NUMBER} | <a href="${LINKEDIN_URL}" target="_blank">LinkedIn</a> | <a href="${PORTFOLIO_URL}" target="_blank">Portfolio</a>
      </p>
    </div>
  `;
}
