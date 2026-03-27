#!/bin/bash
# 🚀 Verify School Platform Installation

echo "═══════════════════════════════════════════════════════════"
echo "🏫 SCHOOL PLATFORM - Installation Verification"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check Node.js
echo "📌 Checking Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js not found"
    exit 1
fi

# Check npm
echo "📌 Checking npm..."
if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm not found"
    exit 1
fi

# Check backend
echo ""
echo "📌 Checking Backend..."
if [ -f "backend/package.json" ]; then
    echo "✅ Backend project found"
    cd backend
    if [ -d "node_modules" ]; then
        echo "✅ Dependencies installed"
    else
        echo "⚠️  Dependencies not installed: npm install"
    fi
    if [ -f ".env" ]; then
        echo "✅ .env found"
    else
        echo "ℹ️  .env not found (using defaults)"
    fi
    cd ..
else
    echo "❌ Backend project not found"
fi

# Check frontend
echo ""
echo "📌 Checking Frontend..."
if [ -f "frontend/package.json" ]; then
    echo "✅ Frontend project found"
    cd frontend
    if [ -d "node_modules" ]; then
        echo "✅ Dependencies installed"
    else
        echo "⚠️  Dependencies not installed: npm install"
    fi
    cd ..
else
    echo "❌ Frontend project not found"
fi

# Check documentation
echo ""
echo "📌 Checking Documentation..."
if [ -f "README.md" ]; then echo "✅ README.md"; fi
if [ -f "OPTIMIZATIONS_REPORT.md" ]; then echo "✅ OPTIMIZATIONS_REPORT.md"; fi
if [ -f "DEVELOPERS_GUIDE.md" ]; then echo "✅ DEVELOPERS_GUIDE.md"; fi
if [ -f "COMPLETION_SUMMARY.md" ]; then echo "✅ COMPLETION_SUMMARY.md"; fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ Installation verification complete!"
echo ""
echo "Next steps:"
echo "  1. cd backend && npm run seed"
echo "  2. npm run dev"
echo "  3. cd ../frontend && npm run dev"
echo ""
echo "Open: http://localhost:5173"
echo "═══════════════════════════════════════════════════════════"
