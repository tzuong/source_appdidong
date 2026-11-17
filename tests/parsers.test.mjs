import assert from 'node:assert/strict';
import test from 'node:test';
import { parseBooleanMessage, parseTelemetry } from '../src/utils/parsers.js';

test('nhan lenh trang thai JSON booleans', () => {
  assert.equal(parseBooleanMessage('{"on":true}'), true);
  assert.equal(parseBooleanMessage('{"on":false}'), false);
  assert.equal(parseBooleanMessage('ON'), true);
  assert.equal(parseBooleanMessage('OFF'), false);
  assert.equal(parseBooleanMessage('{"invalid":1}'), null);
});

test('du lieu cam bien hop le', () => {
  const v = parseTelemetry('{"temperature":27.42,"humidity":62,"motion":true}');
  assert.equal(v.temperature, 27.4);
  assert.equal(v.humidity, 62);
  assert.equal(v.motion, true);
});

test('loai bo payload khong hop le', () => {
  assert.equal(parseTelemetry('{"temperature":30,"humidity":120}'), null);
  assert.equal(parseTelemetry('{"temperature":"abc","humidity":50}'), null);
  assert.equal(parseTelemetry('abc'), null);
});
