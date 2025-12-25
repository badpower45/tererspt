export const printElement = (element: HTMLElement, title: string = 'Document') => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  // Gather all style sheets
  const styleSheets = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(style => style.outerHTML)
    .join('');

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>${title}</title>
      <meta charset="utf-8" />
      ${styleSheets}
      <style>
        body { margin: 0; padding: 0; background: white; }
        @media print {
          body { -webkit-print-color-adjust: exact; }
          @page { margin: 0; }
        }
      </style>
    </head>
    <body>
      ${element.outerHTML}
      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
            window.onafterprint = () => {
              window.frameElement.remove();
            };
          }, 500);
        };
      </script>
    </body>
    </html>
  `);
  doc.close();
};
