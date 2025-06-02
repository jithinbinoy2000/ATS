//public\electron\controllers\scanController.js
const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const mammoth = require('mammoth');
const { BrowserWindow } = require('electron');

async function extractPdfData(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let fullText = '';
  let links = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    // Extract text content with structure
    const textContent = await page.getTextContent();

    // Collect all text items (includes bullets and formatted text)
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';

    // Extract links (annotations)
    const annotations = await page.getAnnotations();
    annotations.forEach(annotation => {
      if (annotation.subtype === 'Link' && annotation.url) {
        links.push({ page: pageNum, url: annotation.url });
      }
    });
  }

  return { text: fullText, links };
}

async function extractDocxData(filePath) {
  // Mammoth converts DOCX to HTML-like structure with links and bullets
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.convertToHtml({ buffer });
  // You can send raw HTML or strip tags as needed
  return { html: result.value };
}

async function handleScanFiles(event, files) {
  const win = BrowserWindow.getAllWindows()[0];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let extracted = {};
    let error = null;

    try {
      if (file.ext === '.pdf') {
        extracted = await extractPdfData(file.path);
      } else if (file.ext === '.docx') {
        extracted = await extractDocxData(file.path);
      } else {
        extracted = { text: '[Unsupported format]', links: [] };
      }
    } catch (err) {
      error = err.message || 'Failed to parse';
    }

    win.webContents.send('scan-progress', {
      index: i + 1,
      total: files.length,
      name: file.name,
      status: error ? ' Failed' : ' Processed',
    });

    win.webContents.send('scan-data', {
      name: file.name,
      path: file.path,
      ...extracted,
      error,
    });
  }

  return { success: true };
}

module.exports = { handleScanFiles };
