const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

var shy = ['https://pbs.twimg.com/media/HA-JwKdXwAAoMmd?format=jpg&name=small',
    'https://pbs.twimg.com/media/HBl9Kfra0AAkSh3?format=png&name=900x900'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shy')
        .setDescription('¿Estás apenado? 🦊'),

    async execute(interaction) {
        const author = interaction.user;

        if (author.id === author.id) {

            const embed = new EmbedBuilder()
                .setColor('#db581b') // morado suave
                .setTitle(`${author.username} se siente un poco tímido... 🥀`)
                .setAuthor({
                    name: interaction.client.user.username,
                    iconURL: interaction.client.user.displayAvatarURL()
                })
                .setThumbnail(author.displayAvatarURL({ dynamic: true }))
                .setImage(shy[Math.floor(Math.random() * shy.length)])
                .setFooter({
                    text: 'A veces todos nos sentimos un poco tímidos... 🐾',
                })
                .setTimestamp();
            await interaction.reply({ embeds: [embed] });
        }


    }
};