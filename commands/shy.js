const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

const shy = [
    'https://pbs.twimg.com/media/HA-JwKdXwAAoMmd?format=jpg&name=small',
    'https://pbs.twimg.com/media/HBl9Kfra0AAkSh3?format=png&name=900x900',
    'https://media.discordapp.net/attachments/1477571857375957064/1477962590817615904/46d0cea5-8754-4103-a46b-ae46b136c7e6.jpg?ex=69a6ab6c&is=69a559ec&hm=c59991643b6970263704150d75d44a710136b9721f224491485ff9187f588760&=&format=webp&width=826&height=795',
    'https://images-ext-1.discordapp.net/external/2hPgsjtw6UJQfHGaja2B2iv0-6C5TEg1EsTuTqglbOw/https/i.pinimg.com/736x/54/1d/b9/541db981ee205e7a0d7b090111afa055.jpg?format=webp&width=596&height=815'
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
            footerText = '¡Los cachetes de tu cachorrito andan cambiando de color! 🐶';
        } else if (author.id === TU_ID) {
            footerText = 'Admítelo, estás apenado Tigresito! 🐯';
        } else {
            footerText = 'La timidez también es linda 💭';
        }

        const embed = new EmbedBuilder()
            .setColor('#db581b')
            .setTitle(`A ${author.username} Le dió penita 🙊`)
            .setAuthor({
                name: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setThumbnail(author.displayAvatarURL({ dynamic: true }))
            .setImage(shy[Math.floor(Math.random() * shy.length)])
            .setDescription(`${author}, se está poniendo rojito! 🐯🐶`)
            .setFooter({ text: footerText })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};