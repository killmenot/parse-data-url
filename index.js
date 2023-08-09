'use strict';

const validDataUrl = require('valid-data-url');

module.exports = (s) => {
  if (!validDataUrl(s)) {
    return false;
  }

  const parts = s.trim().match(validDataUrl.regex);
  const parsed = {};

  const mediaType = parts[1] || 'text/plain;charset=us-ascii';
  parsed.mediaType = mediaType.toLowerCase();

  const mediaTypeParts = mediaType.split(';').map(x => x.toLowerCase());
  parsed.contentType = mediaTypeParts[0];

  mediaTypeParts.slice(1).forEach((attribute) => {
    const p = attribute.split('=');
    parsed[p[0]] = p[1];
  });

  parsed.base64 = !!parts[parts.length - 2];
  parsed.data = parts[parts.length - 1] || '';

  parsed.toBuffer = () => {
    const encoding = parsed.base64 ? 'base64' : 'utf8';

    return Buffer.from(parsed.base64 ? parsed.data : decodeURIComponent(parsed.data), encoding);
  };

  return parsed;
};
