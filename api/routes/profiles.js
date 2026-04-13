const Profile = require('../../models/Profile');

async function getProfileHandler(req, res, userId) {
    try {
        const profile = await Profile.findOne({ userId }).lean();

        if (!profile) {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ ok: false, error: 'Profile not found' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: true, data: profile }));
    } catch (error) {
        console.error('GET /profiles/:userId error', error);
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Internal server error' }));
    }
}

async function patchProfilePrivacyHandler(req, res, userId, body) {
    try {
        if (typeof body?.isPublic !== 'boolean') {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ ok: false, error: 'isPublic must be boolean' }));
            return;
        }

        const updated = await Profile.findOneAndUpdate(
            { userId },
            { isPublic: body.isPublic, updatedAt: new Date() },
            { new: true }
        ).lean();

        if (!updated) {
            res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ ok: false, error: 'Profile not found' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: true, data: updated }));
    } catch (error) {
        console.error('PATCH /profiles/:userId/privacy error', error);
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Internal server error' }));
    }
}

module.exports = { getProfileHandler, patchProfilePrivacyHandler };
