const Profile = require('../models/Profile');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

// 🔒 Stats fijas por usuario
const FIXED_STATS = {
    [TU_ID]: 'dominancia',
    [NOVIO_ID]: 'sumision'
};

// 📊 Límites
const MIN = 0;
const MAX = 100;

function clamp(value) {
    return Math.min(MAX, Math.max(MIN, value));
}

/**
 * Actualiza una stat de un usuario
 * @param {string} userId - ID del usuario
 * @param {string} stat - Nombre de la stat
 * @param {number} points - Puntos a sumar o restar
 */
async function updateStat(userId, stat, points) {

    const profile = await Profile.findOne({ userId });
    if (!profile) return;

    // Verificar que la stat esté desbloqueada
    if (!profile.stats[stat]?.unlocked) return;

    const currentValue = profile.stats[stat].value;
    const newValue = clamp(currentValue + points);

    await Profile.findOneAndUpdate(
        { userId },
        { [`stats.${stat}.value`]: newValue }
    );
}

/**
 * Actualiza stats de dos usuarios a la vez
 * @param {string} authorId - ID del que ejecuta la acción
 * @param {string} targetId - ID del que recibe la acción
 * @param {Object} authorStats - Stats del author { stat: points }
 * @param {Object} targetStats - Stats del target { stat: points }
 */
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

/**
 * Desbloquea las stats iniciales de un usuario
 * @param {string} userId - ID del usuario
 * @param {string[]} selectedStats - Stats elegidas por el usuario (max 3)
 */
async function unlockStats(userId, selectedStats) {

    const updateObj = {};

    // Activar stat fija según el usuario
    const fixedStat = FIXED_STATS[userId];
    if (fixedStat) {
        updateObj[`stats.${fixedStat}.unlocked`] = true;
        updateObj[`stats.${fixedStat}.value`] = 50;
    }

    // Activar stats elegidas (máximo 3)
    for (const stat of selectedStats.slice(0, 3)) {
        updateObj[`stats.${stat}.unlocked`] = true;
        updateObj[`stats.${stat}.value`] = 50;
    }

    await Profile.findOneAndUpdate(
        { userId },
        updateObj,
        { upsert: true, new: true }
    );
}

/**
 * Genera la barra visual de una stat
 * @param {number} value - Valor de la stat (0-100)
 */
function statBar(value) {
    const filled = Math.round(value / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty) + ` ${value}/100`;
}

/**
 * Genera el embed de stats de un perfil
 * @param {Object} stats - Stats del perfil
 */
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

module.exports = { updateStat, updateStats, unlockStats, statBar, formatStats };