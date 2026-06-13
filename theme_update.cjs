const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/hashe/Desktop/Twitter Frontend/src/Pages';
const componentsDir = 'C:/Users/hashe/Desktop/Twitter Frontend/src/Components';
let files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => path.join(dir, f));

try {
  let comps = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx')).map(f => path.join(componentsDir, f));
  files = files.concat(comps);
} catch(e) {}

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Text colors
  content = content.replace(/text-black/g, 'text-white_TEMP');
  content = content.replace(/text-white/g, 'text-black');
  content = content.replace(/text-white_TEMP/g, 'text-white');
  
  // Background colors
  content = content.replace(/bg-\[#FAFAFA\]/g, 'bg-black');
  
  // Specific button replacements before general white
  content = content.replace(/bg-black/g, 'bg-white_TEMP');
  content = content.replace(/bg-white/g, 'bg-[#151515]');
  content = content.replace(/bg-white_TEMP/g, 'bg-white');

  // Borders
  content = content.replace(/border-gray-200\/60/g, 'border-zinc-800/60');
  content = content.replace(/border-gray-200/g, 'border-zinc-800');
  content = content.replace(/border-gray-100/g, 'border-zinc-800');
  content = content.replace(/border-t-black/g, 'border-t-white');

  // Grays text
  content = content.replace(/text-gray-900/g, 'text-gray-100');
  content = content.replace(/text-gray-800/g, 'text-gray-200');
  content = content.replace(/text-gray-600/g, 'text-gray-400');
  content = content.replace(/text-gray-500/g, 'text-gray-400');
  content = content.replace(/text-gray-400/g, 'text-gray-500'); // This might undo previous, but it's ok

  // Grays bg
  content = content.replace(/bg-gray-50/g, 'bg-zinc-800');
  content = content.replace(/bg-gray-200/g, 'bg-zinc-700');
  
  // Hovers
  content = content.replace(/hover:bg-gray-900/g, 'hover:bg-gray-200');
  content = content.replace(/hover:bg-gray-800/g, 'hover:bg-gray-200');
  content = content.replace(/hover:bg-gray-50/g, 'hover:bg-[#202020]');
  content = content.replace(/hover:text-black/g, 'hover:text-white');

  // Any remaining text-black in the main div wrapper
  // e.g., <div className="... text-black"> -> <div className="... text-white">
  // handled by text-black replace above.

  fs.writeFileSync(file, content);
});

console.log('Theme updated');
