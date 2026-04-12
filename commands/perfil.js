const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, ComponentType } = require('discord.js');
const { unlockStats, formatStats, updateStat, FIXED_STATS, BLOCKED_STATS } = require('../utils/stats');
const Profile = require('../models/Profile');
const Relationship = require('../models/Relationship');
const User = require('../models/User');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

const MOOD_LABELS = {
    mimoso:    'Mimoso 🐯🧡🐶',
    needy:     'Needy 🥀',
    celoso:    'Celoso 😡',
    dominante: 'Dominante 🐯',
    sumiso:    'Sumiso 🐶'
};

function getRoleIcon(userId) {
    if (userId === TU_ID) return '🐯';
    if (userId === NOVIO_ID) return '🐶';
    return '🦊';
}

async function isPartner(authorId, targetId) {
    const relationship = await Relationship.findOne({
        $or: [
            { user1: authorId, user2: targetId },
            { user1: targetId, user2: authorId }
        ],
        status: 'accepted'
    });
    return !!relationship;
}

function getAvailableStats(userId) {
    const allStats = ['dominancia', 'sumision', 'afecto', 'picardía', 'lealtad', 'nostalgia', 'peso', 'deseo', 'dolor', 'control', 'apego'];
    const fixed = FIXED_STATS[userId];
    const blocked = BLOCKED_STATS[userId];
    return allStats.filter(stat => stat !== fixed && stat !== blocked);
}

function createProfileEmbed(profile, targetUser, moodLabel, isOwn, isPartner, isPublic) {
    const createdAt = profile.createdAt
        ? `Perfil creado el ${profile.createdAt.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}`
        : null;

    const footerText = [targetUser.username, createdAt].filter(Boolean).join('  •  ');
    const separator = '`─────────────────`';
    const descLines = [];

    descLines.push(`**•** ${profile.description || '*Sin descripción.*'}`);
    descLines.push('');

    if (moodLabel) {
        descLines.push(`**•** Estado actual: ${moodLabel}`);
        descLines.push('');
    }

    const hasStats = profile.stats && Object.values(profile.stats).some(s => s.unlocked);
    if (hasStats) {
        descLines.push(separator);
        descLines.push('**📊 Stats:**');
        descLines.push(formatStats(profile.stats));
        descLines.push(separator);
    }

    const embed = new EmbedBuilder()
        .setColor('#8b0808')
        .setTitle(`${profile.characterName || targetUser.username}`)
        .setDescription(descLines.join('\n'))
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: footerText, iconURL: targetUser.displayAvatarURL() })
        .setTimestamp();

    if (profile.image) embed.setImage(profile.image);

    return embed;
}

