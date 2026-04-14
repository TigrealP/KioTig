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

function createButtons({ isOwn, isPartnerRelation, isPublic, isPostCreation = false, hasExportedProfiles = false }) {
    const components = [];

    if (isPostCreation) {
        components.push(
            new ActionRowBuilder().addComponents(
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
        return components;
    }

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
        components.push(
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('export_profile')
                    .setLabel('Exportar perfil 📦')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('import_profile')
                    .setLabel('Importar perfil 📥')
                    .setStyle(ButtonStyle.Secondary),
                ...(hasExportedProfiles ? [
                    new ButtonBuilder()
                        .setCustomId('delete_exported_profiles')
                        .setLabel('Eliminar exportados 🗑️')
                        .setStyle(ButtonStyle.Danger)
                ] : [])
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
            const components = createButtons({ isOwn, isPartnerRelation, isPublic, hasExportedProfiles: profile?.exportedProfiles?.length > 0 || false });

            await interaction.reply({ embeds: [embed], components, ephemeral: !isOwn && !isPublic });

            if (components.length > 0) {
                const message = await interaction.fetchReply();
                const collector = message.createMessageComponentCollector({
                    filter: i => i.user.id === author.id,
                    time: 120000
                });

                collector.on('collect', async i => {
                    const targetId = targetUser.id;

                    // ────── EXPORTAR ──────
                    if (i.customId === 'export_profile') {
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
                                // Si hay imagen, la subimos a Cloudinary
                                if (current.exportedProfiles && current.exportedProfiles.length > 0) {
                                    // Limpiar imágenes anteriores si es necesario, pero por ahora solo agregamos
                                }
                                const uploadResult = await uploadFromUrl(
                                    current.image,
                                    `profile_${targetId}_${Date.now()}`
                                );
                                imageUrl = uploadResult.url;
                                publicId = uploadResult.publicId;
                            }

                            // Agregar nueva exportación al array
                            const newExport = {
                                name: current.characterName,
                                description: current.description,
                                image: imageUrl,
                                publicId: publicId,
                                exportedAt: new Date()
                            };

                            await Profile.findOneAndUpdate(
                                { userId: targetId },
                                {
                                    $push: { exportedProfiles: newExport }
                                },
                                { upsert: true }
                            );

                            await i.editReply({
                                content: `🐶🐯🧡 Perfil exportado correctamente 📦\n\n**Nombre:** ${current.characterName}\n**Descripción:** ${current.description}${imageUrl ? `\n**Imagen guardada en:** ${imageUrl}` : ''}\n\nPuedes ver tus exportaciones con el botón **Importar perfil 📥**`
                            });

                        } catch (err) {
                            console.error('Error exportando perfil:', err);
                            await i.editReply({
                                content: '🐯🐶💔 Ocurrió un error al exportar el perfil. Revisa que la URL de tu imagen sea accesible públicamente.'
                            });
                        }
                    }

                    // ────── IMPORTAR ──────
                    else if (i.customId === 'import_profile') {
                        const current = await Profile.findOne({ userId: targetId });

                        if (!current.exportedProfiles || current.exportedProfiles.length === 0) {
                            return i.reply({
                                content: '🐶🐯💔 No tienes ningún perfil exportado. Usa **Exportar perfil 📦** primero.',
                                ephemeral: true
                            });
                        }

                        // Crear opciones para el select menu
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
                            filter: k => k.user.id === author.id
                        }).catch(() => null);

                        if (!selectResponse) return;

                        const selectedIndex = parseInt(selectResponse.values[0].split('_')[1]);
                        const selectedExport = current.exportedProfiles[selectedIndex];

                        await Profile.findOneAndUpdate(
                            { userId: targetId },
                            {
                                characterName: selectedExport.name,
                                description:   selectedExport.description,
                                image:         selectedExport.image,
                                updatedAt:     new Date()
                            }
                        );

                        const updatedProfile = await Profile.findOne({ userId: targetId });
                        const updatedEmbed = createProfileEmbed(updatedProfile, targetUser, moodLabel);

                        await message.edit({ embeds: [updatedEmbed] });

                        await selectResponse.reply({
                            content: `🐶🐯🧡 Perfil restaurado desde la exportación del ${selectedExport.exportedAt.toLocaleDateString('es-ES')} 📥`,
                            ephemeral: true
                        });
                    }

                    // ────── ELIMINAR EXPORTADOS ──────
                    else if (i.customId === 'delete_exported_profiles') {
                        const current = await Profile.findOne({ userId: targetId });

                        if (!current.exportedProfiles || current.exportedProfiles.length === 0) {
                            return i.reply({
                                content: '🐶🐯💔 No tienes ningún perfil exportado para eliminar.',
                                ephemeral: true
                            });
                        }

                        // Crear opciones para el select menu (múltiple selección)
                        const options = current.exportedProfiles.map((exp, index) => ({
                            label: exp.name,
                            description: `Exportado el ${exp.exportedAt.toLocaleDateString('es-ES')} ${exp.image ? '(con imagen)' : '(sin imagen)'}`,
                            value: `delete_${index}`
                        }));

                        const selectMenu = new StringSelectMenuBuilder()
                            .setCustomId('select_delete_profiles')
                            .setPlaceholder('Selecciona los perfiles a eliminar')
                            .setMinValues(1)
                            .setMaxValues(current.exportedProfiles.length)
                            .addOptions(options);

                        await i.reply({
                            content: '🗑️ Selecciona los perfiles exportados que quieres eliminar:',
                            components: [new ActionRowBuilder().addComponents(selectMenu)],
                            ephemeral: true
                        });

                        const selectMsg = await i.fetchReply();

                        const selectResponse = await selectMsg.awaitMessageComponent({
                            componentType: ComponentType.StringSelect,
                            time: 120000,
                            filter: k => k.user.id === author.id
                        }).catch(() => null);

                        if (!selectResponse) return;

                        const indicesToDelete = selectResponse.values.map(v => parseInt(v.split('_')[1])).sort((a, b) => b - a); // Orden descendente para eliminar sin problemas de índice

                        let deletedCount = 0;
                        for (const index of indicesToDelete) {
                            const exp = current.exportedProfiles[index];
                            if (exp.publicId) {
                                try {
                                    await deleteImage(exp.publicId);
                                } catch (err) {
                                    console.error('Error eliminando imagen de Cloudinary:', err);
                                }
                            }
                            current.exportedProfiles.splice(index, 1);
                            deletedCount++;
                        }

                        await Profile.findOneAndUpdate(
                            { userId: targetId },
                            { exportedProfiles: current.exportedProfiles }
                        );

                        // Actualizar el embed si es necesario
                        const updatedProfile = await Profile.findOne({ userId: targetId });
                        const updatedEmbed = createProfileEmbed(updatedProfile, targetUser, moodLabel);
                        const updatedComponents = createButtons({
                            isOwn: true,
                            isPartnerRelation: false,
                            isPublic: updatedProfile.isPublic,
                            hasExportedProfiles: updatedProfile.exportedProfiles.length > 0
                        });

                        await message.edit({ embeds: [updatedEmbed], components: updatedComponents });

                        await selectResponse.reply({
                            content: `🗑️ Eliminados ${deletedCount} perfil(es) exportado(s).`,
                            ephemeral: true
                        });
                    }

                    // ────── EDITAR TEXTO ──────
                    else if (i.customId === 'edit_texto') {
                        await i.deferReply({ ephemeral: true });

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

                        await Profile.findOneAndUpdate(
                            { userId: targetId },
                            {
                                characterName: modalSubmit.fields.getTextInputValue('characterName'),
                                description:   modalSubmit.fields.getTextInputValue('description'),
                                updatedAt:     new Date()
                            }
                        );

                        const updatedProfile = await Profile.findOne({ userId: targetId });
                        const updatedEmbed = createProfileEmbed(updatedProfile, targetUser, moodLabel);

                        await message.edit({ embeds: [updatedEmbed] });

                        await modalSubmit.reply({ content: '✅ Texto actualizado!', ephemeral: true });
                    }

                    // ────── EDITAR IMAGEN ──────
                    else if (i.customId === 'edit_imagen') {
                        await i.reply({
                            content: '🐯📸🐶 Adjunta la nueva imagen en tu próximo mensaje. Tienes 60 segundos.',
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
                            return i.followUp({ content: '⏳ No se recibió ninguna imagen válida.', ephemeral: true });
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
                    else if (i.customId === 'edit_stats') {
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

                        const updatedProfile = await Profile.findOne({ userId: targetId });
                        const updatedEmbed = createProfileEmbed(updatedProfile, targetUser, moodLabel);

                        await message.edit({ embeds: [updatedEmbed] });

                        await statResponse.update({ content: '🐶🐯🧡 Stats actualizados!', components: [] });
                    }

                    // ────── TOGGLE PRIVACIDAD ──────
                    else if (i.customId === 'toggle_privacy') {
                        const freshProfile = await Profile.findOne({ userId: targetId });
                        const newPublic = !freshProfile.isPublic;

                        await Profile.findOneAndUpdate(
                            { userId: targetId },
                            { isPublic: newPublic, updatedAt: new Date() }
                        );

                        const updatedProfile = await Profile.findOne({ userId: targetId });
                        const updatedEmbed = createProfileEmbed(updatedProfile, targetUser, moodLabel);
                        const updatedComponents = createButtons({ isOwn: true, isPartnerRelation: false, isPublic: newPublic, hasExportedProfiles: updatedProfile?.exportedProfiles?.length > 0 || false });

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