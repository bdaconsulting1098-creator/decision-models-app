const { PDFParse } = require('./node_modules/pdf-parse/dist/pdf-parse/cjs/index.cjs');
const path = require('path');

const pdfPath = path.join(process.env.USERPROFILE || '', 'Downloads', 'Consciousness Explained.pdf');
const pdfData = require('fs').readFileSync(pdfPath);

const parser = new PDFParse();
parser.parse(pdfData).then(data => {
  console.log('Total pages:', data.pages.length);
  const firstPage = data.pages[0];
  console.log('First page type:', typeof firstPage);
  console.log('First page keys (own):', Object.keys(firstPage).filter(k => !k.startsWith('_')));
  
  // Try extracting text via items
  if (firstPage.items) {
    console.log('\nItems count:', firstPage.items.length);
    if (firstPage.items.length > 0) {
      console.log('First item:', typeof firstPage.items[0]);
      console.log('First item keys:', Object.keys(firstPage.items[0]));
      console.log('First item str:', firstPage.items[0].str);
      // Print first few items
      for (let i = 0; i < Math.min(20, firstPage.items.length); i++) {
        const item = firstPage.items[i];
        if (item.str) console.log(`  [${i}] "${item.str}"`);
      }
    }
  }
  
  // Try page.getTextContent()
  if (firstPage.getTextContent) {
    console.log('\ngetTextContent is a function');
    firstPage.getTextContent().then(tc => {
      console.log('textContent items:', tc.items.length);
      if (tc.items.length > 0) {
        console.log('First textContent item:', tc.items[0]);
      }
    }).catch(e => console.log('getTextContent error:', e.message));
  }
}).catch(e => console.error('Error:', e.message));
