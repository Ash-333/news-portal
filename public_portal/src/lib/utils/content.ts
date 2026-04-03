export function processContent(html: string, apiUrl: string): string {
  if (!html) return '';
  return html.replace(/http:\/\/localhost:3000/g, apiUrl);
}
