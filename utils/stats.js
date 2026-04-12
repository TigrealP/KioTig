const Profile = require('../models/Profile');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

const FIXED_STATS = {
    [TU_ID]: 'dominancia',
    [NOVIO_ID]: 'sumision'
};

const BLOCKED_STATS = {
    [TU_ID]: 'sumision',
    [NOVIO_ID]: 'dominancia'
};

const MIN = 0;
const MAX = 100;

function clamp(value) {
    return Math.min(MAX, Math.max(MIN, value));
}

async function updateStat(userId, stat, points) {
    const profile = await Profile.findOne({ userId });
    if (!profile) return;
    if (!profile.stats[stat]?.unlocked) return;

    const currentValue = profile.stats[stat].value;
    const newValue = clamp(currentValue + points);

    await Profile.findOneAndUpdate(
        { userId },
        { [`stats.${stat}.value`]: newValue }
    );
}

async function updateStats(authorId, targetId, authorStats = {}, targetStats = {}) {
    const updates = [];

    for (const [stat, points] of Object.entries(authorStats)) {
        updates.push(updateStat(authorId, stat, points));
    }

    for (const [stat, points] of Object.entries(targetStats)) {
        updates.push(updateStat(targetId, stat, points));
    }

    await Promise.all(updates);
}

async function unlockStats(userId, selectedStats) {
    const updateObj = {};

    // Primero desbloquear TODAS las stats como bloqueadas (reset)
    const allStats = ['dominancia', 'sumision', 'afecto', 'picardía', 'lealtad', 'nostalgia', 'peso', 'deseo', 'dolor', 'control', 'apego'];
    for (const stat of allStats) {
        updateObj[`stats.${stat}.unlocked`] = false;
    }

    // Stat fija según rol
    const fixedStat = FIXED_STATS[userId];
    if (fixedStat) {
        updateObj[`stats.${fixedStat}.unlocked`] = true;
        updateObj[`stats.${fixedStat}.value`] = 50;
    }

    // Stat bloqueada — asegurarse de que nunca se active
    const blockedStat = BLOCKED_STATS[userId];

    // Activar stats elegidas filtrando la bloqueada
    const validSelected = selectedStats
        .slice(0, 4)
        .filter(stat => stat !== blockedStat && stat !== fixedStat);

    for (const stat of validSelected) {
        updateObj[`stats.${stat}.unlocked`] = true;
        updateObj[`stats.${stat}.value`] = 50;
    }

    await Profile.findOneAndUpdate(
        { userId },
        updateObj,
        { upsert: true, new: true }
    );
}

function statBar(value) {
    const filled = Math.round(value / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty) + ` ${value}/100`;
}

function formatStats(stats) {
    const statNames = {
        dominancia: '🐯 Dominancia',
        sumision:   '🐶 Sumisión',
        afecto:     '❤️ Afecto',
        picardía:   '😈 Picardía',
        lealtad:    '💎 Lealtad',
        nostalgia:  '🌙 Nostalgia',
        peso:       '🍖 Peso',
        deseo:      '🫦 Deseo',
        dolor:      '🤕 Dolor',
        control:    '🔒 Control',
        apego:      '🧸 Apego'
    };

    const lines = [];

    for (const [key, stat] of Object.entries(stats)) {
        if (stat.unlocked) {
            lines.push(`${statNames[key]}\n${statBar(stat.value)}`);
        }
    }

    if (lines.length === 0) return '📊 Sin stats desbloqueadas aún.';
    return lines.join('\n\n');
}

module.exports = { updateStat, updateStats, unlockStats, statBar, formatStats, FIXED_STATS, BLOCKED_STATS };