/*global define */

(function (root, factory) {
  // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignore-a-umd-wrapper
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
    define(['valid-data-url'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(
      require('valid-data-url')
    );
  } else {
    root.parseDataUrl = factory(
      root.validDataUrl
    );
  }
}(this, function (validDataUrl) {
  if (typeof validDataUrl === 'undefined') {
    throw new Error('valid-data-url is not defined');
  }

  return function (s) {
    if (!validDataUrl(s)) {
      return false;
    }

    const parts = s.trim().match(validDataUrl.regex);
    const parsed = {};

    if (parts[1]) {
      parsed.mediaType = parts[1].toLowerCase();

      const mediaTypeParts = parts[1].split(';').map(x => x.toLowerCase());

      parsed.contentType = mediaTypeParts[0];

      mediaTypeParts.slice(1).forEach((attribute) => {
        const p = attribute.split('=');
        parsed[p[0]] = p[1];
      });
    }

    parsed.base64 = !!parts[parts.length - 2];
    parsed.data = parts[parts.length - 1] || '';

    parsed.toBuffer = () => {
      const encoding = parsed.base64 ? 'base64' : 'utf8';

      return Buffer.from(parsed.data, encoding);
    };

    return parsed;
  };
}));
