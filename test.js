/* globals describe, it */
/* jshint expr:true */

'use strict';

var parseDataUrl = require('./');
var expect = require('chai').expect;
var bufferEquals = require('buffer-equals');

describe('module', function () {
  var parsed;

  it('should be a function', function () {
    expect(parseDataUrl).to.be.a('function');
  });

  it('return false', function () {
    parsed = parseDataUrl('data:HelloWorld');
    expect(parsed).to.be.false;
  });

  it('parse data', function () {
    parsed = parseDataUrl('data:,Hello World!');
    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.be.undefined;
    expect(parsed.base64).to.be.false;
    expect(parsed.charset).to.be.undefined;
    expect(parsed.data).to.equal('Hello World!');
  });

  it('parse data with trailing spaces', function () {
    parsed = parseDataUrl(' data:,Hello World! ');
    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.be.undefined;
    expect(parsed.base64).to.be.false;
    expect(parsed.charset).to.be.undefined;
    expect(parsed.data).to.equal('Hello World!');
  });

  it('parse data with media type', function () {
    parsed = parseDataUrl('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E');
    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('text/html');
    expect(parsed.base64).to.be.false;
    expect(parsed.charset).to.be.undefined;
    expect(parsed.data).to.equal('%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E');
  });

  it('parse base64 encoded data with simple media type', function () {
    parsed = parseDataUrl('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D');
    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('text/plain');
    expect(parsed.base64).to.be.true;
    expect(parsed.charset).to.be.undefined;
    expect(parsed.data).to.equal('SGVsbG8sIFdvcmxkIQ%3D%3D');
  });

  it('parse base64 encoded data with complex media type', function () {
    parsed = parseDataUrl('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCBmaWxsPSIjMDBCMUZGIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjwvc3ZnPg==');
    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('image/svg+xml');
    expect(parsed.base64).to.be.true;
    expect(parsed.charset).to.be.undefined;
    expect(parsed.data).to.equal('PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCBmaWxsPSIjMDBCMUZGIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjwvc3ZnPg==');
  });

  it('parse data with media types that contain .', function () {
    parsed = parseDataUrl('data:application/vnd.ms-excel;base64,PGh0bWw%2BPC9odG1sPg%3D%3D');
    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('application/vnd.ms-excel');
    expect(parsed.base64).to.be.true;
    expect(parsed.charset).to.be.undefined;
    expect(parsed.data).to.equal('PGh0bWw%2BPC9odG1sPg%3D%3D');
  });

  it('parse data with complex media type and charset', function () {
    parsed = parseDataUrl('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20fill%3D%22%2300B1FF%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3C%2Fsvg%3E');
    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('image/svg+xml;charset=utf-8');
    expect(parsed.base64).to.be.false;
    expect(parsed.charset).to.equal('utf-8');
    expect(parsed.data).to.equal('%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20fill%3D%22%2300B1FF%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3C%2Fsvg%3E');
  });

  it('export buffer from parsed data with base64', function () {
    parsed = parseDataUrl('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D');
    var buffer = new Buffer(parsed.data, 'base64');
    var parsedBuffer = parsed.toBuffer();
    expect(bufferEquals(buffer, parsedBuffer)).to.be.true;
  });

  it('export buffer from parsed data with utf-8', function () {
    parsed = parseDataUrl('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E');
    var buffer = new Buffer(parsed.data, 'utf8');
    var parsedBuffer = parsed.toBuffer();
    expect(bufferEquals(buffer, parsedBuffer)).to.be.true;
  });
});
