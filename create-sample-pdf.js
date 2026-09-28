import PDFDocument from 'pdfkit';
import fs from 'fs';

const doc = new PDFDocument({
  pdfVersion: '1.4',
  compress: false,
  margin: 50,
  info: {
    Title: 'Sample Project Brief',
    Author: 'Generic User'
  }
});

const writeStream = fs.createWriteStream('sample-generic-document.pdf');
doc.pipe(writeStream);

doc.fontSize(18).text('Sample Project Brief', { align: 'center' });
doc.moveDown(1);

doc.fontSize(12)
  .text('Project Name: Internal Knowledge Portal')
  .text('Owner: Product Team')
  .text('Created On: 28/09/2026')
  .text('Status: Draft');

doc.moveDown(1);

doc.fontSize(14).text('Summary');
doc.fontSize(11)
  .text('This document is used to test general PDF text extraction.')
  .text('The goal is to upload a PDF and read its complete plain text without any special tender logic.')
  .text('Any command, keyword, or requirement can be applied later to the extracted text.');

doc.moveDown(1);

doc.fontSize(13).text('Key Notes:');
doc.fontSize(10)
  .text('1. Keep pages simple and readable.')
  .text('2. Use clear headings and short sections.')
  .text('3. Make sure content is searchable and easy to copy.')
  .text('4. Contact: team@example.com');

doc.moveDown(1);
doc.fontSize(9).text('--- End of Sample Document ---', { align: 'center' });

doc.end();

writeStream.on('finish', () => {
  console.log('✅ sample-generic-document.pdf created successfully with compress: false!');
});
