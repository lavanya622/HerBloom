# 🌸 HerBloom
### A little space to feel, reflect, care, and bloom.

HerBloom is a pastel-inspired emotional wellness web application designed to offer a welcoming space for self-reflection, journaling, self-care, relaxation, and playful experiences.

> **A little space to feel, heal, and bloom.** 🦋

---

## ✨ Features

- **I'm Your Buddy** — a supportive chat interface. The chat service requires its backend to be running and configured.
- **My Secret Diary** — a personal journaling space.
- **My Inner World** — reflection prompts where users can write and save personal reflections.
- **Bloom & Grow** — a space focused on encouragement and personal growth.
- **Happy Corner** — interactive games and story-based activities.
- **Mood & Self-Care** — activities such as breathing exercises and gratitude notes, with saved-note history.
- **Profile & Settings** — personalize the profile name and access app settings.
- **Magical Garden Theme** — a soft pastel design with fairy-inspired details, flowers, butterflies, and sparkling effects.

*Feature availability may depend on the project version and whether backend services are running.*

## 🛠️ Technologies Used

- **HTML5** – Structure of the application
- **CSS3** – Styling, layouts, animations, and magical visual effects
- **JavaScript (ES6+)** – Application logic and interactivity
- **React.js** – Building reusable UI components
- **Vite** – Fast development server and build tool
- **Browser Local Storage** – Saving notes, reflections, and user preferences
- **Python** – Backend support for the AI chat feature
- **Git & GitHub** – Version control and project hosting

## 🧰 Tech Stack

- React, JavaScript, Vite, CSS3
- Browser Local Storage for supported notes, reflections, and preferences
- Python backend, if included, for the Buddy chat endpoint

## 📁 Project Structure

A typical project layout may look like this. Your actual structure may differ.

```text
HerBloom/
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

## 🚀 Run HerBloom Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)
- Git (if cloning the repository)

### 1. Clone the repository

Replace the URL with your GitHub repository URL:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the project folder

```bash
cd HerBloom
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the app

Vite prints the local address in the terminal. It is usually:

```text
http://localhost:5173/
```

### 6. Optional: create and preview a production build

```bash
npm run build
npm run preview
```

## 🤖 Buddy Chat Backend & API Key Setup

The Buddy chat interface calls this backend endpoint:

```text
http://127.0.0.1:8000/chat
```

The API key is intentionally **not included** in this repository. Never put a real API key in `App.jsx`, other frontend files, or a public GitHub repository.

If your Python backend uses an external AI provider:

1. Keep the API key on the backend only.
2. Store it in a local `.env` file in the backend directory.
3. Read it from an environment variable in the backend code.
4. Add `.env` to `.gitignore`.
5. You may provide an `.env.example` containing variable names and placeholders only.
6. Start the backend using the command required by its framework and entry-point file.

Example `.env.example` (placeholder only):

```env
AI_API_KEY=your_api_key_here
```

The exact backend install and start commands depend on the backend files and framework in your repository. If the backend is not included or configured, the frontend can still be explored, but Buddy chat may not respond.

## 💾 Notes & Browser Storage

HerBloom uses browser Local Storage for supported saved notes, reflections, and preferences.

- Data is stored in the browser on the current device.
- It is not automatically synced to GitHub or another device.
- Clearing browser data may remove locally saved information.
- Local Storage is not a secure cloud backup or encrypted storage.
- Avoid entering highly sensitive information into a demo journaling feature.

## 🔐 Security & GitHub Publishing

Before pushing the project:

- Keep `.env` files, API keys, passwords, access tokens, and private credentials out of Git.
- Do not commit `node_modules/` or local virtual environments.
- Do not upload personal diary exports, private notes, or user data.
- Review staged files with `git status` and `git diff --cached` before committing.
- If a real key was ever committed or exposed, revoke it with its provider and create a replacement. Removing it from the latest file does not remove it from Git history.

Suggested `.gitignore` entries:

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
.venv/
venv/
__pycache__/
*.pyc
*.log
.DS_Store
Thumbs.db
```

## 🌱 Ideas for Future Improvements

These are possible future enhancements, not claims about features already implemented:

- Optional secure sign-in and cloud synchronization
- Export and import of personal reflections
- More mood check-ins and guided self-care activities
- Additional mini-games and interactive stories
- Accessibility improvements, including keyboard navigation and reduced-motion settings
- A privacy page explaining how user data is stored
- Automated tests and deployment documentation

## 🎯 Project Purpose

HerBloom is designed as a gentle digital companion for everyday emotional wellness. It combines journaling, reflection, self-care, and playful activities in one welcoming experience.

It is a personal wellness project, not a medical or mental-health diagnosis service.

## 👩‍💻 Project

**Name:** HerBloom  
**Type:** Emotional Wellness Web Application  
**Status:** Personal project / ongoing development

Made with care. Keep growing at your own pace. 🌷

