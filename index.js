'use strict';

var validDataUrl = require('valid-data-url');
var NODE_MAJOR_VERSION = parseInt(process.version.slice(1), 10);

module.exports = function (s) {
  var parts;
  var parsed;

  if (!validDataUrl(s)) {
    return false;
  }

  parts = s.trim().match(validDataUrl.regex);
  parsed = {};

  if (parts[1]) {
    parsed.mediaType = parts[1].toLowerCase();
  }

  if (parts[2]) {
    parsed.charset = parts[2].split('=')[1].toLowerCase();
  }

  parsed.base64 = !!parts[3];

  parsed.data = parts[4] || '';

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
