function apiKeyAuth(req, res) {
    const expectedApiKey = process.env.API_KEY;

    if (!expectedApiKey) {
        return true;
    }

    const receivedApiKey = req.headers['x-api-key'];

    if (!receivedApiKey || receivedApiKey !== expectedApiKey) {
        res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Unauthorized' }));
        return false;
    }

    return true;
}

module.exports = { apiKeyAuth };
