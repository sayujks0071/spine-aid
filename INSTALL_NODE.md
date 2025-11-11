# Installing Node.js and npm on macOS

This guide will help you install Node.js and npm on your Mac so you can run the Spine Aid application.

## Option 1: Install via Homebrew (Recommended)

Homebrew is the easiest package manager for macOS. Follow these steps:

### Step 1: Install Homebrew

Open Terminal and run:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

This will install Homebrew. Follow the on-screen instructions. You may be prompted for your password.

**Note:** After installation, you may need to add Homebrew to your PATH. The installer will show you commands like:
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Step 2: Install Node.js

Once Homebrew is installed, run:

```bash
brew install node
```

This installs both Node.js and npm.

### Step 3: Verify Installation

```bash
node --version
npm --version
```

You should see version numbers (e.g., v20.x.x for Node.js and 10.x.x for npm).

---

## Option 2: Direct Download from Node.js Website

If you prefer not to use Homebrew:

1. Visit https://nodejs.org/
2. Download the LTS (Long Term Support) version for macOS
3. Run the installer package (.pkg file)
4. Follow the installation wizard
5. Restart Terminal after installation

### Verify Installation

```bash
node --version
npm --version
```

---

## Option 3: Using nvm (Node Version Manager)

nvm allows you to install and manage multiple Node.js versions:

### Step 1: Install nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### Step 2: Reload your shell configuration

```bash
source ~/.zshrc
# or if using bash:
# source ~/.bash_profile
```

### Step 3: Install Node.js LTS

```bash
nvm install --lts
nvm use --lts
```

### Step 4: Verify Installation

```bash
node --version
npm --version
```

---

## After Installation: Set Up Spine Aid

Once Node.js and npm are installed, return to the project directory and run:

```bash
cd "/Users/mac/CURSOR/Spine aid"
npm install
```

Then follow the setup instructions in SETUP.md.

---

## Troubleshooting

### If commands still don't work after installation:

1. **Restart Terminal** - This ensures PATH variables are updated
2. **Check your shell** - Make sure you're using the same shell where you installed
3. **Verify PATH** - Run `echo $PATH` and ensure Node.js paths are included

### Common Issues:

- **"Command not found"** - Restart Terminal or run `source ~/.zshrc`
- **Permission errors** - Use `sudo` only if absolutely necessary (not recommended)
- **Version conflicts** - If you have multiple Node.js installations, use nvm to manage them

---

## Quick Check Commands

After installation, verify everything works:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check npm configuration
npm config list
```

Once these commands work, you're ready to proceed with `npm install` in the project directory!

