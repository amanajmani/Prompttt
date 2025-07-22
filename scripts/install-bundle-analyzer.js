#!/usr/bin/env node

/**
 * Optional bundle analyzer installation script
 * Only installs @next/bundle-analyzer when needed for analysis
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for bundle analyzer...');

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Check if @next/bundle-analyzer is already installed
const hasAnalyzer =
  packageJson.devDependencies?.['@next/bundle-analyzer'] ||
  packageJson.dependencies?.['@next/bundle-analyzer'];

if (!hasAnalyzer) {
  console.log('📦 Installing @next/bundle-analyzer...');

  try {
    execSync('npm install --save-dev @next/bundle-analyzer@^15.0.0', {
      stdio: 'inherit',
    });
    console.log('✅ Bundle analyzer installed successfully!');
  } catch (error) {
    console.error('❌ Failed to install bundle analyzer:', error.message);
    console.log('💡 You can install it manually with:');
    console.log('   npm install --save-dev @next/bundle-analyzer');
    process.exit(1);
  }
} else {
  console.log('✅ Bundle analyzer already installed');
}

console.log('🚀 Ready to analyze bundle!');
