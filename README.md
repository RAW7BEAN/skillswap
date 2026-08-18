# 🤝 SkillSwap — Peer-to-Peer Knowledge Exchange Network

[![License: MIT](https://img.shields.io/badge/License-MIT-indigo.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20GitHub%20Pages-blue.svg)](https://pages.github.com/)
[![Built With](https://img.shields.io/badge/Stack-HTML5%20%7C%20Vanilla%20CSS3%20%7C%20Modern%20JS-success.svg)](#-tech-stack)
[![Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen.svg)](#)

> **"A human-powered learning network where your knowledge becomes your currency."**  
> *Trade Skills. Not Cash.*

SkillSwap is an interactive peer-to-peer skill exchange web application. It connects learners who want to exchange complementary skills (e.g. C Programming for UI/UX Design), featuring a real-time **Compatibility Matching Engine (0%–100%)**, multi-party **3-Way Skill Chains**, simulated **real-time peer messaging & session scheduling**, and a verifiable **Skill Passport**.

---

## 🌟 Live Demo Preview

```text
                  SKILLSWAP KNOWLEDGE NETWORK
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
     [ 1:1 Direct Match ]   [ 3-Way Loops ]    [ Skill Passport ]
            │                  │                  │
    Teaches: C ↔ UI/UX    You → Alex → Milan    ⭐ 4.9 Rating
    Score: 100% MATCH     100% Chain Loop       🪙 5 Credits Balance
```

---

## ✨ Key Features

### 1. ⚡ Real-Time Compatibility Matching Engine
- **+40%** if the peer teaches what you want to learn.
- **+40%** if the peer wants what you can teach.
- **+10%** for matching learning format (`Online` / `In Person` / `Both`).
- **+10%** for geographic proximity (e.g. Kathmandu, Lalitpur, Pokhara).

### 2. 🔗 Unique Innovation: 3-Way "Skill Chains"
When no direct 1-on-1 reciprocal match exists (e.g. *You teach Photoshop and want Python, but no Python peer wants Photoshop*), SkillSwap automatically calculates a **3-party circular knowledge loop** so everyone gets what they need:
$$\text{You (Photoshop} \to \text{Python)} \longrightarrow \text{Alex (Python} \to \text{Figma)} \longrightarrow \text{Milan (Figma} \to \text{Photoshop)}$$

### 3. 💬 Interactive Peer Chat & Session Scheduler
- Simulated instant peer responses within 1.2 seconds.
- 1-click quick action icebreakers.
- Built-in session booking modal (Google Meet, Zoom, In-person).

### 4. 🎓 Verifiable "Skill Passport" & Knowledge Economy
- **Skill Credits**: Earn `+1 Credit` for teaching, spend credits to learn.
- **Mastery Levels**: Visual skill gauges (Beginner, Intermediate, Advanced, Expert).
- **Reputation Badges**: 🏅 *Helpful Teacher*, 🔥 *7-Day Streak*, 🌱 *Fast Learner*, 🛡️ *Verified Swapper*.

---

## 📁 Repository Structure

```text
skillswap/
├── index.html        # Landing page with interactive live match calculator & stats
├── signup.html       # 4-step interactive onboarding profile wizard
├── discover.html     # Match discovery engine (1:1 matches & 3-way skill chains)
├── matches.html      # Peer matches & interactive chat room with session scheduler
├── sessions.html     # Learning sessions hub (upcoming, completed & review ratings)
├── profile.html      # Verifiable Skill Passport & Skill Credits wallet ledger
├── style.css         # Complete responsive design system & typography tokens
├── script.js         # Core application logic, matching engine, & localStorage sync
├── users.js          # Community users database (Nepal & Global peers)
├── favicon.svg       # Brand icon vector
├── manifest.json     # PWA Web App manifest
├── 404.html          # Custom 404 error fallback for GitHub Pages
├── robots.txt        # Search engine indexing rules
├── sitemap.xml       # SEO sitemap
├── LICENSE           # Open-source MIT License
└── README.md         # Documentation and deployment guide
```

---

## 💻 Tech Stack

- **Structure**: Semantic HTML5 (SEO optimized with OpenGraph and Twitter cards)
- **Styling**: Vanilla CSS3 with custom design tokens, flexbox/grid, and micro-interactions
- **Logic**: Pure Modern JavaScript (ES6+) with reactive `localStorage` state management
- **Zero Build Steps**: Runs instantly in any modern browser with 0 external npm dependencies!

---

## 🚀 How to Publish to GitHub & Launch Live on GitHub Pages

You can publish this project to GitHub and have it live online for free in **3 simple steps**:

### Step 1: Initialize Git and Commit Locally

Open your terminal (PowerShell, Command Prompt, or VS Code Terminal) in the `skillswap` directory:

```bash
cd C:\Users\USER\.gemini\antigravity\scratch\skillswap

# Initialize git repository
git init

# Add all project files
git add .

# Create initial commit
git commit -m "Initial commit: Complete SkillSwap peer learning web application"
```

### Step 2: Create a Repository on GitHub and Push

1. Go to [GitHub](https://github.com/new) and create a **New Repository**.
2. Name your repository (e.g. `skillswap`).
3. Set visibility to **Public**.
4. Leave *"Initialize this repository with a README"* **unchecked** (we already have a complete one).
5. Copy your repository URL and run:

```bash
# Rename branch to main
git branch -M main

# Add your GitHub repository as remote (replace with your actual GitHub username)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/skillswap.git

# Push your code
git push -u origin main
```

### Step 3: Enable Free GitHub Pages Hosting (1 Click)

1. On your GitHub repository page, go to **Settings** (top tab).
2. On the left sidebar, click **Pages** (under the "Code and automation" section).
3. Under **Build and deployment > Source**, select **Deploy from a branch**.
4. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
5. Within 60 seconds, GitHub will give you your live URL:
   $$\text{https://YOUR\_GITHUB\_USERNAME.github.io/skillswap/}$$

---

## 🧪 Testing the Application Locally

Simply double-click [`index.html`](index.html) or run with any local development server:

```bash
# Option A: Python 3
python -m http.server 8000

# Option B: Node.js npx serve
npx serve .

# Option C: VS Code Live Server extension
# Right-click index.html -> "Open with Live Server"
```

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details. Feel free to use, modify, and distribute for personal, academic, or commercial projects!

---

**Made with ❤️ for students, creators, and lifelong learners.**
