// Focused controller tests: no network, credentials, or database mutations.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');
const nonce = 'a'.repeat(64);
let payload, account;
class ApiError extends Error {
  constructor(statusCode, message) { super(message); this.statusCode = statusCode; }
}
const db = { user: {
  findUnique: async query => query.where.googleSubject ? account : null,
  create: async query => ({ id: 'new', isActive: true, ...query.data, vendor: null })
} };
const dependencies = {
  'google-auth-library': { OAuth2Client: class { async verifyIdToken() { return { getPayload: () => payload }; } } },
  '@prisma/client': { PrismaClient: class { constructor() { return db; } } },
  '../config/env.js': { env: { GOOGLE_CLIENT_ID: 'test', FRONTEND_URL: 'http://localhost:5173', NODE_ENV: 'development' } },
  '../utils/apiError.js': { ApiError },
  '../utils/jwt.js': { signToken: () => 'test-session' },
  bcryptjs: { hash: async () => 'random-password-hash' }
};
const controller = {};
vm.runInNewContext(ts.transpile(fs.readFileSync(path.join(__dirname, '../src/controllers/googleAuthController.ts'), 'utf8'),
  { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 }),
  { exports: controller, require: name => dependencies[name] || require(name), Buffer, URL });
const tourist = { id: 'u', name: 'Test', email: 'test@gmail.com', role: 'TOURIST', isActive: true, vendor: null };

async function check(label, options = {}) {
  payload = options.payload || { sub: 'google-subject', email: 'test@gmail.com', email_verified: true, nonce };
  account = options.account === undefined ? tourist : options.account;
  let error, result;
  const cookies = [];
  await controller.googleLogin({
    get: () => options.origin || 'http://localhost:5173',
    cookies: { setu_google_nonce: options.nonce === undefined ? nonce : options.nonce },
    body: { credential: 'mock-token', role: options.role || 'TOURIST' }
  }, { cookie: (...args) => cookies.push(args), clearCookie: () => {}, json: value => { result = value; } },
  value => { error = value; });
  if (options.status) {
    assert.equal(error?.statusCode, options.status, label);
    assert.equal(cookies.length, 0, 'Rejected sign-in must not issue a session');
  } else {
    assert.ifError(error);
    assert.equal(result.success, true);
    assert.equal(cookies[0][0], 'setu_token');
  }
  console.log('PASS ' + label);
}
(async () => {
  await check('existing tourist');
  await check('new tourist', { account: null });
  await check('existing vendor', { role: 'VENDOR', account: { ...tourist, role: 'VENDOR' } });
  await check('untrusted origin', { origin: 'https://evil.example', status: 403 });
  await check('missing nonce', { nonce: '', status: 401 });
  await check('nonce mismatch', { nonce: 'b'.repeat(64), status: 401 });
  await check('unverified email', { payload: { sub: 'g', email: 'test@gmail.com', email_verified: false, nonce }, status: 401 });
  await check('role mismatch', { role: 'VENDOR', status: 403 });
  await check('admin creation blocked', { role: 'ADMIN', status: 400 });
  await check('disabled user', { account: { ...tourist, isActive: false }, status: 403 });
})().catch(error => { console.error(error); process.exitCode = 1; });
