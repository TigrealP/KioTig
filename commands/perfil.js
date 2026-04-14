const {
    SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle,
    ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle,
    StringSelectMenuBuilder, ComponentType
} = require('discord.js');
const { unlockStats, formatStats, FIXED_STATS, BLOCKED_STATS } = require('../utils/stats');
const { uploadFromUrl, deleteImage } = require('../utils/cloudinary');
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

async function canEditProfile(authorId, targetId, profile) {
    // El dueño siempre puede editar su perfil
    if (authorId === targetId) return true;
    
    // Si el perfil es privado, solo la pareja puede editar
    if (!profile.isPublic) {
        return await isPartner(authorId, targetId);
    }
    
    // Si es público, cualquiera puede editar texto e imagen
    return true;
}

async function canEditStats(authorId, targetId) {
    // Solo la pareja puede editar stats (nunca el dueño en otro perfil)
    if (authorId === targetId) return false;
    return await isPartner(authorId, targetId);
}

function getAvailableStats(userId) {
    const allStats = ['dominancia', 'sumision', 'afecto', 'picardía', 'lealtad', 'nostalgia', 'peso', 'deseo', 'dolor', 'control', 'apego'];
    const fixed = FIXED_STATS[userId];
    const blocked = BLOCKED_STATS[userId];
    return allStats.filter(s => s !== fixed && s !== blocked);
}

