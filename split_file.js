const fs = require('fs');
const path = require('path');

const src1 = "C:\\Users\\yashw\\.gemini\\antigravity-ide\\brain\\f5df2e57-f934-46b8-bff5-85c714c57549\\.system_generated\\steps\\532\\content.md";
const src2 = "C:\\Users\\yashw\\.gemini\antigravity-ide\\brain\\f5df2e57-f934-46b8-bff5-85c714c57549\\.system_generated\\steps\\698\\content.md";

function formatHTML(srcPath, destName) {
  try {
    if (!fs.existsSync(srcPath)) {
      console.log(`Source not found: ${srcPath}`);
      return;
    }
    const raw = fs.readFileSync(srcPath, 'utf8');
    const formatted = raw.replace(/>\s*</g, '>\n<');
    const destPath = path.join(__dirname, destName);
    fs.writeFileSync(destPath, formatted, 'utf8');
    console.log(`Formatted and saved to: ${destPath}`);
  } catch (err) {
    console.error(err);
  }
}

formatHTML(src1, 'baas_formatted.html');
formatHTML(src2, 'dynamic_formatted.html');
