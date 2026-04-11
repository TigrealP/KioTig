const moodActions = require('../data/moodActions');
const User = require('../models/User');
const { updateHappiness, updateStreak, updateMoment } = require('../utils/happiness');

const actionPoints = {
    pat: 5,
    acurrucar: 6,
    correa: 4,
    lick: 5,
    nalgada: 3,
    provocar: 4,
    arrodillar: 4,
    preparar: 5,
    lamer: 5,
    abrazo: 5,
    besitos: 7,
    poema: 2,
    atencion: 3
};

const {
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('accion')
        .setDescription('Realiza una acción según el mood del usuario')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Persona a la que quieres hacer la acción')
                .setRequired(true)
        ),

    async execute(interaction) {

        try {

            const author = interaction.user;
            const targetUser = interaction.options.getUser('usuario');

            // ❌ Evitar acciones a uno mismo
            if (author.id === targetUser.id) {
                return interaction.reply({
                    content: "Sé como te sientes... Pero para ello tienes a tu parejita 🐶🐯",
                    ephemeral: true
                });
            }

            // 🔎 Buscar mood en la DB
            const targetData = await User.findOne({ userId: targetUser.id });

            if (!targetData || !targetData.currentMood) {
                return interaction.reply({
                    content: "El usuario no tiene un mood activo. No puedes realizar acciones. 🐶🐯",
                    ephemeral: true
                });
            }

            const mood = targetData.currentMood.name;
            const actions = moodActions[mood];

            if (!actions || actions.length === 0) {
                return interaction.reply({
                    content: "No hay acciones configuradas para ese mood.",
                    ephemeral: true
                });
            }

            // 🎯 Crear menú dinámico
            const menu = new StringSelectMenuBuilder()
                .setCustomId(`accion_${targetUser.id}`)
                .setPlaceholder(`Acciones disponibles (${mood})`)
                .addOptions(actions);

            const row = new ActionRowBuilder().addComponents(menu);

            const message = await interaction.reply({
                content: `¿Qué quieres hacerle a ${targetUser.username}?`,
                components: [row],
                fetchReply: true
            });

            // 🧠 Collector ligado SOLO a este mensaje
            const collector = message.createMessageComponentCollector({
                filter: i =>
                    i.user.id === author.id &&
                    i.customId === `accion_${targetUser.id}`,
                time: 60000
            });

            collector.on('collect', async i => {

                const selectedValue = i.values[0];
                const actionObject = actions.find(a => a.value === selectedValue);

                // ✅ Validar primero
                if (!actionObject) {
                    return i.reply({
                        content: "Acción inválida.",
                        ephemeral: true
                    });
                }

                // 📊 Actualizar felicidad, racha y momento
                if (actionPoints[selectedValue] !== undefined) {
                    await updateHappiness(author.id, targetUser.id, actionPoints[selectedValue]);
                    await updateStreak(author.id, targetUser.id);
                    await updateMoment(author.id, targetUser.id, 'action');
                }

                const selectedImage = Array.isArray(actionObject.embed?.images) && actionObject.embed.images.length
                    ? actionObject.embed.images[Math.floor(Math.random() * actionObject.embed.images.length)]
                    : null;

                const embedDescriptionTemplate = actionObject.embed?.description
                    || `${author} ha decidido **${actionObject.label}** a ${targetUser} 💕`;

                const parseTitle = text =>
                    text
                        ?.replaceAll('{author}', author.username)
                        ?.replaceAll('{target}', targetUser.username);

                const parseDescription = text =>
                    text
                        ?.replaceAll('{author}', `${author}`)
                        ?.replaceAll('{target}', `${targetUser}`);

                const embed = new EmbedBuilder()
                    .setColor(actionObject.embed?.color || '#ff69b4')
                    .setTitle(parseTitle(actionObject.embed?.title))
                    .setDescription(parseDescription(embedDescriptionTemplate))
                    .setThumbnail(author.displayAvatarURL({ dynamic: true }))
                    .setFooter({
                        text: actionObject.embed?.footer || `Mood objetivo: ${mood}`
                    })
                    .setTimestamp();

                if (selectedImage) {
                    embed.setImage(selectedImage);
                }

                await i.update({
                    content: '',
                    embeds: [embed],
                    components: []
                });

                collector.stop();
            });

            // ⏳ Si nadie selecciona nada
            collector.on('end', async (_, reason) => {
                if (reason === 'time') {
                    await message.edit({
                        content: "⏳ La acción expiró.",
                        components: []
                    }).catch(() => { });
                }
            });

        } catch (error) {
            console.error("Error en /accion:", error);

            if (!interaction.replied) {
                await interaction.reply({
                    content: "Ocurrió un error al ejecutar el comando.",
                    ephemeral: true
                });
            }
        }
    }
};