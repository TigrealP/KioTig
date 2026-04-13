const http = require('http');
const { URL } = require('url');
const { apiKeyAuth } = require('./middleware/auth');
const { healthHandler } = require('./routes/health');
const { getProfileHandler, patchProfilePrivacyHandler } = require('./routes/profiles');
const { getRelationshipsHandler } = require('./routes/relationships');

function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';

        req.on('data', chunk => {
            data += chunk.toString('utf8');
            if (data.length > 1024 * 1024) {
                reject(new Error('Payload too large'));
            }
        });

        req.on('end', () => {
            if (!data) return resolve({});

            try {
                resolve(JSON.parse(data));
            } catch (error) {
                reject(new Error('Invalid JSON body'));
            }
        });

        req.on('error', reject);
    });
}

function sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
}


function isValidUserId(userId) {
    return /^\d{17,20}$/.test(userId);
}

function createApiServer() {
    return http.createServer(async (req, res) => {
        if (!apiKeyAuth(req, res)) return;

        const parsedUrl = new URL(req.url, 'http://localhost');
        const path = parsedUrl.pathname;

        if (req.method === 'GET' && path === '/api/v1/health') {
            return healthHandler(req, res);
        }

        const profileMatch = path.match(/^\/api\/v1\/profiles\/([^/]+)$/);
        if (req.method === 'GET' && profileMatch) {
            if (!isValidUserId(profileMatch[1])) {
                return sendJson(res, 400, { ok: false, error: 'Invalid userId' });
            }
            return getProfileHandler(req, res, profileMatch[1]);
        }

        const privacyMatch = path.match(/^\/api\/v1\/profiles\/([^/]+)\/privacy$/);
        if (req.method === 'PATCH' && privacyMatch) {
            if (!isValidUserId(privacyMatch[1])) {
                return sendJson(res, 400, { ok: false, error: 'Invalid userId' });
            }

            try {
                const body = await readJsonBody(req);
                return patchProfilePrivacyHandler(req, res, privacyMatch[1], body);
            } catch (error) {
                const code = error.message === 'Payload too large' ? 413 : 400;
                return sendJson(res, code, { ok: false, error: error.message });
            }
        }

        const relMatch = path.match(/^\/api\/v1\/relationships\/([^/]+)$/);
        if (req.method === 'GET' && relMatch) {
            if (!isValidUserId(relMatch[1])) {
                return sendJson(res, 400, { ok: false, error: 'Invalid userId' });
            }
            return getRelationshipsHandler(req, res, relMatch[1]);
        }

        return sendJson(res, 404, { ok: false, error: 'Route not found' });
    });
}

module.exports = { createApiServer };
