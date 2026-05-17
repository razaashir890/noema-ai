# 🧠 Noema AI — The Mind Behind All Minds

> Multi-AI Aggregation Platform that combines responses from multiple AI models into one superior answer.

---

## 🚀 Quick Setup (Step by Step)

### Step 1: Create Supabase Database (FREE)

1. Go to [supabase.com](https://supabase.com) → Sign up (free)
2. Click **"New Project"** → Give it a name: `noema-ai` → Set a password → Choose closest region → Create
3. Wait ~2 minutes for setup
4. Go to **SQL Editor** (left sidebar) → Click **"New Query"**
5. Copy the ENTIRE content of `supabase-schema.sql` file → Paste it → Click **"Run"**
6. ✅ Database tables created!
7. Go to **Settings** → **API** → Copy:
   - `Project URL` (e.g., `https://xxxx.supabase.co`)
   - `anon public` key (long string)
8. Keep these — you'll need them in Step 3

### Step 2: Get Free AI API Keys

**Groq (FREE - Required):**
1. Go to [console.groq.com](https://console.groq.com) → Sign up
2. Go to **API Keys** → Click **"Create API Key"** → Copy it

**Google Gemini (FREE - Required):**
1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey) → Sign in with Google
2. Click **"Create API Key"** → Copy it

### Step 3: Push to GitHub

1. Go to [github.com](https://github.com) → Create a new repository named `noema-ai`
2. Open terminal in the project folder:

```bash
# Initialize git
git init
git add .
git commit -m "🧠 Noema AI - Initial commit"

# Push to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/noema-ai.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy to Vercel (FREE)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"Add New Project"** → Import your `noema-ai` repo
3. **Configure Environment Variables** (click "Environment Variables"):
   | Key | Value |
   |-----|-------|
   | `VITE_SUPABASE_URL` | Your Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `GROQ_API_KEY` | Your Groq API key |
   | `GEMINI_API_KEY` | Your Gemini API key |

4. Click **"Deploy"** → Wait ~1 minute
5. ✅ Your app is live! Vercel will give you a URL like `noema-ai.vercel.app`

### Step 5: (Optional) Custom Domain

1. In Vercel → Your Project → **Settings** → **Domains**
2. Add your custom domain → Follow DNS instructions
3. SSL is automatic

---

## 🏗️ Architecture

```
User → App.jsx (React UI)
         ↓ fetch
    /api/chat (Vercel Serverless)
         ↓ parallel calls
    Groq API ← AI #1
    Gemini API ← AI #2
    Mixtral API ← AI #3
         ↓ all responses
    Synthesis Engine (combines answers)
         ↓
    Supabase (saves messages)
         ↓
    Back to User
```

## 📁 Project Structure

```
noema-ai/
├── src/
│   ├── App.jsx          ← ALL UI CODE (future updates go here!)
│   ├── main.jsx         ← React entry point
│   └── index.css        ← Styles & animations
├── api/
│   ├── chat.js          ← AI orchestration & synthesis
│   └── conversations/
│       ├── index.js     ← List & create conversations
│       └── [id].js      ← Get, delete, update conversation
├── public/
│   ├── manifest.json    ← PWA config
│   └── favicon.svg      ← App icon
├── supabase-schema.sql  ← Database setup script
├── package.json
├── vite.config.js
├── tailwind.config.js
├── vercel.json
├── .env.example
└── README.md
```

## 🔧 Future Updates

**All future UI updates go in `src/App.jsx` only!**

To add new features:
1. Edit `src/App.jsx`
2. `git add . && git commit -m "feature: description"`
3. `git push` → Vercel auto-deploys

## 💰 Cost

| Service | Cost | Free Tier |
|---------|------|-----------|
| Vercel | $0/mo | 100GB bandwidth, serverless functions |
| Supabase | $0/mo | 500MB DB, 50K auth users |
| Groq API | $0/mo | 14,400 requests/day |
| Gemini API | $0/mo | 1,500 requests/day |
| **Total** | **$0/mo** | **Fully free to start!** |

## 📄 License

MIT
