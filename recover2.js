const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.map') || file.endsWith('.json')) results.push(file);
  });
  return results;
}

const allMaps = walk('.next');

for (const mapPath of allMaps) {
  try {
    const data = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    if (!data.sources) continue;
    
    for (let i = 0; i < data.sources.length; i++) {
      if (data.sources[i].includes('PortfolioClient')) {
        const code = data.sourcesContent ? data.sourcesContent[i] : null;
        if (code && code.includes('var t = thr === undefined ? 0.1 : thr;')) {
           fs.writeFileSync('src/app/PortfolioClient.tsx', code, 'utf8');
           console.log('SUCCESS! Recovered the true monolithic code from ' + mapPath);
           process.exit(0);
        }
      }
    }
  } catch (e) {}
}
console.log('Finished searching maps. Found nothing monolithic.');
