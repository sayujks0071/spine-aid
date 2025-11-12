# Installation Steps - Run These in Your Terminal

Since the automated installation requires interactive access, please follow these steps **in your own Terminal window**:

## Step 1: Install Homebrew

Open **Terminal** (Applications > Utilities > Terminal) and run:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

- You'll be prompted for your password (for sudo access)
- Follow the on-screen instructions
- The installation may take a few minutes

## Step 2: Add Homebrew to PATH (Apple Silicon Macs)

If you're on an Apple Silicon Mac (M1/M2/M3), run:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

For Intel Macs, Homebrew is usually at `/usr/local/bin/brew` and should already be in PATH.

## Step 3: Install Node.js

```bash
brew install node
```

This installs both Node.js and npm. The installation may take a few minutes.

## Step 4: Restart Terminal or Reload Profile

**Important:** Close and reopen Terminal, or run:

```bash
source ~/.zprofile
```

## Step 5: Verify Installation

Run this in Terminal:

```bash
node --version   # Should show v20.x.x or similar
npm --version    # Should show 10.x.x or similar
```

Or run the verification script:

```bash
cd "/Users/mac/CURSOR/Spine aid"
./verify-installation.sh
```

## Step 6: Install Project Dependencies

Once Node.js is installed, run:

```bash
cd "/Users/mac/CURSOR/Spine aid"
npm install
```

This will install all required packages (Next.js, React, Prisma, etc.)

## Step 7: Start Development Server

```bash
npm run dev
```

Then open http://localhost:3000 in your browser!

---

## Troubleshooting

### "Command not found" after installation
- **Solution:** Restart Terminal completely (quit and reopen)
- Or run: `source ~/.zprofile` or `source ~/.zshrc`

### Homebrew installation asks for password
- This is normal - enter your Mac user password
- You need administrator access

### Installation seems stuck
- Homebrew installation can take 5-10 minutes
- Be patient and let it complete

### Still can't find node/npm after installation
1. Verify Homebrew is in PATH: `echo $PATH | grep brew`
2. Check if installed: `ls /opt/homebrew/bin/node` (Apple Silicon) or `ls /usr/local/bin/node` (Intel)
3. Restart Terminal completely

---

## Alternative: Direct Node.js Download

If Homebrew doesn't work for you:

1. Visit https://nodejs.org/
2. Download the **LTS version** for macOS
3. Run the installer (.pkg file)
4. Restart Terminal
5. Verify: `node --version` and `npm --version`
6. Then proceed with `npm install` in the project directory


