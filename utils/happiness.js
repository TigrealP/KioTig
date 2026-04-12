const Relationship = require('../models/Relationship');

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
    } else {
        await Relationship.findOneAndUpdate(
            { _id: relationship._id },
            { streak: 1, lastInteraction: now }
        );
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

    // 📸 Texto descriptivo del momento
    const momentTexts = {
        kiss:   'un beso 💋',
        hug:    'un abrazo 🤗',
        sleep:  'dormir juntos 🌙',
        fuck:   'un momento muy especial 🔥',
        action: 'una acción especial 💕'
    };

    // 📊 Campo a incrementar según el tipo
    const momentFields = {
        kiss:   'moments.kisses',
        hug:    'moments.hugs',
        sleep:  'moments.sleeps',
        fuck:   'moments.fucks',
        action: 'moments.actions'
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
}

module.exports = { updateHappiness, updateStreak, updateMoment };