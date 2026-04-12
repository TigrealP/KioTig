const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { updateStat } = require('../utils/stats');
const { updateHappiness } = require('../utils/happiness');
const Relationship = require('../models/Relationship');

const NOVIO_ID = '811091271023722586';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resistir')
        .setDescription('Intenta recuperar el control 🔒'),

    async execute(interaction) {
        const author = interaction.user;

        // Baja la stat 'control' del author en -8
        await updateStat(author.id, 'control', -8);

        // Busca la relación aceptada del author y sube la felicidad en +3
        const relationship = await Relationship.findOne({
            $or: [
                { user1: author.id },
                { user2: author.id }
            ],
            status: 'accepted'
        });

        if (relationship) {
            const partnerId = relationship.user1 === author.id
                ? relationship.user2
                : relationship.user1;
            await updateHappiness(author.id, partnerId, 3);
        }

        // Descripción dinámica según el ID
        let description;
        if (author.id === NOVIO_ID) {
            description = `${author} ha decidido resistir las órdenes de su dueño... por ahora 🐶💪`;
        } else {
            description = `${author} ha recuperado algo de control 🔒`;
        }

        const embed = new EmbedBuilder()
            .setColor('#8b0808')
            .setTitle('🔒 ¡Resistencia activada!')
            .setDescription(description)
            .setFooter({ text: 'La resistencia tiene un precio... pero también una recompensa' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
