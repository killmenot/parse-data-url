'use strict';

const parseDataUrl = require('./');
const expect = require('chai').expect;

describe('parse-data-url', () => {
  let parsed;

  it('should be a function', () => {
    expect(parseDataUrl).to.be.a('function');
  });

  it('return false when no argument passed', () => {
    parsed = parseDataUrl();
    expect(parsed).equal(false);
  });

  it('return false when invalid data url', () => {
    parsed = parseDataUrl('data:HelloWorld');
    expect(parsed).equal(false);
  });

  it('parse data', () => {
    parsed = parseDataUrl('data:,Hello World!');
    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).be.an('undefined');
    expect(parsed.contentType).be.an('undefined');
    expect(parsed.base64).equal(false);
    expect(parsed.charset).be.an('undefined');
    expect(parsed.data).to.equal('Hello World!');
  });

  it('parse data with trailing spaces', () => {
    parsed = parseDataUrl(' data:,Hello World! ');
    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).be.an('undefined');
    expect(parsed.contentType).be.an('undefined');
    expect(parsed.base64).equal(false);
    expect(parsed.charset).be.an('undefined');
    expect(parsed.data).to.equal('Hello World!');
  });

  it('parse data with media type', () => {
    parsed = parseDataUrl('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E');
    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('text/html');
    expect(parsed.contentType).to.equal('text/html');
    expect(parsed.base64).equal(false);
    expect(parsed.charset).be.an('undefined');
    expect(parsed.data).to.equal('%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E');
  });

  it('parse with empty data ', () => {
    parsed = parseDataUrl('data:,');
    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).be.an('undefined');
    expect(parsed.contentType).be.an('undefined');
    expect(parsed.base64).equal(false);
    expect(parsed.charset).be.an('undefined');
    expect(parsed.data).to.equal('');
  });

  it('parse base64 encoded data with simple media type', () => {
    parsed = parseDataUrl('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D');
    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('text/plain');
    expect(parsed.contentType).to.equal('text/plain');
    expect(parsed.base64).equal(true);
    expect(parsed.charset).be.an('undefined');
    expect(parsed.data).to.equal('SGVsbG8sIFdvcmxkIQ%3D%3D');
  });

  it('parse base64 encoded data with complex media type', () => {
    parsed = parseDataUrl('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCBmaWxsPSIjMDBCMUZGIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjwvc3ZnPg==');
    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('image/svg+xml');
    expect(parsed.contentType).to.equal('image/svg+xml');
    expect(parsed.base64).equal(true);
    expect(parsed.charset).be.an('undefined');
    expect(parsed.data).to.equal('PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCBmaWxsPSIjMDBCMUZGIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIvPjwvc3ZnPg==');
  });

  it('parse data with media types that contain .', () => {
    parsed = parseDataUrl('data:application/vnd.ms-excel;base64,PGh0bWw%2BPC9odG1sPg%3D%3D');
    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('application/vnd.ms-excel');
    expect(parsed.contentType).to.equal('application/vnd.ms-excel');
    expect(parsed.base64).equal(true);
    expect(parsed.charset).be.an('undefined');
    expect(parsed.data).to.equal('PGh0bWw%2BPC9odG1sPg%3D%3D');
  });

  it('parse data with complex media type and single attribute', () => {
    parsed = parseDataUrl('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20fill%3D%22%2300B1FF%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3C%2Fsvg%3E');
    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('image/svg+xml;charset=utf-8');
    expect(parsed.contentType).to.equal('image/svg+xml');
    expect(parsed.charset).to.equal('utf-8');
    expect(parsed.base64).equal(false);
    expect(parsed.data).to.equal('%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Crect%20fill%3D%22%2300B1FF%22%20width%3D%22100%22%20height%3D%22100%22%2F%3E%3C%2Fsvg%3E');
  });

  it('parse data with media type and multiple attributes', () => {
    parsed = parseDataUrl('data:image/png;name=foo.bar;baz=quux;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAFVBMVEXk5OTn5+ft7e319fX29vb5+fn///++GUmVAAAALUlEQVQIHWNICnYLZnALTgpmMGYIFWYIZTA2ZFAzTTFlSDFVMwVyQhmAwsYMAKDaBy0axX/iAAAAAElFTkSuQmCC');
    expect(parsed).to.be.an('object');
    expect(parsed.mediaType).to.equal('image/png;name=foo.bar;baz=quux');
    expect(parsed.contentType).to.equal('image/png');
    expect(parsed.name).to.equal('foo.bar');
    expect(parsed.baz).to.equal('quux');
    expect(parsed.base64).equal(true);
    expect(parsed.data).to.equal('iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAFVBMVEXk5OTn5+ft7e319fX29vb5+fn///++GUmVAAAALUlEQVQIHWNICnYLZnALTgpmMGYIFWYIZTA2ZFAzTTFlSDFVMwVyQhmAwsYMAKDaBy0axX/iAAAAAElFTkSuQmCC');
  });

  it('export buffer from parsed data with base64', () => {
    parsed = parseDataUrl('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D');
    const buffer = Buffer.from(parsed.data, 'base64');
    const parsedBuffer = parsed.toBuffer();
    expect(buffer.equals(parsedBuffer)).equal(true);
  });

  it('export buffer from parsed data with utf-8', () => {
    parsed = parseDataUrl('data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E');
    const buffer = Buffer.from(parsed.data, 'utf8');
    const parsedBuffer = parsed.toBuffer();
    expect(buffer.equals(parsedBuffer)).equal(true);
  });

  it('export buffer from parsed data with empty data', () => {
    parsed = parseDataUrl('data:,');
    const buffer = Buffer.from(parsed.data, 'utf8');
    const parsedBuffer = parsed.toBuffer();
    expect(buffer.equals(parsedBuffer)).equal(true);
  });
});
