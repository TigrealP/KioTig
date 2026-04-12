const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Profile = require('../models/Profile');
const Relationship = require('../models/Relationship');
const User = require('../models/User');
const { formatStats } = require('../utils/stats');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

function getRoleIcon(userId) {
    if (userId === TU_ID) return '🐯';
    if (userId === NOVIO_ID) return '🐶';
    return '🦊';
}

const MOOD_LABELS = {
    mimoso:    'Mimoso 🐯🧡🐶',
    needy:     'Needy 🥀',
    celoso:    'Celoso 😡',
    dominante: 'Dominante 🐯',
    sumiso:    'Sumiso 🐶'
};

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

            if (!profile) {
                return interaction.reply({
                    content: targetUser.id === author.id
                        ? 'No has creado un perfil aún. Usa `/editar-perfil texto` para crear uno 🐾'
                        : `${targetUser.username} no tiene un perfil creado aún. 🐯🐶`,
                    ephemeral: true
                });
            }

            // 🌙 Mood actual
            const userData = await User.findOne({ userId: targetUser.id });
            const moodLabel = userData?.currentMood?.name
                ? MOOD_LABELS[userData.currentMood.name]
                : null;

            // 📅 Footer
            const createdAt = profile.createdAt
                ? `Perfil creado el ${profile.createdAt.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}`
                : null;

            const footerText = [targetUser.username, createdAt].filter(Boolean).join('  •  ');

            // 📊 Stats (antes de construir la descripción)
            const hasStats = profile.stats &&
                Object.values(profile.stats).some(s => s.unlocked);

            // 🎨 Descripción estilizada
            const separator = '`─────────────────`';

            const descLines = [];

            descLines.push(`**•** ${profile.description || '*Sin descripción.*'}`);
            descLines.push('');

            if (moodLabel) {
                descLines.push(`**•** Estado actual: ${moodLabel}`);
                descLines.push('');
            }

            if (hasStats) {
                descLines.push(separator);
                descLines.push('**📊 Stats:**');
                descLines.push(formatStats(profile.stats));
                descLines.push(separator);
            }

            const embed = new EmbedBuilder()
                .setColor('#8b0808')
                .setTitle(`🐾 Perfil de ${profile.characterName || targetUser.username}`)
                .setDescription(descLines.join('\n'))
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: footerText, iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            if (profile.image) embed.setImage(profile.image);

            // ─── Botones editar (solo si es el perfil de otro) ───────────────
            const components = [];

            if (targetUser.id !== author.id) {
                components.push(
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId(`edit_partner_texto_${targetUser.id}`)
                            .setLabel('Editar texto 📝')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId(`edit_partner_imagen_${targetUser.id}`)
                            .setLabel('Editar imagen 🖼️')
                            .setStyle(ButtonStyle.Secondary)
                    )
                );
            }

            await interaction.reply({ embeds: [embed], components });

            // ─── Collector botones ────────────────────────────────────────────
            if (components.length > 0) {
                const message = await interaction.fetchReply();

                const collector = message.createMessageComponentCollector({
                    filter: i => i.user.id === author.id,
                    time: 60000,
                    max: 2
                });

                collector.on('collect', async i => {

                    // ✏️ Editar texto
                    if (i.customId === `edit_partner_texto_${targetUser.id}`) {

                        const modal = new ModalBuilder()
                            .setCustomId(`partnerEditModal_${targetUser.id}`)
                            .setTitle(`Editando perfil de ${targetUser.username} 💕`);

                        modal.addComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('characterName')
                                    .setLabel('Nombre del personaje')
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                                    .setValue(profile.characterName || '')
                            ),
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('description')
                                    .setLabel('Descripción')
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setRequired(true)
                                    .setValue(profile.description || '')
                            )
                        );

                        await i.showModal(modal);

                        const modalSubmit = await i.awaitModalSubmit({
                            time: 60000,
                            filter: j => j.user.id === author.id
                        }).catch(() => null);

                        if (!modalSubmit) return;

                        const newName = modalSubmit.fields.getTextInputValue('characterName');
                        const newDesc = modalSubmit.fields.getTextInputValue('description');

                        await Profile.findOneAndUpdate(
                            { userId: targetUser.id },
                            { characterName: newName, description: newDesc, updatedAt: new Date() },
                            { upsert: true }
                        );

                        const updatedProfile = await Profile.findOne({ userId: targetUser.id });
                        const updatedHasStats = updatedProfile?.stats &&
                            Object.values(updatedProfile.stats).some(s => s.unlocked);

                        const updatedDescLines = [];
                        updatedDescLines.push(`**•** ${newDesc || '*Sin descripción.*'}`);
                        updatedDescLines.push('');

                        if (updatedHasStats) {
                            updatedDescLines.push(separator);
                            updatedDescLines.push('**📊 Stats:**');
                            updatedDescLines.push(formatStats(updatedProfile.stats));
                            updatedDescLines.push(separator);
                        }

                        const updatedEmbed = new EmbedBuilder()
                            .setColor('#8b0808')
                            .setTitle(`🐾 Perfil de ${newName}`)
                            .setDescription(updatedDescLines.join('\n'))
                            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                            .setFooter({ text: `${targetUser.username}  •  Editado por ${author.username} con amor 💕`, iconURL: interaction.client.user.displayAvatarURL() })
                            .setTimestamp();

                        if (updatedProfile?.image) updatedEmbed.setImage(updatedProfile.image);

                        await modalSubmit.reply({
                            content: `✅ Perfil de ${targetUser.username} actualizado!`,
                            embeds: [updatedEmbed],
                            ephemeral: true
                        });
                    }

                    // 🖼️ Editar imagen
                    if (i.customId === `edit_partner_imagen_${targetUser.id}`) {

                        await i.reply({
                            content: `📸 Adjunta la imagen de **${targetUser.username}** en tu próximo mensaje. Tienes 60 segundos.`,
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
                                content: '⏳ No se recibió ninguna imagen válida a tiempo.',
                                ephemeral: true
                            });
                        }

                        const imageUrl = imageResponse.first().attachments.first().url;

                        await Profile.findOneAndUpdate(
                            { userId: targetUser.id },
                            { image: imageUrl, updatedAt: new Date() },
                            { upsert: true }
                        );

                        await i.followUp({
                            content: `✅ Imagen de ${targetUser.username} actualizada! 🖼️`,
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