const fs = require('fs');
const path = require('path');
const dir = './frontend/src/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const p = path.join(dir, f);
  let c = fs.readFileSync(p, 'utf8');
  c = c.replace(/#e11d48/ig, '#d97706');
  c = c.replace(/#be123c/ig, '#b45309');
  c = c.replace(/#f43f5e/ig, '#f59e0b');
  c = c.replace(/rgba\(225,\s*29,\s*72,\s*0\.25\)/g, 'rgba(217, 119, 6, 0.25)');
  c = c.replace(/rgba\(225,\s*29,\s*72,\s*0\.2\)/g, 'rgba(217, 119, 6, 0.2)');
  fs.writeFileSync(p, c);
});
console.log('Replaced colors in components.');
