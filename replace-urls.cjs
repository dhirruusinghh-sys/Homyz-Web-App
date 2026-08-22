const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Fix the previously broken single quotes:
  // From: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/agent/overview'
  // To: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/agent/overview`
  content = content.replace(/`\$\{import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:5000'\}\/([^']*)'/g, "`\$\{import.meta.env.VITE_API_URL || 'http://localhost:5000'}/$1`");

  // Fix remaining backtick URLs:
  // From: `http://localhost:5000/api/...
  // To: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/...
  content = content.replace(/`http:\/\/localhost:5000\//g, "`\$\{import.meta.env.VITE_API_URL || 'http://localhost:5000'}/");

  // Fix single quotes that I might have missed (if any):
  content = content.replace(/'http:\/\/localhost:5000\//g, "`\$\{import.meta.env.VITE_API_URL || 'http://localhost:5000'}/");

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  }
}

walk(path.join(__dirname, 'src'));
