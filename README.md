# 🔥 GitHub Roast & Rescue
> **"Give a messy GitHub profile the honest feedback it deserves."**  
> An autonomous developer profiling & rescue audit tool that delivers honest, data-driven roasts and prioritized recruiter-readiness action plans.

[![Live Cloud Application](https://img.shields.io/badge/Live_App-Public_Cloud_Deployment-orange?style=for-the-badge&logo=vercel)](https://github-roast-and-rescue.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Public_Repository-black?style=for-the-badge&logo=github)](https://github.com/ratheeshr01/github-roast-and-rescue)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🎯 The Problem

Student and junior developer GitHub profiles are often empty, cluttered with test repositories (`test-1`, `final-app`), or missing essential documentation. Everyone hears the advice *"build a portfolio"*, but nobody explains what a recruiter or hiring manager actually looks for in the first **30 seconds**. 

Most peer feedback is either too polite to be helpful or overly harsh without offering actionable guidance.

---

## 💡 The Solution: GitHub Roast & Rescue

**GitHub Roast & Rescue** bridges that gap with humor and actionable engineering advice:
1. **Reads REAL Public GitHub Data**: Profiles, repositories, languages, stars, commit recency, and README availability.
2. **The 30-Second Recruiter Test**: Algorithmic evaluation of the 9 signals hiring managers scan first.
3. **🔥 Data-Driven Roasts**: Witty, memorable observations roasting the *profile*, never the person.
4. **🚑 Immediate Rescues**: Every roast is paired with concrete steps to fix the problem.
5. **📈 Algorithmic Profile Score**: 0–100 score weighted across 7 distinct recruiter categories.
6. **Prioritized Action Plan**: Time-estimated roadmap (⚡ 5m, ⚡ 15m, 🛠 30–60m, 🔥 2–4h) with interactive checkboxes.
7. **🔄 Before vs. After Guidance**: Visual blueprint comparing ignored repositories with high-converting showcase projects.
8. **Gold-Standard README Generator**: 1-click Markdown template generation for top projects.

---

## 📈 100-Point Scoring System

Our scoring algorithm evaluates 7 core dimensions of public GitHub signals:

| Category | Weight | What It Evaluates |
| :--- | :---: | :--- |
| **Profile Completeness** | 15% | Full name, avatar, bio quality, location, and dedicated Profile README (`username/username`). |
| **Project Presentation** | 25% | Percentage of repos with descriptions, clean naming hygiene, live demo links, and topic tags. |
| **Activity & Consistency** | 15% | Pushed code in last 30/90 days, account age, and active repository count. |
| **README Quality** | 15% | Presence and structure of README documentation across flagship repositories. |
| **Technical Diversity** | 10% | Breadth of programming languages and frameworks visible across projects. |
| **Project Depth & Signals** | 10% | Original projects vs. fork ratio, star engagement, and codebase substance. |
| **Recruiter Readiness** | 10% | Portfolio/website link, discoverability of top 2–3 flagship projects, and hygiene. |

> **Disclaimer:** This score measures publicly visible GitHub presentation signals. Stars, follower counts, or activity alone do not define engineering problem-solving ability.

---

## 👔 The 30-Second Recruiter Test

Simulates an initial screening by a technical recruiter across 9 checkpoints:
- **Identity & Professional Clarity**: Is the developer's identity verifiable?
- **Value-Proposition Bio**: Does the bio state the developer's role and target stack?
- **Flagship Project Findability**: Are standout projects pinned and easy to locate?
- **Repository Naming**: Professional naming conventions vs. ambiguous homework folders.
- **At-a-Glance Descriptions**: Can a screener understand the project in 5 seconds?
- **README & Documentation**: Is setup and architecture documented?
- **Interactive Live Demos**: Can screeners click and test live apps without cloning?
- **Recent Meaningful Activity**: Active within the last 30–60 days?
- **Technical Skills Visibility**: Clearly visible languages and tags?

---

## 🛠 Tech Stack

- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4 (GitHub Dark Developer Aesthetic)
- **Icons**: Lucide Icons
- **Animation & Confetti**: Canvas-Confetti, CSS Keyframe Animations
- **API Networking**: GitHub Public REST API (`https://api.github.com`)
- **Hosting**: Free Cloud Hosting (Vercel / Netlify)

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended; built & verified on v24.18.0)
- npm (v9 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ratheeshr01/github-roast-and-rescue.git
   cd github-roast-and-rescue
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Run production build**:
   ```bash
   npm run build
   ```

5. **Run automated test suite**:
   ```bash
   node test-audit.mjs
   ```

---

## 🧪 Testing with Real Usernames

You can test real public profiles or bundled snapshots:
- `gaearon` — Dan Abramov (High-profile reference with live demos & documentation)
- `torvalds` — Linus Torvalds (Linux & Git creator)
- `alex-student` — Built-in test profile showcasing common student profile pitfalls (messy naming, missing READMEs)
- Any public GitHub username of your choice!

---

## 🔒 Security & Privacy

- **Zero Passwords or Secrets Required**: Operates strictly on public GitHub data.
- **Optional Personal Access Token**: Can be entered directly in browser Settings for higher rate limits (5,000 req/hr). Stored purely in local browser `localStorage` and never transmitted to third parties.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
