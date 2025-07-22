#!/usr/bin/env node

/**
 * Bundle Analysis Script for MILESTONE-14
 *
 * This script analyzes the Next.js bundle to identify:
 * - Large dependencies that could be code-split
 * - Unused code that could be tree-shaken
 * - Opportunities for dynamic imports
 * - Performance optimization recommendations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Starting Bundle Analysis for AI VideoHub...\n');

// Step 1: Check if bundle analyzer is installed
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const hasAnalyzer =
  packageJson.devDependencies?.['@next/bundle-analyzer'] ||
  packageJson.dependencies?.['@next/bundle-analyzer'];

if (!hasAnalyzer) {
  console.log('📦 Bundle analyzer not installed. Installing...');
  try {
    execSync('node scripts/install-bundle-analyzer.js', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to install bundle analyzer');
    process.exit(1);
  }
}

// Step 2: Build the application with bundle analysis
console.log('📦 Building application with bundle analysis...');
try {
  execSync('npm run build', {
    stdio: 'inherit',
    env: { ...process.env, ANALYZE: 'true' },
  });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Analyze bundle composition
console.log('\n📊 Analyzing bundle composition...');

const buildDir = path.join(process.cwd(), '.next');
const staticDir = path.join(buildDir, 'static');

if (!fs.existsSync(staticDir)) {
  console.error(
    '❌ Build directory not found. Please run npm run build first.'
  );
  process.exit(1);
}

// Function to get file sizes
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

// Function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Analyze JavaScript bundles
function analyzeJSBundles() {
  const chunksDir = path.join(staticDir, 'chunks');
  if (!fs.existsSync(chunksDir)) return [];

  const chunks = fs
    .readdirSync(chunksDir)
    .filter((file) => file.endsWith('.js'))
    .map((file) => {
      const filePath = path.join(chunksDir, file);
      const size = getFileSize(filePath);
      return { file, size, formattedSize: formatBytes(size) };
    })
    .sort((a, b) => b.size - a.size);

  return chunks;
}

// Analyze CSS bundles
function analyzeCSSBundles() {
  const cssDir = path.join(staticDir, 'css');
  if (!fs.existsSync(cssDir)) return [];

  const cssFiles = fs
    .readdirSync(cssDir)
    .filter((file) => file.endsWith('.css'))
    .map((file) => {
      const filePath = path.join(cssDir, file);
      const size = getFileSize(filePath);
      return { file, size, formattedSize: formatBytes(size) };
    })
    .sort((a, b) => b.size - a.size);

  return cssFiles;
}

// Generate recommendations
function generateRecommendations(jsChunks, cssFiles) {
  const recommendations = [];

  // Check for large chunks
  const largeChunks = jsChunks.filter((chunk) => chunk.size > 100 * 1024); // > 100KB
  if (largeChunks.length > 0) {
    recommendations.push({
      type: 'Code Splitting',
      priority: 'High',
      description: `Found ${largeChunks.length} large JavaScript chunks. Consider dynamic imports for:`,
      items: largeChunks
        .slice(0, 3)
        .map((chunk) => `${chunk.file} (${chunk.formattedSize})`),
    });
  }

  // Check for large CSS files
  const largeCSSFiles = cssFiles.filter((file) => file.size > 50 * 1024); // > 50KB
  if (largeCSSFiles.length > 0) {
    recommendations.push({
      type: 'CSS Optimization',
      priority: 'Medium',
      description: 'Large CSS files detected. Consider:',
      items: [
        'CSS-in-JS for component-specific styles',
        'Critical CSS extraction',
        'Unused CSS removal',
      ],
    });
  }

  // Check total bundle size
  const totalJSSize = jsChunks.reduce((total, chunk) => total + chunk.size, 0);
  if (totalJSSize > 500 * 1024) {
    // > 500KB
    recommendations.push({
      type: 'Bundle Size',
      priority: 'High',
      description: `Total JavaScript bundle size is ${formatBytes(totalJSSize)}. Consider:`,
      items: [
        'Tree shaking unused dependencies',
        'Dynamic imports for non-critical features',
        'Bundle splitting by route',
      ],
    });
  }

  return recommendations;
}

// Main analysis
const jsChunks = analyzeJSBundles();
const cssFiles = analyzeCSSBundles();
const recommendations = generateRecommendations(jsChunks, cssFiles);

// Display results
console.log('\n📈 Bundle Analysis Results:');
console.log('='.repeat(50));

console.log('\n🟡 JavaScript Bundles:');
jsChunks.slice(0, 10).forEach((chunk, index) => {
  const indicator =
    chunk.size > 100 * 1024 ? '🔴' : chunk.size > 50 * 1024 ? '🟡' : '🟢';
  console.log(
    `${indicator} ${index + 1}. ${chunk.file} - ${chunk.formattedSize}`
  );
});

if (cssFiles.length > 0) {
  console.log('\n🎨 CSS Files:');
  cssFiles.forEach((file, index) => {
    const indicator =
      file.size > 50 * 1024 ? '🔴' : file.size > 25 * 1024 ? '🟡' : '🟢';
    console.log(
      `${indicator} ${index + 1}. ${file.file} - ${file.formattedSize}`
    );
  });
}

console.log('\n💡 Optimization Recommendations:');
console.log('='.repeat(50));

if (recommendations.length === 0) {
  console.log('🎉 Great! No major optimization opportunities found.');
} else {
  recommendations.forEach((rec, index) => {
    const priorityIcon =
      rec.priority === 'High' ? '🔴' : rec.priority === 'Medium' ? '🟡' : '🟢';
    console.log(
      `\n${priorityIcon} ${index + 1}. ${rec.type} (${rec.priority} Priority)`
    );
    console.log(`   ${rec.description}`);
    rec.items.forEach((item) => console.log(`   • ${item}`));
  });
}

console.log('\n✅ Bundle analysis complete!');
console.log('\n📚 Next Steps:');
console.log('1. Review large chunks for dynamic import opportunities');
console.log('2. Implement code splitting for non-critical features');
console.log('3. Consider lazy loading for below-the-fold components');
console.log('4. Monitor bundle size in CI/CD pipeline');

// Export results for CI/CD
const results = {
  timestamp: new Date().toISOString(),
  jsChunks: jsChunks.slice(0, 10),
  cssFiles,
  recommendations,
  totalJSSize: jsChunks.reduce((total, chunk) => total + chunk.size, 0),
  totalCSSSize: cssFiles.reduce((total, file) => total + file.size, 0),
};

fs.writeFileSync(
  path.join(process.cwd(), 'bundle-analysis.json'),
  JSON.stringify(results, null, 2)
);

console.log('\n📄 Detailed results saved to bundle-analysis.json');
