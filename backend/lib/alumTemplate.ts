type AlumTemplateParams = {
  name: string;
  position: string;
  company: string;
  university: string;
};

export function buildAlumTemplate({
  name,
  position,
  company,
  university,
}: AlumTemplateParams): string {
  return `
    <div style="font-family: sans-serif; line-height: 1.5;">
      <p>Hi ${name},</p>

      <p>I hope you're doing well.</p>

      <p>
        I noticed that we both attended <strong>${university}</strong>, and I always appreciate connecting with fellow alumni.
        I recently came across the <strong>${position}</strong> position at <strong>${company}</strong> and believe it aligns perfectly with my skills and experience.
      </p>

      <p>
        Given our shared background at ${university}, I was hoping you could share any insights or advice about the role and the team.
        I've attached my resume for your reference and would appreciate it if you could forward it to the hiring team.
      </p>

      <p>Thank you for your time and assistance.</p>

      <p>
        Best regards,<br/>
        JEET SHARMA<br/>
        +1 (413) 466-5844<br/>
        <a href="https://www.linkedin.com/in/jeetsharma" target="_blank">LinkedIn</a> |
        <a href="https://github.com/jeetsharma" target="_blank">GitHub</a> |
        <a href="https://jeetsharma.dev" target="_blank">Portfolio</a>
      </p>
    </div>
  `;
}
