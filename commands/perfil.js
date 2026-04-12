const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const Profile = require('../models/Profile');
const Relationship = require('../models/Relationship');

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
                        ? 'No has creado un perfil aún. Usa /editar-perfil para crear uno 🐾'
                        : `${targetUser.username} no tiene un perfil creado aún. 🐯🐶`,
                    ephemeral: true
                });
            }

            const profileEmbed = new EmbedBuilder()
                .setColor('#8b0808')
                .setTitle(profile.characterName)
                .setDescription(profile.description)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: targetUser.username })
                .setTimestamp();

            if (profile.image) profileEmbed.setImage(profile.image);

            // 💕 Verificar si tienen relación aceptada para mostrar botón
            const components = [];

            if (targetUser.id !== author.id) {
                const relationship = await Relationship.findOne({
                    $or: [
                        { user1: author.id, user2: targetUser.id },
                        { user1: targetUser.id, user2: author.id }
                    ],
                    status: 'accepted'
                });

                if (relationship) {
                    const editButton = new ButtonBuilder()
                        .setCustomId(`edit_partner_${targetUser.id}`)
                        .setLabel('Editar perfil de mi pareja 💕')
                        .setStyle(ButtonStyle.Primary);

                    components.push(new ActionRowBuilder().addComponents(editButton));
                }
            }

            await interaction.reply({
                embeds: [profileEmbed],
                components
            });

            // 🧠 Collector para el botón de editar pareja
            if (components.length > 0) {
                const message = await interaction.fetchReply();

                const collector = message.createMessageComponentCollector({
                    filter: i => i.user.id === author.id,
                    time: 60000
                });

                collector.on('collect', async i => {

                    // Abrir modal de edición pero para el perfil del target
                    const modal = new ModalBuilder()
                        .setCustomId(`partnerEditModal_${targetUser.id}`)
                        .setTitle(`Editando perfil de ${targetUser.username} 💕`);

                    const characterNameInput = new TextInputBuilder()
                        .setCustomId('characterName')
                        .setLabel('Nombre del personaje')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setValue(profile.characterName || '');

                    const descriptionInput = new TextInputBuilder()
                        .setCustomId('description')
                        .setLabel('Descripción')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                        .setValue(profile.description || '');

                    modal.addComponents(
                        new ActionRowBuilder().addComponents(characterNameInput),
                        new ActionRowBuilder().addComponents(descriptionInput)
                    );

                    await i.showModal(modal);

                    // Esperar respuesta del modal
                    const modalSubmit = await i.awaitModalSubmit({
                        time: 60000,
                        filter: j => j.user.id === author.id
                    }).catch(() => null);

                    if (!modalSubmit) return;

                    // Guardar en el perfil del TARGET no del author
                    await Profile.findOneAndUpdate(
                        { userId: targetUser.id },
                        {
                            characterName: modalSubmit.fields.getTextInputValue('characterName'),
                            description: modalSubmit.fields.getTextInputValue('description'),
                            updatedAt: new Date()
                        },
                        { upsert: true, new: true }
                    );

                    const updatedEmbed = new EmbedBuilder()
                        .setColor('#8b0808')
                        .setTitle(modalSubmit.fields.getTextInputValue('characterName'))
                        .setDescription(modalSubmit.fields.getTextInputValue('description'))
                        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
                        .setFooter({ text: `Editado por ${author.username} con amor 💕` })
                        .setTimestamp();

                    if (profile.image) updatedEmbed.setImage(profile.image);

                    await modalSubmit.reply({
                        embeds: [updatedEmbed],
                        ephemeral: true
                    });

                    collector.stop();
                });
            }

        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'Hubo un error al mostrar el perfil.',
                ephemeral: true
            });
        }
    }
};