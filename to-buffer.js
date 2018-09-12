'use strict';

const NODE_MAJOR_VERSION = parseInt(process.version.slice(1), 10);

module.exports = (string, encoding) => {
  // new Buffer(string[, encoding]) is deprecated since: v6.0.0
  // https://nodejs.org/docs/latest-v6.x/api/buffer.html#buffer_new_buffer_string_encoding

  return NODE_MAJOR_VERSION >= 6 ?
    Buffer.from(string, encoding) :
    new Buffer(string, encoding);
};
