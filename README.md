# AI Assistant — Web

A full-stack AI chatbot web app with dual-provider AI chat (Google Gemini & Groq), real authentication, and a custom-built dark UI design system.

**Live demo:** [ai-assistant-web-omega.vercel.app](https://ai-assistant-web-omega.vercel.app)

This is the website version of an AI Assistant originally built as a Flutter mobile app. The backend (Node.js/Express + MongoDB) is shared between both the mobile app and this website — only the frontend was rebuilt from scratch for the web, with a completely custom visual identity.

---

## Features

- **Multi-provider AI chat** — switch between Google Gemini and Groq (Llama/GPT-OSS) per message
- **Full authentication** — email/password, Google Sign-In (OAuth 2.0), and real email-based password reset
- **Persistent chat history** — multiple saved conversations per user, with rename and delete
- **Markdown & code rendering** — AI responses render real formatting, headings, lists, and syntax-styled code blocks
- **Custom design system** — dark tonal theme, a signature animated "orb" motif, targeted glassmorphism, and a cursor-reactive spotlight effect
- **Production-grade UX details** — optimistic message sending, animated typing indicator, and honest loading states for cold-start delays on the free-tier backend

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- Framer Motion (animation)
- Zustand (state management)
- React Router

**Backend** *(shared with the mobile app, hosted separately)*
- Node.js + Express
- MongoDB Atlas
- JWT-based authentication
- Google OAuth 2.0 (`google-auth-library`)
- Brevo (transactional email API — used in place of direct SMTP, which is blocked on Render's free tier)
- Google Gemini API & Groq API

**Deployment**
- Frontend: Vercel
- Backend: Render

## Notable technical challenge

Password reset emails initially failed in production despite working locally and using a correct Gmail App Password. The root cause: **Render's free tier blocks outbound SMTP traffic on ports 25, 465, and 587** as an anti-spam measure — a platform-level restriction, not a code issue. The fix was migrating email sending from direct SMTP (`nodemailer` + Gmail) to an HTTP-based transactional email API (Brevo), which isn't affected by the port restriction.

## Getting Started

```bash
git clone https://github.com/prathameshpatil2/ai-assistant-web.git
cd ai-assistant-web
npm install
```

Create a `.env` file in the project root:

```
VITE_API_URL=your_backend_url
VITE_GOOGLE_CLIENT_ID=your_google_web_client_id
```

Run the dev server:

```bash
npm run dev
```

## Author

Built by [Prathamesh Patil](https://github.com/prathameshpatil2)
