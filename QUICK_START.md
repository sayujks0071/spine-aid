# Quick Start Guide - Spine Aid

## Prerequisites Setup

Since Node.js and npm are not currently installed, follow these steps:

### Step 1: Install Homebrew (if not already installed)

Open Terminal and run:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Important:** After installation, if you're on an Apple Silicon Mac (M1/M2/M3), add Homebrew to your PATH:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Step 2: Install Node.js

```bash
brew install node
```

### Step 3: Verify Installation

```bash
node --version   # Should show v20.x.x or similar
npm --version    # Should show 10.x.x or similar
```

### Step 4: Install Project Dependencies

Navigate to the project directory and install:

```bash
cd "/Users/mac/CURSOR/Spine aid"
npm install
```

This will install all required packages (Next.js, React, Prisma, etc.)

### Step 5: Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A random secure string
- `NEXT_PUBLIC_APP_URL` - http://localhost:3000

### Step 6: Set Up Database

```bash
npx prisma migrate dev
npx prisma generate
```

### Step 7: Create Upload Directory

```bash
mkdir -p public/uploads/donations
```

### Step 8: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

---

## Alternative: Use the Setup Script

You can also run the automated setup script:

```bash
cd "/Users/mac/CURSOR/Spine aid"
./setup-node.sh
```

---

## Troubleshooting

### "Command not found" after installation
- **Solution:** Restart Terminal or run `source ~/.zshrc`

### Homebrew installation fails
- Make sure you have administrator access
- Check your internet connection
- See detailed instructions in `INSTALL_NODE.md`

### npm install fails
- Make sure Node.js version is 18 or higher: `node --version`
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

---

## Need Help?

See detailed installation instructions in:
- `INSTALL_NODE.md` - Complete Node.js installation guide
- `SETUP.md` - Application setup guide
- `README.md` - Project overview


