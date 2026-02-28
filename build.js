const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const wikiSRC = 'wiki-exporter.js';
const weaponSRC = 'weapon-exporter.js';
const urlSRC = 'url-exporter.js';
const tempImage = 'url-exporter-image.js';

try {
    // original build
    execSync(`npx bookmarklet "${wikiSRC}" wiki-bookmarklet`, { stdio: 'inherit' });
    execSync(`npx bookmarklet "${weaponSRC}" weapon-bookmarklet`, { stdio: 'inherit' });
    execSync(`npx bookmarklet "${urlSRC}" url-bookmarklet`, { stdio: 'inherit' });

    // create modified copy with image = true
    const content = fs.readFileSync(urlSRC, 'utf8');
    const replaced = content.replace(/const\s+image\s*=\s*(?:true|false)\s*;/, 'const image = true;');

    if (replaced === content) {
        console.warn('Warning: no "const image = ..." pattern found — file unchanged.');
    }

    fs.writeFileSync(tempImage, replaced, 'utf8');

    // build modified copy
    execSync(`npx bookmarklet "${tempImage}" url-bookmarklet-image`, { stdio: 'inherit' });

    // cleanup
    fs.unlinkSync(tempImage);
} catch (err) {
    console.error(err);
    process.exit(1);
}