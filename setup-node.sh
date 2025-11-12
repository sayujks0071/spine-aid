#!/bin/bash

# Spine Aid - Node.js Setup Script
# This script will help you install Node.js and npm on macOS

set -e

echo "🚀 Spine Aid - Node.js Setup"
echo "============================"
echo ""

# Check if Node.js is already installed
if command -v node &> /dev/null; then
    echo "✅ Node.js is already installed!"
    node --version
    npm --version
    echo ""
    echo "You can now run: npm install"
    exit 0
fi

echo "Node.js is not installed. Let's set it up!"
echo ""

# Check for Homebrew
if command -v brew &> /dev/null; then
    echo "✅ Homebrew is installed!"
    echo "Installing Node.js via Homebrew..."
    brew install node
    echo ""
    echo "✅ Node.js installed successfully!"
    node --version
    npm --version
else
    echo "❌ Homebrew is not installed."
    echo ""
    echo "Please choose an installation method:"
    echo ""
    echo "Option 1: Install Homebrew first (Recommended)"
    echo "  Run this command:"
    echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo ""
    echo "  Then add Homebrew to your PATH (if on Apple Silicon Mac):"
    echo "  echo 'eval \"\$(/opt/homebrew/bin/brew shellenv)\"' >> ~/.zprofile"
    echo "  eval \"\$(/opt/homebrew/bin/brew shellenv)\""
    echo ""
    echo "  Then run: brew install node"
    echo ""
    echo "Option 2: Download Node.js directly"
    echo "  1. Visit: https://nodejs.org/"
    echo "  2. Download the LTS version for macOS"
    echo "  3. Run the installer"
    echo "  4. Restart Terminal"
    echo ""
    echo "Option 3: Use nvm (Node Version Manager)"
    echo "  Run: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "  Then: source ~/.zshrc && nvm install --lts"
    echo ""
    exit 1
fi

echo ""
echo "✅ Setup complete! You can now run:"
echo "   cd \"/Users/mac/CURSOR/Spine aid\""
echo "   npm install"
echo "   npm run dev"


