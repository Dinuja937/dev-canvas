import assert from 'node:assert/strict';
import test from 'node:test';
import { createOidcState, createPkceChallenge, createPkceVerifier, safeEqual } from '../src/lib/security.js';
import { optionalHttpUrl, parseTags, requiredText } from '../src/lib/validation.js';
import { initiateAsgardeoLogin } from '../src/controllers/auth.controller.js';

test('OIDC state values are unique and compared safely', () => {
  const first = createOidcState();
  const second = createOidcState();
  assert.notEqual(first, second);
  assert.equal(safeEqual(first, first), true);
  assert.equal(safeEqual(first, second), false);
  assert.equal(createPkceChallenge(createPkceVerifier()).length > 40, true);
});

test('OIDC login handler remains available after security hardening', () => {
  assert.equal(typeof initiateAsgardeoLogin, 'function');
});

test('project input validation rejects active URL schemes and non-string content', () => {
  assert.equal(optionalHttpUrl('https://github.com/example/project', 'GitHub URL'), 'https://github.com/example/project');
  assert.throws(() => optionalHttpUrl('javascript:alert(1)', 'Demo URL'), /HTTP or HTTPS/);
  assert.throws(() => requiredText({ $ne: '' }, 'Title', 120), /must be text/);
  assert.throws(() => parseTags(['safe', { $ne: '' }]), /must be text/);
});
