const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const Profile = require('../models/Profile');
const { unlockStats, formatStats, FIXED_STATS, BLOCKED_STATS } = require('../utils/stats');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

const ALL_STATS = [
    { label: '🐯 Dominancia', description: 'Qué tan dominante eres', value: 'dominancia' },
    { label: '🐶 Sumisión',   description: 'Qué tan sumiso eres',    value: 'sumision'  },
    { label: '❤️ Afecto',     description: 'Qué tan cariñoso eres',  value: 'afecto'    },
    { label: '😈 Picardía',   description: 'Qué tan travieso eres',  value: 'picardía'  },
    { label: '💎 Lealtad',    description: 'Qué tan fiel eres',      value: 'lealtad'   },
    { label: '🌙 Nostalgia',  description: 'Qué tan apegado al pasado eres', value: 'nostalgia' },
    { label: '🍖 Peso',       description: 'Qué tan bien alimentado estás',  value: 'peso'      },
    { label: '🫦 Deseo',      description: 'Qué tan excitado estás', value: 'deseo'     },
    { label: '🤕 Dolor',      description: 'Qué tan castigado estás', value: 'dolor'    },
    { label: '🔒 Control',    description: 'Qué tan dominado estás', value: 'control'   },
    { label: '🧸 Apego',      description: 'Qué tan dependiente eres', value: 'apego'   }
];

