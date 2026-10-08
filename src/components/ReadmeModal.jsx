import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, FileText, Download } from 'lucide-react';

export default function ReadmeModal({ repo, user, onClose }) {
  const [copied, setCopied] = useState(false);

  const repoName = repo ? repo.name : 'my-awesome-project';
  const repoDesc = repo && repo.description ? repo.description : 'A high-performance modern web application built for seamless developer productivity.';
  const language = repo && repo.language ? repo.language : 'TypeScript';
  const username = user ? user.login : 'your-username';

  const generatedReadme = `# ${repoName}

> ${repoDesc}

[![Live Demo](https://img.shields.io/badge/Demo-Live_Deployment-success?style=for-the-badge&logo=vercel)](${repo && repo.homepage ? repo.homepage : 'https://your-demo-url.com'})
[![GitHub license](https://img.shields.io/github/license/${username}/${repoName}?style=for-the-badge)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/${username}/${repoName}?style=for-the-badge)](https://github.com/${username}/${repoName}/stargazers)

---

## 🌟 Key Highlights

- **⚡ Fast & Modern**: Built with ${language} for high reliability and type safety.
- **🎨 Responsive Interface**: Tailored UX optimized for desktop, tablet, and mobile devices.
- **🚀 Production-Ready**: Designed with scalable architectures and zero-config deployment.

---

## 🛠 Tech Stack

- **Frontend**: React 19, ${language}, Tailwind CSS
- **Tools**: Vite, ESLint, Git, GitHub Actions
- **Deployment**: Vercel / Netlify

---

## 🚀 Quick Start

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/${username}/${repoName}.git
cd ${repoName}
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Start local development server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📐 Architecture & Design Decisions

Explain why you chose ${language} and how you structured the codebase:
- **Modular Services**: Separation of API networking from presentation logic.
- **Error Handling**: Graceful fallback UI for rate-limits, network timeouts, and 404s.

---

## 🤝 Author & Contact

Crafted with dedication by **${user && user.name ? user.name : username}**  
- GitHub: [@${username}](https://github.com/${username})
${user && user.blog ? `- Portfolio: [${user.blog}](${user.blog})` : ''}
${user && user.twitter_username ? `- Twitter / X: [@${user.twitter_username}](https://twitter.com/${user.twitter_username})` : ''}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReadme);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedReadme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `README-${repoName}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Gold-Standard README Generator
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Customized for {repoName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#21262d] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Code body */}
        <div className="p-5 overflow-y-auto flex-1 bg-[#0d1117] font-mono text-xs text-zinc-300">
          <pre className="whitespace-pre-wrap selection:bg-orange-500/30 selection:text-orange-200">
            {generatedReadme}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#30363d] bg-[#161b22] flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-mono">
            Drop this file in your root folder as <code className="text-orange-400">README.md</code>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
