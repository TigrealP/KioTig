const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

const shy = [
    'https://pbs.twimg.com/media/HA-JwKdXwAAoMmd?format=jpg&name=small',
    'https://pbs.twimg.com/media/HBl9Kfra0AAkSh3?format=png&name=900x900'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shy')
        .setDescription('¿Estás apenado? 🦊'),

    async execute(interaction) {
        const author = interaction.user;

        // 🎯 Footer personalizado
        let footerText;

        if (author.id === NOVIO_ID) {
            footerText = 'Mi cachorrito anda tímido hoy... 🐶';
        } else if (author.id === TU_ID) {
            footerText = 'Admítelo, estás apenado Tigresito! 🐯';
        } else {
            footerText = 'La timidez también es linda 💭';
        }

        const embed = new EmbedBuilder()
            .setColor('#db581b')
            .setTitle(`${author.username} se siente un poco tímido... 🥀`)
            .setAuthor({
                name: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setThumbnail(author.displayAvatarURL({ dynamic: true }))
            .setImage(shy[Math.floor(Math.random() * shy.length)])
            .setFooter({ text: footerText })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};