// Construye las opciones del menú filtrando fija y bloqueada
function buildStatOptions(userId) {
    const fixed   = FIXED_STATS[userId];
    const blocked = BLOCKED_STATS[userId];

    return ALL_STATS.filter(s => s.value !== fixed && s.value !== blocked);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('editar-perfil')
        .setDescription('Edita tu perfil 🐾')
        .addSubcommand(sub =>
            sub.setName('texto').setDescription('Edita tu nombre y descripción')
        )
        .addSubcommand(sub =>
            sub.setName('imagen').setDescription('Cambia tu imagen de perfil')
        )
        .addSubcommand(sub =>
            sub.setName('stats').setDescription('Cambia tus stats elegibles')
        ),

    async execute(interaction) {
        try {
            const subcommand = interaction.options.getSubcommand();
            const userId = interaction.user.id;
            const currentProfile = await Profile.findOne({ userId });

            // ─── SUBCOMANDO: texto ───────────────────────────────────────────
            if (subcommand === 'texto') {

                const modal = new ModalBuilder()
                    .setCustomId('profileEditModal')
                    .setTitle('Editar Perfil 🐾');

                modal.addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('characterName')
                            .setLabel('Nombre del personaje')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                            .setValue(currentProfile?.characterName || '')
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('description')
                            .setLabel('Descripción')
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                            .setValue(currentProfile?.description || '')
                    )
                );

                await interaction.showModal(modal);

                const modalSubmit = await interaction.awaitModalSubmit({
                    time: 60000,
                    filter: i => i.user.id === userId
                }).catch(() => null);

                if (!modalSubmit) return;

                const characterName = modalSubmit.fields.getTextInputValue('characterName');
                const description   = modalSubmit.fields.getTextInputValue('description');

                const isFirstTime = !currentProfile ||
                    !Object.values(currentProfile.stats || {}).some(s => s.unlocked);

                if (isFirstTime) {
                    // Guardar texto antes de mostrar menú
                    await Profile.findOneAndUpdate(
                        { userId },
                        { characterName, description, updatedAt: new Date() },
                        { upsert: true, new: true }
                    );

                    const fixedStat   = FIXED_STATS[userId];
                    const fixedLabel  = ALL_STATS.find(s => s.value === fixedStat)?.label;
                    const fixedNote   = fixedLabel
                        ? `\n\n> Tu stat fija es **${fixedLabel}** y se activará automáticamente.`
                        : '';

                    const options = buildStatOptions(userId);

                    const menu = new StringSelectMenuBuilder()
                        .setCustomId('selectStats')
                        .setPlaceholder('Elige exactamente 4 stats...')
                        .setMinValues(4)
                        .setMaxValues(4)
                        .addOptions(options);

                    await modalSubmit.reply({
                        content: `🎲 **¡Primera vez!** Elige las **4 stats** que definirán a tu personaje.${fixedNote}`,
                        components: [new ActionRowBuilder().addComponents(menu)]
                    });

                    const statsMessage = await modalSubmit.fetchReply();

                    const collector = statsMessage.createMessageComponentCollector({
                        filter: i => i.user.id === userId && i.customId === 'selectStats',
                        time: 60000,
                        max: 1
                    });

                    collector.on('collect', async i => {
                        // Doble validación: filtrar bloqueada por si acaso
                        const blocked = BLOCKED_STATS[userId];
                        const selectedStats = i.values.filter(v => v !== blocked);

                        await unlockStats(userId, selectedStats);

                        const updatedProfile = await Profile.findOne({ userId });

                        const embed = new EmbedBuilder()
                            .setColor('#8b0808')
                            .setTitle(`🐾 Perfil de ${characterName}`)
                            .setDescription(`**•** ${description}`)
                            .addFields({ name: '📊 Stats', value: formatStats(updatedProfile.stats) })
                            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                            .setFooter({ text: interaction.user.username })
                            .setTimestamp();

                        await i.update({
                            content: '✅ ¡Perfil creado!',
                            embeds: [embed],
                            components: []
                        });
                    });

                    collector.on('end', async (collected, reason) => {
                        if (reason === 'time' && collected.size === 0) {
                            await modalSubmit.editReply({
                                content: '⏳ Tiempo agotado. Usa `/editar-perfil texto` de nuevo.',
                                components: []
                            }).catch(() => {});
                        }
                    });

                } else {
                    // Perfil existente: solo actualizar texto
                    await Profile.findOneAndUpdate(
                        { userId },
                        { characterName, description, updatedAt: new Date() },
                        { upsert: true }
                    );

                    const embed = new EmbedBuilder()
                        .setColor('#8b0808')
                        .setTitle(`🐾 Perfil de ${characterName}`)
                        .setDescription(`**•** ${description}`)
                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                        .setFooter({ text: interaction.user.username })
                        .setTimestamp();

                    if (currentProfile?.stats && Object.values(currentProfile.stats).some(s => s.unlocked)) {
                        embed.addFields({ name: '📊 Stats', value: formatStats(currentProfile.stats) });
                    }

                    if (currentProfile?.image) embed.setImage(currentProfile.image);

                    await modalSubmit.reply({
                        content: '✅ ¡Perfil actualizado!',
                        embeds: [embed],
                        flags: 64
                    });
                }
            }

            // ─── SUBCOMANDO: stats ───────────────────────────────────────────
            if (subcommand === 'stats') {

                // Solo permitir si ya tiene perfil creado
                if (!currentProfile || !Object.values(currentProfile.stats || {}).some(s => s.unlocked)) {
                    return interaction.reply({
                        content: 'Primero debes crear tu perfil con `/editar-perfil texto` 🐾',
                        ephemeral: true
                    });
                }

                const fixedStat  = FIXED_STATS[userId];
                const fixedLabel = ALL_STATS.find(s => s.value === fixedStat)?.label;
                const fixedNote  = fixedLabel
                    ? `\n\n> Tu stat fija es **${fixedLabel}** y no puede cambiarse.`
                    : '';

                const options = buildStatOptions(userId);

                const menu = new StringSelectMenuBuilder()
                    .setCustomId('selectStatsUpdate')
                    .setPlaceholder('Elige exactamente 4 stats...')
                    .setMinValues(4)
                    .setMaxValues(4)
                    .addOptions(options);

                await interaction.reply({
                    content: `🎲 Elige tus **4 stats** elegibles. Tu selección anterior se reemplazará.${fixedNote}`,
                    components: [new ActionRowBuilder().addComponents(menu)]
                });

                const message = await interaction.fetchReply();

                const collector = message.createMessageComponentCollector({
                    filter: i => i.user.id === userId && i.customId === 'selectStatsUpdate',
                    time: 60000,
                    max: 1
                });

                collector.on('collect', async i => {
                    const blocked = BLOCKED_STATS[userId];
                    const selectedStats = i.values.filter(v => v !== blocked);

                    await unlockStats(userId, selectedStats);

                    const updatedProfile = await Profile.findOne({ userId });

                    const embed = new EmbedBuilder()
                        .setColor('#8b0808')
                        .setTitle(`🐾 Perfil de ${updatedProfile.characterName}`)
                        .setDescription(`**•** ${updatedProfile.description || '*Sin descripción.*'}`)
                        .addFields({ name: '📊 Stats', value: formatStats(updatedProfile.stats) })
                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                        .setFooter({ text: interaction.user.username })
                        .setTimestamp();

                    if (updatedProfile.image) embed.setImage(updatedProfile.image);

                    await i.update({
                        content: '✅ ¡Stats actualizadas!',
                        embeds: [embed],
                        components: []
                    });
                });

                collector.on('end', async (collected, reason) => {
                    if (reason === 'time' && collected.size === 0) {
                        await interaction.editReply({
                            content: '⏳ Tiempo agotado. Usa `/editar-perfil stats` de nuevo.',
                            components: []
                        }).catch(() => {});
                    }
                });
            }

            // ─── SUBCOMANDO: imagen ──────────────────────────────────────────
            if (subcommand === 'imagen') {

                await interaction.reply({
                    content: '📸 Adjunta tu imagen en tu **próximo mensaje** en este canal. Tienes 60 segundos.',
                    flags: 64
                });

                const imageResponse = await interaction.channel.awaitMessages({
                    max: 1,
                    time: 60000,
                    filter: msg => {
                        if (msg.author.id !== userId) return false;
                        if (msg.attachments.size === 0) return false;
                        return msg.attachments.first().contentType?.startsWith('image/') ?? false;
                    }
                }).catch(() => null);

                if (!imageResponse || imageResponse.size === 0) {
                    return await interaction.followUp({
                        content: '⏳ No se recibió ninguna imagen válida a tiempo.',
                        flags: 64
                    });
                }

                const imageUrl = imageResponse.first().attachments.first().url;

                await Profile.findOneAndUpdate(
                    { userId },
                    { image: imageUrl, updatedAt: new Date() },
                    { upsert: true }
                );

                const embed = new EmbedBuilder()
                    .setColor('#8b0808')
                    .setTitle(`🐾 Perfil de ${currentProfile?.characterName || interaction.user.username}`)
                    .setDescription(`**•** ${currentProfile?.description || '*Sin descripción.*'}`)
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setImage(imageUrl)
                    .setFooter({ text: interaction.user.username })
                    .setTimestamp();

                if (currentProfile?.stats && Object.values(currentProfile.stats).some(s => s.unlocked)) {
                    embed.addFields({ name: '📊 Stats', value: formatStats(currentProfile.stats) });
                }

                await interaction.followUp({
                    content: '✅ ¡Imagen actualizada!',
                    embeds: [embed],
                    flags: 64
                });
            }

        } catch (error) {
            console.error(error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'Hubo un error al editar el perfil.', flags: 64 });
            }
        }
    }
};