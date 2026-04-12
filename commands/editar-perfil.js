const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Profile = require('../models/Profile');
const { unlockStats, formatStats } = require('../utils/stats');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

// 📊 Stats disponibles para elegir
const AVAILABLE_STATS = [
    { label: '❤️ Afecto', description: 'Qué tan cariñoso y amoroso eres', value: 'afecto' },
    { label: '😈 Picardía', description: 'Qué tan travieso y juguetón eres', value: 'picardía' },
    { label: '💎 Lealtad', description: 'Qué tan fiel y constante eres', value: 'lealtad' },
    { label: '🌙 Nostalgia', description: 'Qué tan apegado a los momentos vividos eres', value: 'nostalgia' },
    { label: '🍖 Peso', description: 'Qué tan bien alimentado estás', value: 'peso' },
    { label: '🫦 Deseo', description: 'Qué tan excitado estás en este momento', value: 'deseo' },
    { label: '🤕 Dolor', description: 'Qué tan castigado estás', value: 'dolor' },
    { label: '🔒 Control', description: 'Qué tan dominado estás', value: 'control' },
    { label: '🧸 Apego', description: 'Qué tan dependiente y pegajoso eres', value: 'apego' }
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('editar-perfil')
        .setDescription('Edita tu perfil 🐾')
        .addSubcommand(sub =>
            sub
                .setName('texto')
                .setDescription('Edita tu nombre y descripción')
        )
        .addSubcommand(sub =>
            sub
                .setName('imagen')
                .setDescription('Cambia tu imagen de perfil')
        ),

    async execute(interaction) {
        try {
            const subcommand = interaction.options.getSubcommand();
            const currentProfile = await Profile.findOne({ userId: interaction.user.id });

            // 📝 SUBCOMANDO: texto
            if (subcommand === 'texto') {

                const modal = new ModalBuilder()
                    .setCustomId('profileEditModal')
                    .setTitle('Editar Perfil 🐾');

                const characterNameInput = new TextInputBuilder()
                    .setCustomId('characterName')
                    .setLabel('Nombre del personaje')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setValue(currentProfile?.characterName || '');

                const descriptionInput = new TextInputBuilder()
                    .setCustomId('description')
                    .setLabel('Descripción')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setValue(currentProfile?.description || '');

                modal.addComponents(
                    new ActionRowBuilder().addComponents(characterNameInput),
                    new ActionRowBuilder().addComponents(descriptionInput)
                );

                await interaction.showModal(modal);

                const modalSubmit = await interaction.awaitModalSubmit({
                    time: 60000,
                    filter: i => i.user.id === interaction.user.id
                }).catch(() => null);

                if (!modalSubmit) return;

                const characterName = modalSubmit.fields.getTextInputValue('characterName');
                const description = modalSubmit.fields.getTextInputValue('description');

                // 🎲 Si es la primera vez, pedir selección de stats
                const isFirstTime = !currentProfile || 
                    !Object.values(currentProfile.stats || {}).some(s => s.unlocked);

                if (isFirstTime) {

                    // Determinar stat fija
                    const fixedStat = interaction.user.id === TU_ID
                        ? '🐯 Dominancia'
                        : interaction.user.id === NOVIO_ID
                            ? '🐶 Sumisión'
                            : null;

                    const fixedStatText = fixedStat
                        ? `\n\nTu stat fija es **${fixedStat}** y se activará automáticamente.`
                        : '';

                    const menu = new StringSelectMenuBuilder()
                        .setCustomId('selectStats')
                        .setPlaceholder('Elige exactamente 3 stats...')
                        .setMinValues(3)
                        .setMaxValues(3)
                        .addOptions(AVAILABLE_STATS);

                    const row = new ActionRowBuilder().addComponents(menu);

                    await modalSubmit.reply({
                        content: `🎲 **¡Primera vez!** Elige las **3 stats** que definirán a tu personaje.${fixedStatText}`,
                        components: [row],
                        ephemeral: true
                    });

                    // Esperar selección
                    const message = await modalSubmit.fetchReply();
                    const collector = message.createMessageComponentCollector({
                        filter: i => i.user.id === interaction.user.id,
                        time: 60000
                    });

                    collector.on('collect', async i => {

                        const selectedStats = i.values;

                        // Guardar perfil y desbloquear stats
                        await Profile.findOneAndUpdate(
                            { userId: interaction.user.id },
                            { characterName, description, updatedAt: new Date() },
                            { upsert: true, new: true }
                        );

                        await unlockStats(interaction.user.id, selectedStats);

                        // Recargar perfil para mostrar stats
                        const updatedProfile = await Profile.findOne({ userId: interaction.user.id });

                        const updatedEmbed = new EmbedBuilder()
                            .setColor('#8b0808')
                            .setTitle(characterName)
                            .setDescription(description)
                            .addFields({
                                name: '📊 Stats',
                                value: formatStats(updatedProfile.stats)
                            })
                            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                            .setFooter({ text: interaction.user.username })
                            .setTimestamp();

                        await i.update({
                            content: '✅ ¡Perfil creado!',
                            embeds: [updatedEmbed],
                            components: []
                        });

                        collector.stop();
                    });

                    collector.on('end', async (_, reason) => {
                        if (reason === 'time') {
                            await modalSubmit.editReply({
                                content: '⏳ Tiempo agotado. Usa /editar-perfil texto de nuevo.',
                                components: []
                            }).catch(() => {});
                        }
                    });

                } else {

                    // Si ya tiene perfil, solo actualizar texto
                    await Profile.findOneAndUpdate(
                        { userId: interaction.user.id },
                        { characterName, description, updatedAt: new Date() },
                        { upsert: true, new: true }
                    );

                    const updatedEmbed = new EmbedBuilder()
                        .setColor('#8b0808')
                        .setTitle(characterName)
                        .setDescription(description)
                        .addFields({
                            name: '📊 Stats',
                            value: formatStats(currentProfile.stats)
                        })
                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                        .setFooter({ text: interaction.user.username })
                        .setTimestamp();

                    await modalSubmit.reply({
                        content: '✅ ¡Perfil actualizado!',
                        embeds: [updatedEmbed],
                        flags: 64
                    });
                }
            }

            // 🖼️ SUBCOMANDO: imagen
            if (subcommand === 'imagen') {

                await interaction.reply({
                    content: '📸 Adjunta tu imagen en tu **próximo mensaje** en este canal. Tienes 60 segundos.',
                    flags: 64
                });

                const imageResponse = await interaction.channel.awaitMessages({
                    max: 1,
                    time: 60000,
                    filter: msg =>
                        msg.author.id === interaction.user.id &&
                        msg.attachments.size > 0
                }).catch(() => null);

                if (!imageResponse || imageResponse.size === 0) {
                    return await interaction.followUp({
                        content: '⏳ No se recibió ninguna imagen a tiempo.',
                        flags: 64
                    });
                }

                const imageUrl = imageResponse.first().attachments.first().url;

                await Profile.findOneAndUpdate(
                    { userId: interaction.user.id },
                    { image: imageUrl, updatedAt: new Date() },
                    { upsert: true, new: true }
                );

                const updatedEmbed = new EmbedBuilder()
                    .setColor('#8b0808')
                    .setTitle(currentProfile?.characterName || interaction.user.username)
                    .setDescription(currentProfile?.description || 'Sin descripción aún.')
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setImage(imageUrl)
                    .setFooter({ text: interaction.user.username })
                    .setTimestamp();

                if (currentProfile?.stats) {
                    updatedEmbed.addFields({
                        name: '📊 Stats',
                        value: formatStats(currentProfile.stats)
                    });
                }

                await interaction.followUp({
                    content: '✅ ¡Imagen actualizada!',
                    embeds: [updatedEmbed],
                    flags: 64
                });
            }

        } catch (error) {
            console.error(error);
            if (!interaction.replied) {
                await interaction.reply({
                    content: 'Hubo un error al editar el perfil.',
                    flags: 64
                });
            }
        }
    }
};