function createProfileEmbed(profile, targetUser, moodLabel) {
    const createdAt = profile.createdAt
        ? `Perfil creado el ${profile.createdAt.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}`
        : null;

    const footerParts = [targetUser.username, createdAt].filter(Boolean);

    if (profile.exportedProfiles && profile.exportedProfiles.length > 0) {
        footerParts.push(`${profile.exportedProfiles.length} exportación(es)`);
    }

    const footerText = footerParts.join('  •  ');
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

function createButtons({ isOwn, isPartnerRelation, isPublic, targetId, isPostCreation = false, hasExportedProfiles = false, canEdit = false, canEditStats = false }) {
    const components = [];

    if (isPostCreation) {
        components.push(
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`edit_imagen:${targetId}`)
                    .setLabel('Editar imagen 🖼️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`edit_stats:${targetId}`)
                    .setLabel('Editar stats 🎲')
                    .setStyle(ButtonStyle.Success)
            )
        );
        return components;
    }

    if (isOwn) {
        components.push(
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`edit_texto:${targetId}`)
                    .setLabel('Editar texto 📝')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`edit_imagen:${targetId}`)
                    .setLabel('Editar imagen 🖼️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`edit_stats:${targetId}`)
                    .setLabel('Editar stats 🎲')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`toggle_privacy:${targetId}`)
                    .setLabel(isPublic ? '🌐 Público' : '🔒 Privado')
                    .setStyle(ButtonStyle.Danger)
            )
        );
        components.push(
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`export_profile:${targetId}`)
                    .setLabel('Exportar perfil 📦')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`import_profile:${targetId}`)
                    .setLabel('Importar perfil 📥')
                    .setStyle(ButtonStyle.Secondary),
                ...(hasExportedProfiles ? [
                    new ButtonBuilder()
                        .setCustomId(`delete_exported_profiles:${targetId}`)
                        .setLabel('Eliminar exportados 🗑️')
                        .setStyle(ButtonStyle.Danger)
                ] : [])
            )
        );
    } else if (canEdit || canEditStats) {
        // Si puede editar algo (pareja o público)
        const editButtons = [];
        
        if (canEdit) {
            editButtons.push(
                new ButtonBuilder()
                    .setCustomId(`edit_texto:${targetId}`)
                    .setLabel('Editar texto 📝')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`edit_imagen:${targetId}`)
                    .setLabel('Editar imagen 🖼️')
                    .setStyle(ButtonStyle.Secondary)
            );
        }
        
        if (canEditStats) {
            editButtons.push(
                new ButtonBuilder()
                    .setCustomId(`edit_stats:${targetId}`)
                    .setLabel('Editar stats 🎲')
                    .setStyle(ButtonStyle.Success)
            );
        }

        if (editButtons.length > 0) {
            components.push(new ActionRowBuilder().addComponents(...editButtons));
        }
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
                    .setDescription(isOwn ? 'Aún no tienes perfil, ¡crea uno!' : 'Este usuario aún no tiene perfil creado.')
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

                            await unlockStats(author.id, statResponse.values);

                            const createdProfile = await Profile.findOne({ userId: author.id });
                            const createdEmbed = createProfileEmbed(createdProfile, author, moodLabel);
                            const createdComponents = createButtons({
                                isOwn: true,
                                isPartnerRelation: false,
                                isPublic: false,
                                targetId: author.id,
                                isPostCreation: true,
                                hasExportedProfiles: false
                            });

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

            const embed = createProfileEmbed(profile, targetUser, moodLabel);
            const canEditThisProfile = isOwn || isPublic || isPartnerRelation;
            const canEditStatsThisProfile = isOwn || isPartnerRelation;
            const components = createButtons({
                isOwn,
                isPartnerRelation,
                isPublic,
                targetId: targetUser.id,
                hasExportedProfiles: profile?.exportedProfiles?.length > 0 || false,
                canEdit: canEditThisProfile,
                canEditStats: canEditStatsThisProfile
            });

            await interaction.reply({ embeds: [embed], components, ephemeral: !isOwn && !isPublic });

            if (components.length > 0) {
                const message = await interaction.fetchReply();
                const collector = message.createMessageComponentCollector({
                    filter: i => i.user.id === author.id,
                    time: 120000
                });

                collector.on('collect', async i => {
                    try {
                        const authorId = author.id;
                        const [action, buttonTargetId] = i.customId.split(':');
                        const targetId = buttonTargetId || targetUser.id;
                        const isEditingOwnProfile = authorId === targetId;

                        // ────── EXPORTAR PERFIL ──────
                        if (action === 'export_profile') {
                            // Solo el dueño puede exportar su perfil
                            if (!isEditingOwnProfile) {
                                return i.reply({
                                    content: '❌ Solo puedes exportar tu propio perfil.',
                                    ephemeral: true
                                });
                            }

                            await i.deferReply({ ephemeral: true });
                            const current = await Profile.findOne({ userId: targetId });

                            if (!current.characterName || !current.description) {
                                return i.editReply({
                                    content: '🐯🐶💔 Tu perfil necesita nombre y descripción para exportar.'
                                });
                            }

                            try {
                                let imageUrl = null;
                                let publicId = null;

                                if (current.image) {
                                    const uploadResult = await uploadFromUrl(
                                        current.image,
                                        `profile_${targetId}_${Date.now()}`
                                    );
                                    imageUrl = uploadResult.url;
                                    publicId = uploadResult.publicId;
                                }

                                await Profile.findOneAndUpdate(
                                    { userId: targetId },
                                    {
                                        $push: {
                                            exportedProfiles: {
                                                name: current.characterName,
                                                description: current.description,
                                                image: imageUrl,
                                                publicId: publicId,
                                                exportedAt: new Date()
                                            }
                                        }
                                    }
                                );

                                await i.editReply({
                                    content: `🐶🐯🧡 Perfil exportado correctamente 📦\n\n**Nombre:** ${current.characterName}\n**Descripción:** ${current.description}${imageUrl ? `\n**Imagen guardada en:** ${imageUrl}` : ''}`
                                });
                            } catch (err) {
                                console.error('Error exportando perfil:', err);
                                await i.editReply({
                                    content: '🐯🐶💔 Ocurrió un error al exportar el perfil.'
                                });
                            }
                        }

                        // ────── IMPORTAR PERFIL ──────
                        else if (action === 'import_profile') {
                            // Solo el dueño puede importar sus perfiles
                            if (!isEditingOwnProfile) {
                                return i.reply({
                                    content: '❌ Solo puedes importar tus propios perfiles.',
                                    ephemeral: true
                                });
                            }

                            const current = await Profile.findOne({ userId: targetId });

                            if (!current.exportedProfiles || current.exportedProfiles.length === 0) {
                                return i.reply({
                                    content: '🐶🐯💔 No tienes ningún perfil exportado. Usa **Exportar perfil 📦** primero.',
                                    ephemeral: true
                                });
                            }

                            const options = current.exportedProfiles.map((exp, index) => ({
                                label: exp.name,
                                description: exp.description.length > 50 ? exp.description.substring(0, 47) + '...' : exp.description,
                                value: `import_${index}`,
                                emoji: exp.image ? '🖼️' : '📝'
                            }));

                            const selectMenu = new StringSelectMenuBuilder()
                                .setCustomId('select_import_profile')
                                .setPlaceholder('Selecciona un perfil para importar')
                                .addOptions(options);

                            await i.reply({
                                content: '📥 Selecciona el perfil que quieres importar:',
                                components: [new ActionRowBuilder().addComponents(selectMenu)],
                                ephemeral: true
                            });

                            const selectMsg = await i.fetchReply();
                            const selectResponse = await selectMsg.awaitMessageComponent({
                                componentType: ComponentType.StringSelect,
                                time: 120000,
                                filter: k => k.user.id === authorId
                            }).catch(() => null);

                            if (!selectResponse) return;

                            const selectedIndex = parseInt(selectResponse.values[0].split('_')[1]);
                            const selectedExport = current.exportedProfiles[selectedIndex];

                            await Profile.findOneAndUpdate(
                                { userId: targetId },
                                {
                                    characterName: selectedExport.name,
                                    description: selectedExport.description,
                                    image: selectedExport.image,
                                    updatedAt: new Date()
                                }
                            );

                            const updatedProfile = await Profile.findOne({ userId: targetId });
                            const updatedEmbed = createProfileEmbed(updatedProfile, targetUser, moodLabel);
                            await message.edit({ embeds: [updatedEmbed] });

                            await selectResponse.reply({
                                content: `🐶🐯🧡 Perfil restaurado del ${selectedExport.exportedAt.toLocaleDateString('es-ES')} 📥`,
                                ephemeral: true
                            });
                        }

                        // ────── ELIMINAR EXPORTADOS ──────
                        else if (action === 'delete_exported_profiles') {
                            if (!isEditingOwnProfile) {
                                return i.reply({
                                    content: '❌ Solo puedes eliminar tus propias exportaciones.',
                                    ephemeral: true
                                });
                            }

                            const current = await Profile.findOne({ userId: targetId });

                            if (!current.exportedProfiles || current.exportedProfiles.length === 0) {
                                return i.reply({
                                    content: '🐶🐯💔 No tienes ningún perfil exportado para eliminar.',
                                    ephemeral: true
                                });
                            }

                            const options = current.exportedProfiles.map((exp, index) => ({
                                label: exp.name,
                                description: `${exp.exportedAt.toLocaleDateString('es-ES')} ${exp.image ? '(con imagen)' : ''}`,
                                value: `delete_${index}`
                            }));

                            const selectMenu = new StringSelectMenuBuilder()
                                .setCustomId('select_delete_profiles')
                                .setPlaceholder('Selecciona los perfiles a eliminar')
                                .setMinValues(1)
                                .setMaxValues(current.exportedProfiles.length)
                                .addOptions(options);

                            await i.reply({
                                content: '🗑️ Selecciona los perfiles a eliminar:',
                                components: [new ActionRowBuilder().addComponents(selectMenu)],
                                ephemeral: true
                            });

                            const selectMsg = await i.fetchReply();
                            const selectResponse = await selectMsg.awaitMessageComponent({
                                componentType: ComponentType.StringSelect,
                                time: 120000,
                                filter: k => k.user.id === authorId
                            }).catch(() => null);

                            if (!selectResponse) return;

                            const indicesToDelete = selectResponse.values.map(v => parseInt(v.split('_')[1])).sort((a, b) => b - a);
                            
                            for (const index of indicesToDelete) {
                                const exp = current.exportedProfiles[index];
                                if (exp.publicId) {
                                    try {
                                        await deleteImage(exp.publicId);
                                    } catch (err) {
                                        console.error('Error eliminando imagen:', err);
                                    }
                                }
                                current.exportedProfiles.splice(index, 1);
                            }

                            await Profile.findOneAndUpdate(
                                { userId: targetId },
                                { exportedProfiles: current.exportedProfiles }
                            );

                            const updatedProfile = await Profile.findOne({ userId: targetId });
                            const updatedEmbed = createProfileEmbed(updatedProfile, targetUser, moodLabel);
                            const newCanEditStats = isEditingOwnProfile || isPartnerRelation;
                            const updatedComponents = createButtons({
                                isOwn: isEditingOwnProfile,
                                isPartnerRelation,
                                isPublic: updatedProfile.isPublic,
                                targetId,
                                canEdit: isEditingOwnProfile,
                                canEditStats: newCanEditStats,
                                hasExportedProfiles: updatedProfile.exportedProfiles.length > 0
                            });

                            await message.edit({ embeds: [updatedEmbed], components: updatedComponents });

                            await selectResponse.reply({
                                content: `🗑️ Eliminados ${indicesToDelete.length} perfil(es).`,
                                ephemeral: true
                            });
                        }

                        // ────── EDITAR TEXTO ──────
                        else if (action === 'edit_texto') {
                            // Validar permisos
                            if (!isEditingOwnProfile && !isPublic && !isPartnerRelation) {
                                return i.reply({
                                    content: '❌ No tienes permiso para editar este perfil.',
                                    ephemeral: true
                                });
                            }

                            const currentProfile = await Profile.findOne({ userId: targetId });

                            const modalCustomId = `edit_texto_modal:${targetId}:${i.id}`;
                            const modal = new ModalBuilder()
                                .setCustomId(modalCustomId)
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
                                filter: j => j.user.id === authorId && j.customId === modalCustomId
                            }).catch(() => null);

                            if (!modalSubmit) return;

                            await Profile.findOneAndUpdate(
                                { userId: targetId },
                                {
                                    characterName: modalSubmit.fields.getTextInputValue('characterName'),
                                    description: modalSubmit.fields.getTextInputValue('description'),
                                    updatedAt: new Date()
                                }
                            );

                            const updatedProfile = await Profile.findOne({ userId: targetId });
                            const updatedEmbed = createProfileEmbed(updatedProfile, targetUser, moodLabel);
                            await message.edit({ embeds: [updatedEmbed] });

                            await modalSubmit.reply({
                                content: '✅ Texto actualizado!',
                                ephemeral: true
                            });
                        }

                        // ────── EDITAR IMAGEN ──────
                        else if (action === 'edit_imagen') {
                            // Validar permisos
                            if (!isEditingOwnProfile && !isPublic && !isPartnerRelation) {
                                return i.reply({
                                    content: '❌ No tienes permiso para editar este perfil.',
                                    ephemeral: true
                                });
                            }

                            await i.reply({
                                content: '🐯📸🐶 Adjunta la nueva imagen. Tienes 60 segundos.',
                                ephemeral: true
                            });

                            const imageResponse = await interaction.channel.awaitMessages({
                                max: 1,
                                time: 60000,
                                filter: msg => {
                                    if (msg.author.id !== authorId) return false;
                                    if (msg.attachments.size === 0) return false;
                                    return msg.attachments.first().contentType?.startsWith('image/') ?? false;
                                }
                            }).catch(() => null);

                            if (!imageResponse || imageResponse.size === 0) {
                                return i.followUp({ content: '⏳ No se recibió imagen válida.', ephemeral: true });
                            }

                            await Profile.findOneAndUpdate(
                                { userId: targetId },
                                { image: imageResponse.first().attachments.first().url, updatedAt: new Date() }
                            );

                            const updatedProfile = await Profile.findOne({ userId: targetId });
                            const updatedEmbed = createProfileEmbed(updatedProfile, targetUser, moodLabel);
                            await message.edit({ embeds: [updatedEmbed] });

                            await i.followUp({ content: '✅ Imagen actualizada! 🖼️', ephemeral: true });
                        }

                        // ────── EDITAR STATS ──────
                        else if (action === 'edit_stats') {
                            // Solo el dueño y su pareja pueden editar stats
                            const canEditStatsProfile = isEditingOwnProfile || isPartnerRelation;
                            
                            if (!canEditStatsProfile) {
                                return i.reply({
                                    content: '❌ Solo tu pareja o tú mismo puedes editar los stats.',
                                    ephemeral: true
                                });
                            }

                            const availableStats = getAvailableStats(targetId);
                            const statOptions = availableStats.map(stat => ({
                                label: stat.charAt(0).toUpperCase() + stat.slice(1),
                                value: stat,
                                description: `Desbloquear ${stat}`
                            }));

                            if (statOptions.length === 0) {
                                return i.reply({
                                    content: '❌ No hay más stats disponibles para desbloquear.',
                                    ephemeral: true
                                });
                            }

                            const statSelect = new StringSelectMenuBuilder()
                                .setCustomId('edit_stats_select')
                                .setPlaceholder('Elige 4 stats')
                                .setMinValues(4)
                                .setMaxValues(4)
                                .addOptions(statOptions);

                            await i.reply({
                                content: '🎲 Selecciona 4 stats:',
                                components: [new ActionRowBuilder().addComponents(statSelect)],
                                ephemeral: true
                            });

                            const statMsg = await i.fetchReply();
                            const statResponse = await statMsg.awaitMessageComponent({
                                componentType: ComponentType.StringSelect,
                                time: 120000,
                                filter: k => k.user.id === authorId
                            }).catch(() => null);

                            if (!statResponse) return;

                            await unlockStats(targetId, statResponse.values);

                            const updatedProfile = await Profile.findOne({ userId: targetId });
                            const updatedEmbed = createProfileEmbed(updatedProfile, targetUser, moodLabel);
                            await message.edit({ embeds: [updatedEmbed] });

                            await statResponse.update({ content: '🐶🐯🧡 Stats actualizados!', components: [] });
                        }

                        // ────── TOGGLE PRIVACIDAD ──────
                        else if (action === 'toggle_privacy') {
                            // Solo el dueño puede cambiar privacidad
                            if (!isEditingOwnProfile) {
                                return i.reply({
                                    content: '❌ Solo el dueño puede cambiar la privacidad del perfil.',
                                    ephemeral: true
                                });
                            }

                            const freshProfile = await Profile.findOne({ userId: targetId });
                            const newPublic = !freshProfile.isPublic;

                            await Profile.findOneAndUpdate(
                                { userId: targetId },
                                { isPublic: newPublic, updatedAt: new Date() }
                            );

                            const updatedProfile = await Profile.findOne({ userId: targetId });
                            const updatedEmbed = createProfileEmbed(updatedProfile, targetUser, moodLabel);
                            const updatedComponents = createButtons({
                                isOwn: true,
                                isPartnerRelation: false,
                                isPublic: newPublic,
                                targetId,
                                hasExportedProfiles: updatedProfile.exportedProfiles.length > 0,
                                canEdit: true,
                                canEditStats: true
                            });

                            await message.edit({ embeds: [updatedEmbed], components: updatedComponents });

                            await i.reply({
                                content: `✅ Perfil ahora es ${newPublic ? 'público 🌐' : 'privado 🔒'}.`,
                                ephemeral: true
                            });
                        }
                    } catch (error) {
                        console.error('Error en handler del perfil:', error);
                        if (!i.replied && !i.deferred) {
                            await i.reply({
                                content: '❌ Ocurrió un error al procesar tu solicitud.',
                                ephemeral: true
                            });
                        }
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
