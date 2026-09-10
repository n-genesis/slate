import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { compile } from 'sass';
import pkg from '../package.json' with { type: 'json' };
const { version, name, homepage, author, license } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const destinationDir = path.resolve('./dist/css'); // Your desired output directory

// Ensure the destination directory exists
if (!existsSync(destinationDir)) {
    mkdirSync(destinationDir, { recursive: true });
}


function renderSCSS() {
    // Stylesheet path and destination path for compiled CSS file
    const stylesPath = path.join(__dirname, '../src/scss', 'styles.scss');
    const destPath = path.resolve('./dist/css/slate.css');
    
    try {
        const result = compile(stylesPath, {
            style: 'expanded' // or 'compressed', 'compact', 'nested'
        });
        writeFileSync(destPath, bannerComment + result.css.toString());
        console.log(`N-Gen Press CSS successfully compiled and saved to: ${destPath}`);
    } catch (error2) {
        console.error('Error compiling Simple Editor SASS:', error2);
    }

};

const bannerComment = `/*!
 * @project   ${name}
 * @version   ${version}
 * @author    ${author} (${homepage})
 * @license   ${license}
 *
 */\n`;

 renderSCSS();