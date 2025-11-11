#!/bin/bash

# Verification script for Node.js and npm installation

echo "🔍 Verifying Node.js and npm Installation"
echo "=========================================="
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js is installed: $NODE_VERSION"
else
    echo "❌ Node.js is NOT installed"
    echo "   Run: brew install node"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm is installed: $NPM_VERSION"
else
    echo "❌ npm is NOT installed"
    echo "   npm comes with Node.js, so install Node.js first"
fi

# Check Homebrew
if command -v brew &> /dev/null; then
    BREW_VERSION=$(brew --version | head -1)
    echo "✅ Homebrew is installed: $BREW_VERSION"
else
    echo "❌ Homebrew is NOT installed"
    echo "   Run: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
fi

echo ""
echo "=========================================="

# If both are installed, check if we're in the project directory
if command -v node &> /dev/null && command -v npm &> /dev/null; then
    echo ""
    echo "✅ Ready to install project dependencies!"
    echo ""
    echo "Next steps:"
    echo "  1. cd \"/Users/mac/CURSOR/Spine aid\""
    echo "  2. npm install"
    echo "  3. npm run dev"
else
    echo ""
    echo "⚠️  Please install Node.js and npm first"
    echo ""
    echo "Installation steps:"
    echo "  1. Install Homebrew (if not installed):"
    echo "     /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo ""
    echo "  2. Add Homebrew to PATH (if on Apple Silicon):"
    echo "     echo 'eval \"\$(/opt/homebrew/bin/brew shellenv)\"' >> ~/.zprofile"
    echo "     eval \"\$(/opt/homebrew/bin/brew shellenv)\""
    echo ""
    echo "  3. Install Node.js:"
    echo "     brew install node"
    echo ""
    echo "  4. Restart Terminal or run: source ~/.zprofile"
    echo ""
    echo "  5. Run this script again to verify"
fi

