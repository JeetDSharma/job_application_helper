# 📧 Email Sender App

A full-stack email-sending tool built with **Next.js 15**, featuring dynamic HTML email templates, resume attachment, and Gmail SMTP integration using **Nodemailer**.

---

## ✨ Features

- 🔹 Built with **Next.js 15** (App Router)
- 🔹 Uses **Nodemailer** for email delivery
- 🔹 Dynamic email templates (Alumni-aware)
- 🔹 Attaches your resume PDF
- 🔹 Configurable via environment variables
- 🔹 Sends through **Gmail SMTP** with App Password

---

## 🖼️ UI Preview

> A simple form to collect:
> - Email address
> - Name
> - Company
> - Job Position
> - "Is Alum" checkbox  
> Sends a personalized email with resume attached.

---

## 📂 Project Structure

📁 app/
├── 📄 page.tsx # Frontend form
└── 📁 api/send-email/route.ts # API handler

📁 templates/
├── 📄 alumTemplate.ts # Email template for alumni
└── 📄 emailTemplate.ts # Default email template

📁 public/
└── 📄 resume.pdf # Resume to be attached

📁 lib/
└── 📄 constants.ts # Constants like university, filename

📄 .env.local # Environment variables

yaml
Copy
Edit

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/email-sender-app.git
cd email-sender-app
2. Install Dependencies
bash
Copy
Edit
npm install
3. Add .env.local
Create a .env.local file at the root:

env
Copy
Edit
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
UNIVERSITY_NAME=Your University Name
RESUME_NAME=Jeet_Sharma_Resume.pdf
🔐 You must use a Gmail App Password: Generate one here

4. Add Resume
Place your resume.pdf file inside the public/ folder.

5. Run the App
bash
Copy
Edit
npm run dev
Visit: http://localhost:3000

🛠 How It Works
The user fills out a form.

On submit, data is sent via a POST request to /api/send-email.

The server:

Builds a custom HTML email depending on the isAlum flag.

Attaches a PDF resume.

Sends the email using Gmail via Nodemailer.

🔧 Tech Stack
Next.js 15

Nodemailer

TypeScript

Tailwind CSS (optional)

HTML Email Templates

📈 Potential Enhancements
✅ Client-side form validation

✅ Email preview before sending

✅ Upload resume instead of static file

✅ Form submission state (loading, success, error)

✅ Save logs to a DB (e.g. Supabase or PostgreSQL)

👨‍💻 Author
Jeet Sharma
🌐 jeetsharma.dev
🔗 LinkedIn | GitHub

📝 License
MIT — free to use, improve, and adapt.

yaml
Copy
Edit

---

✅ You can copy-paste this directly into your `README.md`.  
Want badges (like Build Passing, License, or Made with Next.js) at the top? Just say the word.



