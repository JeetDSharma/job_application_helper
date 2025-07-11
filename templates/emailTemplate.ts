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
        JEET SHARMA<br/>
        +1 (413) 466-5844<br/>
        <a href="https://www.linkedin.com/in/jeet-sharma/" target="_blank">LinkedIn</a> |
        <a href="https://www.jeetsharma.com/" target="_blank">GitHub</a> |
        <a href="https://www.jeetsharma.com/" target="_blank">Portfolio</a>
      </p>
    </div>
  `;
}
