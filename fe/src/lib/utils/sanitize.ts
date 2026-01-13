// import DOMPurify from 'dompurify';

// const BLOG_CONTENT_CONFIG = {
//   ALLOWED_TAGS: [
//     'h1',
//     'h2',
//     'h3',
//     'h4',
//     'h5',
//     'h6',
//     'p',
//     'br',
//     'strong',
//     'em',
//     'u',
//     's',
//     'sub',
//     'sup',
//     'ul',
//     'ol',
//     'li',
//     'blockquote',
//     'pre',
//     'code',
//     'a',
//     'img',
//     'figure',
//     'figcaption',
//     'table',
//     'thead',
//     'tbody',
//     'tr',
//     'th',
//     'td',
//     'div',
//     'span',
//   ],
//   ALLOWED_ATTR: [
//     'href',
//     'target',
//     'rel',
//     'src',
//     'alt',
//     'title',
//     'width',
//     'height',
//     'class',
//     'id',
//     'style',
//   ],
//   ALLOWED_URI_REGEXP:
//     /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
//   ADD_ATTR: ['target'],
//   FORBID_TAGS: [
//     'script',
//     'style',
//     'iframe',
//     'object',
//     'embed',
//     'form',
//     'input',
//     'button',
//   ],
//   FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover'],
// };

// export function sanitizeHtml(html: string): string {
//   if (typeof window === 'undefined') {
//     return html;
//   }

//   try {
//     return DOMPurify.sanitize(html, BLOG_CONTENT_CONFIG);
//   } catch (error) {
//     console.error('Error sanitizing HTML:', error);
//     return html.replace(/<[^>]*>/g, '');
//   }
// }

// export function createSafeHtml(html: string): { __html: string } {
//   return { __html: sanitizeHtml(html) };
// }
