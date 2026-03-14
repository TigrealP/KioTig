const moodActions = require('../data/moodActions');
const User = require('../models/User');
const {
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    EmbedBuilder
} = require('discord.js');

const COMMAND_NAME = 'accion';
const MENU_TIMEOUT_MS = 60_000;
const DEFAULT_COLOR = '#ff69b4';
const ACTION_MESSAGE_TEMPLATE = '{author} {action} {target}';

function getRandomItem(list) {
    if (!Array.isArray(list) || list.length === 0) {
        return null;
    }

    return list[Math.floor(Math.random() * list.length)];
}

function formatTemplate(template, placeholders) {
    if (typeof template !== 'string' || !template.trim()) {
        return '';
    }

    return Object.entries(placeholders).reduce((result, [key, value]) => {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const curlyPattern = new RegExp(`\\{${escapedKey}\\}`, 'g');
        const templateStringPattern = new RegExp(`\\$\\{${escapedKey}\\}`, 'g');

        return result
            .replace(curlyPattern, value)
            .replace(templateStringPattern, value);
    }, template);
}

function buildActionEmbed({ actionObject, authorMention, targetMention, mood, selectedImage, authorAvatar }) {
    const placeholders = {
        author: authorMention,
        target: targetMention
    };

    const title = formatTemplate(actionObject.embed?.title, placeholders) || `✨ ${actionObject.label} ✨`;
    const descriptionTemplate = actionObject.embed?.description
        || '{author} ha decidido **accionar** con {target} 💕';

    const description = formatTemplate(descriptionTemplate, placeholders)
        .replace('**accionar**', `**${actionObject.label}**`);

    const footer = formatTemplate(actionObject.embed?.footer, placeholders) || `Mood objetivo: ${mood}`;

    const embed = new EmbedBuilder()
        .setColor(actionObject.embed?.color || DEFAULT_COLOR)
        .setTitle(title)
        .setDescription(description)
        .setThumbnail(authorAvatar)
        .setFooter({ text: footer })
        .setTimestamp();

    if (selectedImage) {
        embed.setImage(selectedImage);
    }

    return embed;
}

function buildActionMessage({ authorMention, targetMention, actionLabel }) {
    return formatTemplate(ACTION_MESSAGE_TEMPLATE, {
        author: authorMention,
        action: `ha decidido **${actionLabel}** a`,
        target: targetMention
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName(COMMAND_NAME)
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
            const authorMention = `<@${author.id}>`;
            const targetMention = `<@${targetUser.id}>`;

            if (author.id === targetUser.id) {
                return interaction.reply({
                    content: 'Sé como te sientes... Pero para ello tienes a tu parejita 🐶🐯',
                    ephemeral: true
                });
            }

            const targetData = await User.findOne({ userId: targetUser.id });

            if (!targetData?.currentMood?.name) {
                return interaction.reply({
                    content: 'El usuario no tiene un mood activo. No puedes realizar acciones. 🐶🐯',
                    ephemeral: true
                });
            }

            const mood = targetData.currentMood.name;
            const actions = moodActions[mood];

            if (!Array.isArray(actions) || actions.length === 0) {
                return interaction.reply({
                    content: 'No hay acciones configuradas para ese mood.',
                    ephemeral: true
                });
            }

            const menuCustomId = `${COMMAND_NAME}_${targetUser.id}`;

            const menu = new StringSelectMenuBuilder()
                .setCustomId(menuCustomId)
                .setPlaceholder(`Acciones disponibles (${mood})`)
                .addOptions(actions);

            const row = new ActionRowBuilder().addComponents(menu);

            const message = await interaction.reply({
                content: `¿Qué quieres hacerle a ${targetMention}?`,
                components: [row],
                allowedMentions: { users: [targetUser.id] },
                fetchReply: true
            });

            const collector = message.createMessageComponentCollector({
                filter: i => i.user.id === author.id && i.customId === menuCustomId,
                time: MENU_TIMEOUT_MS
            });

            collector.on('collect', async i => {
                const selectedValue = i.values[0];
                const actionObject = actions.find(action => action.value === selectedValue);

                if (!actionObject) {
                    return i.reply({
                        content: 'Acción inválida.',
                        ephemeral: true
                    });
                }

                const selectedImage = getRandomItem(actionObject.embed?.images);
                const embed = buildActionEmbed({
                    actionObject,
                    authorMention,
                    targetMention,
                    mood,
                    selectedImage,
                    authorAvatar: author.displayAvatarURL({ dynamic: true })
                });

                const actionMessage = buildActionMessage({
                    authorMention,
                    targetMention,
                    actionLabel: actionObject.label
                });

                await i.update({
                    content: actionMessage,
                    embeds: [embed],
                    components: [],
                    allowedMentions: { users: [targetUser.id] }
                });

                collector.stop();
            });

            collector.on('end', async (_, reason) => {
                if (reason === 'time') {
                    await message.edit({
                        content: '⏳ La acción expiró.',
                        components: []
                    }).catch(() => {});
                }
            });
        } catch (error) {
            console.error('Error en /accion:', error);

            if (!interaction.replied) {
                await interaction.reply({
                    content: 'Ocurrió un error al ejecutar el comando.',
                    ephemeral: true
                });
            }
        }
    }
};
