const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'prisma', 'seed.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Fix 1: Remove all // nameEn: comments
content = content.replace(/\/\/ nameEn:.*\n/g, '');

// Fix 2: Fix create objects that are missing slug or have wrong format
// Pattern: create: { name: "..." } should be create: { name: "...", slug: "..." }
const createPattern = /create:\s*\{\s*name:\s*"([^"]+)"\s*,?\s*\n?\s*\}/g;
content = content.replace(createPattern, (match, name) => {
  // Try to find the slug from the where clause above
  const lines = match.split('\n');
  const slugLine = lines.find(l => l.includes('slug:'));
  if (slugLine) {
    const slugMatch = slugLine.match(/slug:\s*"([^"]+)"/);
    if (slugMatch) {
      return `create: { name: "${name}", slug: "${slugMatch[1]}" }`;
    }
  }
  return match;
});

// Fix 3: Add missing closing braces for upsert calls
const upsertPattern = /(prisma\.\w+\.upsert\(\{[^}]+\})\s*\n?\s*(const|await|//)/g;
content = content.replace(upsertPattern, (match, obj, next) => {
  if (!obj.endsWith('}')) {
    return match.replace(next, '});\n  ' + next);
  }
  return match;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed seed.ts');
