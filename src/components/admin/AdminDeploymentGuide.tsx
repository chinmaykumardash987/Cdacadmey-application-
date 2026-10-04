import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Terminal, Database, ShieldCheck, Github, Globe, Smartphone, Copy, Check, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';

export const AdminDeploymentGuide: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live Firebase Config Input Form
  const existingConfig = StorageService.getFirebaseConfig() || {};
  const [apiKey, setApiKey] = useState(existingConfig.apiKey || '');
  const [authDomain, setAuthDomain] = useState(existingConfig.authDomain || '');
  const [projectId, setProjectId] = useState(existingConfig.projectId || '');
  const [storageBucket, setStorageBucket] = useState(existingConfig.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(existingConfig.messagingSenderId || '');
  const [appId, setAppId] = useState(existingConfig.appId || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveFirebaseConfig({
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim()
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all notes, lectures, DPPs, and sample students back to pristine default data?')) {
      StorageService.resetToDefaultData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-2 bg-red-50 text-red-600 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            CD ACADEMY Master Deployment & Setup Guide
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          Step-by-step verified instructions to run locally, connect Firebase, deploy to GitHub & Netlify, link custom domains, and convert into an Android APK / Google Play App.
        </p>
      </div>

      {/* 1. RUNNING THE PROJECT LOCALLY */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              1
            </span>
            <h2 className="font-bold text-base text-slate-900">Running the Project Locally</h2>
          </div>
          <Terminal className="w-4 h-4 text-slate-400" />
        </div>

        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          Clone the repository to your computer and launch the lightning-fast Vite development server:
        </p>

        <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-200 space-y-2 relative">
          <button
            onClick={() => handleCopy('local', 'git clone <YOUR_REPO_URL>\ncd cd-academy\nnpm install\nnpm run dev')}
            className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] flex items-center gap-1"
          >
            {copiedKey === 'local' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'local' ? 'Copied' : 'Copy'}</span>
          </button>
          <div className="text-slate-400"># 1. Install dependencies</div>
          <div>npm install</div>
          <div className="text-slate-400 mt-2"># 2. Start development server</div>
          <div>npm run dev</div>
          <div className="text-slate-400 mt-2"># Open http://localhost:3000 in your browser</div>
        </div>
      </div>

      {/* 2. CONNECTING FIREBASE */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
              2
            </span>
            <h2 className="font-bold text-base text-slate-900">Connecting Firebase (Auth, Firestore, Storage)</h2>
          </div>
          <Database className="w-4 h-4 text-red-500" />
        </div>

        <ol className="list-decimal list-inside text-xs text-slate-600 space-y-2 leading-relaxed mb-4">
          <li>
            Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-red-600 underline font-semibold">Firebase Console</a> and click <strong>Add Project</strong> ("cd-academy").
          </li>
          <li>
            In project overview, click the <strong>Web (&lt;/&gt;)</strong> icon to register a web app and copy your <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">firebaseConfig</code> object.
          </li>
          <li>
            Enable <strong>Authentication</strong> → Sign-in method → Enable <strong>Email/Password</strong> and <strong>Google</strong>.
          </li>
          <li>
            Enable <strong>Cloud Firestore</strong> (Production mode or Test mode). The project already includes <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">firestore.rules</code> and <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">firebase-blueprint.json</code>!
          </li>
          <li>
            Enable <strong>Firebase Storage</strong> for saving uploaded PDF notes and thumbnail files.
          </li>
        </ol>

        {/* Live Firebase Connector */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">
            Connect Your Firebase Keys Now:
          </h3>
          <form onSubmit={handleSaveFirebaseConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">apiKey</label>
              <input
                type="text"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">authDomain</label>
              <input
                type="text"
                value={authDomain}
                onChange={e => setAuthDomain(e.target.value)}
                placeholder="cd-academy.firebaseapp.com"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">projectId</label>
              <input
                type="text"
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                placeholder="cd-academy-app"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">storageBucket</label>
              <input
                type="text"
                value={storageBucket}
                onChange={e => setStorageBucket(e.target.value)}
                placeholder="cd-academy.appspot.com"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono text-xs"
              />
            </div>
            <div className="sm:col-span-2 flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                {saveSuccess ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Firebase credentials saved in active session!
                  </span>
                ) : (
                  'Configuration persists automatically in browser storage.'
                )}
              </span>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-xs"
              >
                Save Firebase Config
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. CREATING FIRST ADMIN ACCOUNT */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              3
            </span>
            <h2 className="font-bold text-base text-slate-900">Creating Your First Admin Account</h2>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
        </div>

        <p className="text-xs text-slate-600 mb-2 leading-relaxed">
          The app contains a bootstrapped administrator user for instant access:
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 space-y-1">
          <div>• <strong>Admin Email:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-red-600">admin@cdacademy.com</code> (or your verified email <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-red-600">chinmaykumardash987@gmail.com</code>)</div>
          <div>• <strong>Default Password:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-slate-900">admin123</code></div>
          <div className="text-slate-500 text-[11px] pt-1">
            In Firestore, any user with document inside <code className="font-mono bg-white px-1 rounded">/admins/&#123;uid&#125;</code> or matching admin email is recognized by <code className="font-mono bg-white px-1 rounded">firestore.rules</code> as a super administrator.
          </div>
        </div>
      </div>

      {/* 4. DEPLOYING TO GITHUB */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              4
            </span>
            <h2 className="font-bold text-base text-slate-900">Deploying to GitHub</h2>
          </div>
          <Github className="w-4 h-4 text-slate-700" />
        </div>

        <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-200 space-y-2 relative">
          <button
            onClick={() => handleCopy('github', 'git init\ngit add .\ngit commit -m "feat: initial release CD ACADEMY educational platform"\ngit branch -M main\ngit remote add origin https://github.com/<YOUR_USERNAME>/cd-academy.git\ngit push -u origin main')}
            className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] flex items-center gap-1"
          >
            {copiedKey === 'github' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'github' ? 'Copied' : 'Copy'}</span>
          </button>
          <div>git init</div>
          <div>git add .</div>
          <div>git commit -m "feat: CD ACADEMY platform release"</div>
          <div>git branch -M main</div>
          <div>git remote add origin https://github.com/&lt;USERNAME&gt;/cd-academy.git</div>
          <div>git push -u origin main</div>
        </div>
      </div>

      {/* 5 & 6. NETLIFY & CUSTOM DOMAIN */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              5 & 6
            </span>
            <h2 className="font-bold text-base text-slate-900">Deploying to Netlify & Custom Domain</h2>
          </div>
          <Globe className="w-4 h-4 text-blue-500" />
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            <strong>Step 1 (Netlify Import):</strong> Log in to <a href="https://app.netlify.com" target="_blank" rel="noreferrer" className="text-red-600 underline font-semibold">Netlify</a>, click <em>"Add new site" → "Import an existing project"</em>, and select your GitHub repository.
          </p>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 font-mono text-[11px]">
            <div>• Build command: <span className="font-bold text-slate-900">npm run build</span></div>
            <div>• Publish directory: <span className="font-bold text-slate-900">dist</span></div>
          </div>
          <p>
            <strong>Step 2 (Custom Domain Configuration):</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
            <li>In Netlify, go to <strong>Site configuration → Domain management → Add a custom domain</strong> (e.g. <code className="font-mono font-bold">cdacademy.in</code> or <code className="font-mono font-bold">www.cdacademy.com</code>).</li>
            <li>In your domain registrar (GoDaddy, Namecheap, Cloudflare, Hostinger), add a <strong>CNAME record</strong> pointing <code className="font-mono">www</code> to <code className="font-mono">&lt;your-site-name&gt;.netlify.app</code> or an <strong>A record</strong> pointing <code className="font-mono">@</code> to Netlify IP <code className="font-mono">75.2.60.5</code>.</li>
            <li>Netlify will automatically provision a free, auto-renewing Let's Encrypt SSL/TLS Certificate!</li>
          </ul>
        </div>
      </div>

      {/* 7. CONVERTING PWA INTO ANDROID APP */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              7
            </span>
            <h2 className="font-bold text-base text-slate-900">Converting PWA to Android App (Google Play Store)</h2>
          </div>
          <Smartphone className="w-4 h-4 text-emerald-600" />
        </div>

        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          The app is already pre-configured with a Web App Manifest (<code className="font-mono">/manifest.json</code>), responsive Android viewports, and high-res vector icons. You can turn it into an Android APK / AAB using <strong>Bubblewrap (Google's official CLI)</strong> or <strong>PWABuilder</strong> in 3 minutes:
        </p>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5">
            <span className="font-bold text-emerald-900 block">Method A: Using PWABuilder (Easiest, No Code Needed)</span>
            <p className="text-emerald-800">
              1. Open <a href="https://www.pwabuilder.com" target="_blank" rel="noreferrer" className="underline font-bold">pwabuilder.com</a> and enter your CD ACADEMY website URL.<br />
              2. Click <strong>"Package for Stores"</strong> → Choose <strong>Android</strong>.<br />
              3. Download the signed Google Play bundle (<code className="font-mono">.aab</code>) and upload directly to Google Play Console!
            </p>
          </div>

          <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl space-y-2 font-mono text-[11px] relative">
            <div className="text-slate-400 font-sans font-bold">Method B: Using Google's Bubblewrap CLI</div>
            <div>npm install -g @bubblewrap/cli</div>
            <div>bubblewrap init --manifest https://&lt;YOUR_DOMAIN&gt;/manifest.json</div>
            <div>bubblewrap build</div>
            <div className="text-slate-400"># Generates cd-academy-release-signed.aab ready for Google Play!</div>
          </div>
        </div>
      </div>

      {/* Reset Sample Data Button */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-800 block">Reset Practice Data</span>
          <span className="text-[11px] text-slate-500">
            Re-populate all sample notes, lectures, DPPs, and sample student accounts to initial state.
          </span>
        </div>
        <button
          onClick={handleResetData}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-xl transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </div>
  );
};
