const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const src = 'url-exporter.js';
const temp = 'url-exporter-image.js';

try {
    // original build
    execSync(`npx bookmarklet "${src}" url-bookmarklet`, { stdio: 'inherit' });

    // create modified copy with image = true
    const content = fs.readFileSync(src, 'utf8');
    const replaced = content.replace(/const\s+image\s*=\s*(?:true|false)\s*;/, 'const image = true;');

    if (replaced === content) {
        console.warn('Warning: no "const image = ..." pattern found — file unchanged.');
    }

    fs.writeFileSync(temp, replaced, 'utf8');

    // build modified copy
    execSync(`npx bookmarklet "${temp}" url-bookmarklet-image`, { stdio: 'inherit' });

    // cleanup
    fs.unlinkSync(temp);
} catch (err) {
    console.error(err);
    process.exit(1);
}