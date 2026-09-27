import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';

before(() => {
  process.env.NODE_ENV = 'test';
});

describe('Health & Server Infrastructure Tests', () => {
  describe('GET /api/health', () => {
    it('should return 200 OK with health status metadata', async () => {
      const res = await request(app).get('/api/health');

      assert.equal(res.status, 200);
      assert.equal(res.body.status, 'ok');
      assert.equal(res.body.service, 'lms-api');
      assert.ok(res.body.timestamp);
      assert.ok(typeof res.body.uptime === 'number');
    });

    it('should return security headers added by helmet', async () => {
      const res = await request(app).get('/api/health');

      assert.ok(res.headers['x-dns-prefetch-control']);
      assert.equal(res.headers['x-content-type-options'], 'nosniff');
    });
  });

  describe('404 Route Handler', () => {
    it('should return 404 JSON response for unknown routes', async () => {
      const res = await request(app).get('/api/unknown-endpoint-xyz');

      assert.equal(res.status, 404);
      assert.ok(res.body.error);
      assert.ok(res.body.error.includes('Route not found'));
    });
  });

  describe('Validation & Malformed Data Rejection', () => {
    it('should accept valid payload matching schema', async () => {
      const res = await request(app)
        .post('/api/health/validate-test')
        .send({
          message: 'Hello LMS',
          count: 5,
        });

      assert.equal(res.status, 200);
      assert.deepEqual(res.body.received, {
        message: 'Hello LMS',
        count: 5,
      });
    });

    it('should reject malformed or wrong data types outright with 400', async () => {
      const res = await request(app)
        .post('/api/health/validate-test')
        .send({
          message: 'Hello LMS',
          count: 'not-a-number', // invalid type
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Validation failed');
      assert.ok(Array.isArray(res.body.details));
      assert.ok(res.body.details.length > 0);
      assert.equal(res.body.details[0].field, 'count');
    });

    it('should reject payload with unexpected keys in strict schema', async () => {
      const res = await request(app)
        .post('/api/health/validate-test')
        .send({
          message: 'Hello LMS',
          count: 2,
          unexpectedField: 'injected_data',
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Validation failed');
    });

    it('should reject syntactically malformed JSON body with 400', async () => {
      const res = await request(app)
        .post('/api/health/validate-test')
        .set('Content-Type', 'application/json')
        .send('{ invalid json payload: true');

      assert.equal(res.status, 400);
      assert.equal(res.body.error, 'Malformed JSON payload');
    });
  });
});
