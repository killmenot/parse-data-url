'use strict';

var validDataUrl = require('valid-data-url');
var NODE_MAJOR_VERSION = parseInt(process.version.slice(1), 10);

module.exports = function (s) {
  var parts;
  var mediaTypeParts;
  var parsed;

  if (!validDataUrl(s)) {
    return false;
  }

  parts = s.trim().match(validDataUrl.regex);
  parsed = {};

  if (parts[1]) {
    parsed.mediaType = parts[1].toLowerCase();

    mediaTypeParts = parts[1].split(';').map(function (s) { return s.toLowerCase(); });

    parsed.contentType = mediaTypeParts[0];

    mediaTypeParts.slice(1).forEach(function (attribute) {
      var p = attribute.split('=');
      parsed[p[0]] = p[1];
    });
  }

  parsed.base64 = !!parts[parts.length - 2];
  parsed.data = parts[parts.length - 1] || '';

  parsed.toBuffer = function () {
    // new Buffer(string[, encoding]) is deprecated since: v6.0.0
    // https://nodejs.org/docs/latest-v6.x/api/buffer.html#buffer_new_buffer_string_encoding

    var encoding = parsed.base64 ? 'base64' : 'utf8';

    return NODE_MAJOR_VERSION >= 6 ?
      Buffer.from(parsed.data, encoding) :
      new Buffer(parsed.data, encoding);
  };

  return parsed;
};
