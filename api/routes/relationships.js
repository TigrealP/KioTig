const Relationship = require('../../models/Relationship');

async function getRelationshipsHandler(req, res, userId) {
    try {
        const relationships = await Relationship.find({
            $or: [{ user1: userId }, { user2: userId }],
            status: 'accepted'
        }).lean();

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: true, data: relationships }));
    } catch (error) {
        console.error('GET /relationships/:userId error', error);
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: 'Internal server error' }));
    }
}

module.exports = { getRelationshipsHandler };