function createButtons(isOwn, isPartnerRelation, isPublic) {
    const components = [];

    if (isOwn) {
        components.push(
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('edit_texto')
                    .setLabel('Editar texto 📝')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('edit_imagen')
                    .setLabel('Editar imagen 🖼️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('edit_stats')
                    .setLabel('Editar stats 🎲')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('toggle_privacy')
                    .setLabel(isPublic ? '🌐 Público' : '🔒 Privado')
                    .setStyle(ButtonStyle.Danger)
            )
        );
    } else if (isPartnerRelation) {
        components.push(
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('edit_texto')
                    .setLabel('Editar texto 📝')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('edit_imagen')
                    .setLabel('Editar imagen 🖼️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('edit_stats')
                    .setLabel('Editar stats 🎲')
                    .setStyle(ButtonStyle.Success)
            )
        );
    } else if (isPublic) {
        components.push(
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('edit_texto')
                    .setLabel('Editar texto 📝')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('edit_imagen')
                    .setLabel('Editar imagen 🖼️')
                    .setStyle(ButtonStyle.Secondary)
            )
        );
    }

    return components;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('perfil')
        .setDescription('Muestra el perfil de un usuario')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Usuario cuyo perfil quieres ver')
                .setRequired(false)
        ),

    async execute(interaction) {
        try {
            const author = interaction.user;
            const targetUser = interaction.options.getUser('usuario') || author;

            const profile = await Profile.findOne({ userId: targetUser.id });
            const isOwn = targetUser.id === author.id;
            const isPartnerRelation = await isPartner(author.id, targetUser.id);
            const isPublic = profile?.isPublic || false;

            const userData = await User.findOne({ userId: targetUser.id });
            const moodLabel = userData?.currentMood?.name ? MOOD_LABELS[userData.currentMood.name] : null;

            if (!profile) {
                const embed = new EmbedBuilder()
                    .setColor('#8b0808')
                    .setTitle('🐾 Sin perfil aún')
                    .setDescription('¡Crea tu perfil con el botón!')
                    .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }));

                const components = isOwn ? [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('create_profile')
                            .setLabel('Crear perfil 🐾')
                            .setStyle(ButtonStyle.Success)
                    )
                ] : [];

                await interaction.reply({ embeds: [embed], components, ephemeral: !isOwn });

                if (isOwn) {
                    const message = await interaction.fetchReply();
                    const collector = message.createMessageComponentCollector({
                        filter: i => i.user.id === author.id,
                        time: 120000
                    });

                    collector.on('collect', async i => {
                        if (i.customId === 'create_profile') {
                            const modal = new ModalBuilder()
                                .setCustomId('create_profile_modal')
                                .setTitle('Crear perfil 🐾');

                            modal.addComponents(
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('characterName')
                                        .setLabel('Nombre del personaje')
                                        .setStyle(TextInputStyle.Short)
                                        .setRequired(true)
                                ),
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                        .setCustomId('description')
                                        .setLabel('Descripción')
                                        .setStyle(TextInputStyle.Paragraph)
                                        .setRequired(true)
                                )
                            );

                            await i.showModal(modal);

                            const modalSubmit = await i.awaitModalSubmit({
                                time: 120000,
                                filter: j => j.user.id === author.id
                            }).catch(() => null);

                            if (!modalSubmit) return;

                            const characterName = modalSubmit.fields.getTextInputValue('characterName');
                            const description = modalSubmit.fields.getTextInputValue('description');

                            const newProfile = new Profile({
                                userId: author.id,
                                characterName,
                                description,
                                isPublic: false
                            });
                            await newProfile.save();

                            const availableStats = getAvailableStats(author.id);
                            const statOptions = availableStats.map(stat => ({
                                label: stat.charAt(0).toUpperCase() + stat.slice(1),
                                value: stat,
                                description: `Desbloquear ${stat}`
                            }));

                            const statSelect = new StringSelectMenuBuilder()
                                .setCustomId('select_stats')
                                .setPlaceholder('Elige 4 stats (mínimo 4, máximo 4)')
                                .setMinValues(4)
                                .setMaxValues(4)
                                .addOptions(statOptions);

                            await modalSubmit.reply({
                                content: '🎲 Selecciona tus 4 stats iniciales:',
                                components: [new ActionRowBuilder().addComponents(statSelect)],
                                ephemeral: true
                            });

                            const statMsg = await modalSubmit.fetchReply();

                            const statResponse = await statMsg.awaitMessageComponent({
                                componentType: ComponentType.StringSelect,
                                time: 120000,
                                filter: k => k.user.id === author.id
                            }).catch(() => null);

                            if (!statResponse) return;

                            const selectedStats = statResponse.values;
                            await unlockStats(author.id, selectedStats);

                            const createdProfile = await Profile.findOne({ userId: author.id });
                            const createdEmbed = createProfileEmbed(createdProfile, author, moodLabel, true, false, false);
                            const createdComponents = createButtons(true, false, false);

                            await statResponse.update({
                                content: '✅ ¡Perfil creado exitosamente!',
                                embeds: [createdEmbed],
                                components: createdComponents
                            });
                        }
                    });
                }
                return;
            }

            const embed = createProfileEmbed(profile, targetUser, moodLabel, isOwn, isPartnerRelation, isPublic);
            const components = createButtons(isOwn, isPartnerRelation, isPublic);

            await interaction.reply({ embeds: [embed], components, ephemeral: !isOwn && !isPublic });

            if (components.length > 0) {
                const message = await interaction.fetchReply();
                const collector = message.createMessageComponentCollector({
                    filter: i => i.user.id === author.id,
                    time: 120000
                });

                collector.on('collect', async i => {
                    const targetId = targetUser.id;

                    if (i.customId === 'edit_texto') {
                        const currentProfile = await Profile.findOne({ userId: targetId });

                        const modal = new ModalBuilder()
                            .setCustomId('edit_texto_modal')
                            .setTitle('Editar texto 📝');

                        modal.addComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('characterName')
                                    .setLabel('Nombre del personaje')
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                                    .setValue(currentProfile.characterName || '')
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('description')
                                    .setLabel('Descripción')
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setRequired(true)
                                    .setValue(currentProfile.description || '')
                            )
                        );

                        await i.showModal(modal);

                        const modalSubmit = await i.awaitModalSubmit({
                            time: 120000,
                            filter: j => j.user.id === author.id
                        }).catch(() => null);

                        if (!modalSubmit) return;

                        const newName = modalSubmit.fields.getTextInputValue('characterName');
                        const newDesc = modalSubmit.fields.getTextInputValue('description');

                        await Profile.findOneAndUpdate(
                            { userId: targetId },
                            { characterName: newName, description: newDesc, updatedAt: new Date() }
                        );

                        await modalSubmit.reply({
                            content: '✅ Texto actualizado!',
                            ephemeral: true
                        });

                    } else if (i.customId === 'edit_imagen') {
                        await i.reply({
                            content: '📸 Adjunta la nueva imagen en tu próximo mensaje. Tienes 60 segundos.',
                            ephemeral: true
                        });

                        const imageResponse = await interaction.channel.awaitMessages({
                            max: 1,
                            time: 60000,
                            filter: msg => {
                                if (msg.author.id !== author.id) return false;
                                if (msg.attachments.size === 0) return false;
                                return msg.attachments.first().contentType?.startsWith('image/') ?? false;
                            }
                        }).catch(() => null);

                        if (!imageResponse || imageResponse.size === 0) {
                            return i.followUp({
                                content: '⏳ No se recibió ninguna imagen válida.',
                                ephemeral: true
                            });
                        }

                        const imageUrl = imageResponse.first().attachments.first().url;

                        await Profile.findOneAndUpdate(
                            { userId: targetId },
                            { image: imageUrl, updatedAt: new Date() }
                        );

                        await i.followUp({
                            content: '✅ Imagen actualizada! 🖼️',
                            ephemeral: true
                        });

                    } else if (i.customId === 'edit_stats') {
                        const availableStats = getAvailableStats(targetId);
                        const statOptions = availableStats.map(stat => ({
                            label: stat.charAt(0).toUpperCase() + stat.slice(1),
                            value: stat,
                            description: `Desbloquear ${stat}`
                        }));

                        const statSelect = new StringSelectMenuBuilder()
                            .setCustomId('edit_stats_select')
                            .setPlaceholder('Elige 4 stats')
                            .setMinValues(4)
                            .setMaxValues(4)
                            .addOptions(statOptions);

                        await i.reply({
                            content: '🎲 Selecciona tus 4 stats:',
                            components: [new ActionRowBuilder().addComponents(statSelect)],
                            ephemeral: true
                        });

                        const statMsg = await i.fetchReply();

                        const statResponse = await statMsg.awaitMessageComponent({
                            componentType: ComponentType.StringSelect,
                            time: 120000,
                            filter: k => k.user.id === author.id
                        }).catch(() => null);

                        if (!statResponse) return;

                        await unlockStats(targetId, statResponse.values);

                        await statResponse.update({
                            content: '✅ Stats actualizados!',
                            components: []
                        });

                    } else if (i.customId === 'toggle_privacy') {
                        const freshProfile = await Profile.findOne({ userId: targetId });
                        const newPublic = !freshProfile.isPublic;

                        await Profile.findOneAndUpdate(
                            { userId: targetId },
                            { isPublic: newPublic, updatedAt: new Date() }
                        );

                        const updatedProfile = await Profile.findOne({ userId: targetId });
                        const updatedEmbed = createProfileEmbed(updatedProfile, targetUser, moodLabel, true, false, newPublic);
                        const updatedComponents = createButtons(true, false, newPublic);

                        await message.edit({ embeds: [updatedEmbed], components: updatedComponents });

                        await i.reply({
                            content: `✅ Perfil ahora es ${newPublic ? 'público 🌐' : 'privado 🔒'}.`,
                            ephemeral: true
                        });
                    }
                });
            }

        } catch (error) {
            console.error(error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'Hubo un error al mostrar el perfil.', ephemeral: true });
            }
        }
    }
};