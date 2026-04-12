const Relationship = require('../models/Relationship');
const Profile = require('../models/Profile');
const { updateStat } = require('../utils/stats');

async function updateHappiness(userId1, userId2, points) {
    const relationship = await Relationship.findOne({
        $or: [
            { user1: userId1, user2: userId2 },
            { user1: userId2, user2: userId1 }
        ],
        status: 'accepted'
    });

    if (!relationship) return;

    const newHappiness = Math.min(100, Math.max(0, relationship.happiness + points));

    await Relationship.findOneAndUpdate(
        { _id: relationship._id },
        { happiness: newHappiness }
    );
}

async function updateStreak(userId1, userId2) {
    const relationship = await Relationship.findOne({
        $or: [
            { user1: userId1, user2: userId2 },
            { user1: userId2, user2: userId1 }
        ],
        status: 'accepted'
    });

    if (!relationship) return;

    const now = new Date();
    const last = relationship.lastInteraction;

    if (!last) {
        await Relationship.findOneAndUpdate(
            { _id: relationship._id },
            { streak: 1, lastInteraction: now }
        );
        return;
    }

    const diffMs = now - last;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return;
    } else if (diffDays === 1) {
        const newStreak = relationship.streak + 1;

        const streakBonus =
            newStreak >= 61 ? 10 :
            newStreak >= 31 ? 8  :
            newStreak >= 8  ? 5  : 2;

        const newHappiness = Math.min(100, Math.max(0, relationship.happiness + streakBonus));

        await Relationship.findOneAndUpdate(
            { _id: relationship._id },
            {
                streak: newStreak,
                lastInteraction: now,
                happiness: newHappiness
            }
        );

        // 💎 Lealtad sube con la racha
        const loyaltyPoints =
            newStreak >= 61 ? 8 :
            newStreak >= 31 ? 6 :
            newStreak >= 8  ? 4 : 2;

        await updateStat(userId1, 'lealtad', loyaltyPoints);
        await updateStat(userId2, 'lealtad', loyaltyPoints);

    } else {
        // Racha rota — Lealtad baja
        await Relationship.findOneAndUpdate(
            { _id: relationship._id },
            { streak: 1, lastInteraction: now }
        );

        await updateStat(userId1, 'lealtad', -10);
        await updateStat(userId2, 'lealtad', -10);
    }
}

async function updateMoment(userId1, userId2, momentType) {
    const relationship = await Relationship.findOne({
        $or: [
            { user1: userId1, user2: userId2 },
            { user1: userId2, user2: userId1 }
        ],
        status: 'accepted'
    });

    if (!relationship) return;

    const momentTexts = {
        kiss:   'un beso 💋',
        hug:    'un abrazo 🤗',
        sleep:  'dormir juntos 🌙',
        fuck:   'un momento muy especial 🔥',
        action: 'una acción especial 💕'
    };

    const momentFields = {
        kiss:   'moments.kisses',
        hug:    'moments.hugs',
        sleep:  'moments.sleeps',
        fuck:   'moments.fucks',
        action: 'moments.actions'
    };

    // 🌙 Nostalgia sube según el tipo de momento
    const nostalgiaPoints = {
        kiss:   2,
        hug:    2,
        sleep:  3,
        fuck:   2,
        action: 1
    };

    const momentText = momentTexts[momentType];
    const momentField = momentFields[momentType];

    if (!momentText || !momentField) return;

    await Relationship.findOneAndUpdate(
        { _id: relationship._id },
        {
            $inc: { [momentField]: 1 },
            lastMoment: momentText,
            lastMomentAt: new Date()
        }
    );

    // 🌙 Actualizar Nostalgia para ambos
    const nostPoints = nostalgiaPoints[momentType] || 1;
    await updateStat(userId1, 'nostalgia', nostPoints);
    await updateStat(userId2, 'nostalgia', nostPoints);
}

module.exports = { updateHappiness, updateStreak, updateMoment };