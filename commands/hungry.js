const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

const shy = [
    'https://media.discordapp.net/attachments/1477571857375957064/1481972963321446410/ac8676a89aa0399d63d8f2dd377528b5.png?ex=69b5eb20&is=69b499a0&hm=e4d1fffea6f6ba4ef51587a100b8971a2590319ee8f5fdccd3ee86e2ad0f653b&=&format=webp&quality=lossless&width=606&height=726',
    'https://media.discordapp.net/attachments/1477571857375957064/1482207186951082004/HDS_ZtoaMAAfsgu.jpg?ex=69b61c83&is=69b4cb03&hm=fb46df896ac55d0e79aaf929be341055f58eba5609349f88b8c5206ca092ddd5&=&format=webp&width=538&height=726',
    'https://i.pinimg.com/736x/3e/f3/a7/3ef3a70731cd9f282a49f23399ce26a8.jpg',
    'https://i.pinimg.com/736x/1b/9b/11/1b9b1165cea09d957c1c32e4adfae50f.jpg',
    'https://i.pinimg.com/736x/db/d1/63/dbd163ed906a69378b6ed05c604684e7.jpg',
    'https://i.pinimg.com/736x/dd/78/9d/dd789daae3b13bf06ba09ea926a912c1.jpg',
    'https://i.pinimg.com/736x/73/39/08/7339088059a377f27d1493d84a859edd.jpg',
    'https://i.pinimg.com/736x/b1/2a/63/b12a63db2a20aefb63a8718c481c8922.jpg',
    'https://i.pinimg.com/736x/29/56/4e/29564e54e46b0e82460077b496d356f9.jpg'
    ];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hungry')
        .setDescription('¿Estás hambriento? 🐶🐯'),

    async execute(interaction) {
        const author = interaction.user;

        // 🎯 Footer personalizado
        let footerText;

        if (author.id === NOVIO_ID) {
            footerText = `Al parecer un cachorrito está hambriento 🐶`;
        } else if (author.id === TU_ID) {
            footerText = 'Al parecer tu dueño tiene algo de hambre🐯';
        } else {
            footerText = 'Será mejor que coman algo antes de que desaparezcan 🍎';
        }

        const embed = new EmbedBuilder()
            .setColor('#db581b')
            .setTitle(`A ${author.username} Le dió hambre 🐯🐶`)
            .setAuthor({
                name: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setThumbnail(author.displayAvatarURL({ dynamic: true }))
            .setImage(shy[Math.floor(Math.random() * shy.length)])
            .setDescription(`${author}, necesita algo de comer 🐯🐶`)
            .setFooter({ text: footerText })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};