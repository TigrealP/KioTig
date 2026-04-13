const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { updateStats } = require('../utils/stats');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

const angryImages = [
    'https://i.pinimg.com/736x/d4/88/0e/d4880eef567bb56979b362e9fb7311b0.jpg',
    'https://d.furaffinity.net/art/shorvost/1651917745/1651917745.shorvost_sex_but_like_with_signaturev2.jpg',
    'https://d.furaffinity.net/art/mr.lucifer/1661824158/1661824158.mr.lucifer_8.jpg',
    'https://x.com/i/status/2005817343306522913',
    'https://d.furaffinity.net/art/mimi-fox/1759715081/1759715081.mimi-fox_1000003207.png',
    'https://d.furaffinity.net/art/ruxvel/1733805947/1733805947.ruxvel_rux_.png'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('angry')
        .setDescription('¿Estás enojado? 🐶🐯'),

    async execute(interaction) {
        const author = interaction.user;

        let footerText;
        if (author.id === NOVIO_ID) {
            footerText = `Oh, vaya, ${author.username} está haciendo una escena de nuevo! 🐶`;
        } else if (author.id === TU_ID) {
            footerText = `Uy, parece que ${author.username} está molesto contigo, cachorrito🐯`;
        } else {
            footerText = 'Será mejor que solucionen este drama ahora! 🍎';
        }

        await updateStats(author.id, author.id, { afecto: -2, apego: -4 }, {});

        const embed = new EmbedBuilder()
            .setColor('#db581b')
            .setTitle(`${author.username} está haciendo una escena ahora 😭`)
            .setAuthor({
                name: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setThumbnail(author.displayAvatarURL({ dynamic: true }))
            .setImage(angryImages[Math.floor(Math.random() * angryImages.length)])
            .setDescription('Será mejor que vuelvas luego, cuando se le pase 🐯🐶')
            .setFooter({ text: footerText })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
