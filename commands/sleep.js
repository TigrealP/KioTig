const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { updateHappiness, updateStreak, updateMoment } = require('../utils/happiness');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

let sueñitos = ['https://i.pinimg.com/736x/26/05/fb/2605fb43b462ce126a729e6cde5ab95c.jpg',
    'https://i.pinimg.com/736x/af/10/9d/af109d280d7385b27e1cb143fc73d56c.jpg',
    'https://i.pinimg.com/1200x/a3/67/9b/a3679b092905dc6fb5a08d6fdb899667.jpg',
    'https://media.discordapp.net/attachments/1477571857375957064/1480400269056671744/588ee62e9306e7faccc7fdee3846d141.jpg?ex=69af89b0&is=69ae3830&hm=601196fd4b92d3d5ab105d526fb533f9b33c8e8eac59ce8da265d3fe13dad151&=&format=webp',
    'https://media.discordapp.net/attachments/1477571857375957064/1480400268653891738/221b9ed0185c413fafba3a5eec3d3968.jpg?ex=69af89b0&is=69ae3830&hm=3b0b0be4da9f549dc92374388dab39fa5a66d3740a6abf5fc41759aab5631034&=&format=webp',
    'https://media.discordapp.net/attachments/1477571857375957064/1480400270012710922/6740cac4fe17ff3e738376ecca563cda.jpg?ex=69af89b0&is=69ae3830&hm=9b374965d4ad5268a6cd758dc97fc6f60566e812e69afb571bca097c37cc3dde&=&format=webp',
    'https://media.discordapp.net/attachments/1477571857375957064/1480400270818152479/79d791239029af9aa96ffbb1703bf285.jpg?ex=69af89b1&is=69ae3831&hm=bb6662a31337c329c44790ca689d98c221ae6bf2f1e1aac1a567887771dcfddd&=&format=webp&width=663&height=726',
    'https://i.pinimg.com/1200x/a8/a3/84/a8a384a0c5941855efe0e45a275ba953.jpg',
    'https://i.pinimg.com/1200x/1f/3a/34/1f3a34d3e00ffb1bfec587e9bd8666f8.jpg',
    'https://i.pinimg.com/1200x/9e/1c/9f/9e1c9f7911110165beaa5e5fea193f7b.jpg',
    'https://i.pinimg.com/736x/50/47/4e/50474e6d79dc4510bd596062aa299c79.jpg',
    'https://media.discordapp.net/attachments/1477571857375957064/1480401669710938132/ef7c3eabb89ea9b83a3af32d296e19fe.jpg?ex=69af8afe&is=69ae397e&hm=58c3704ef07f5b81ed33d8486b9e9f8404e830c1cb6192709c4dd255738ec3d2&=&format=webp&width=581&height=726',
    'https://media.discordapp.net/attachments/1477571857375957064/1480401670310727801/ce188cfdde1c7820b74c8dc15316dba9.jpg?ex=69af8afe&is=69ae397e&hm=cb746d69a2a472ef471e10a4df243ddfbf97788357407850ea61bf506dbb5495&=&format=webp',
    'https://i.pinimg.com/1200x/50/63/6d/50636d221d425a94e559dbfa1eb6c207.jpg',
    'https://media.discordapp.net/attachments/1477571857375957064/1480406434708455585/GCsf8P9WsAAVXqV.jpg?ex=69af8f6e&is=69ae3dee&hm=caf265430b7d208bccc645cb0750e9d5ce7ce8e8370a398243e15abcd0267721&=&format=webp&width=826&height=826',
    'https://media.discordapp.net/attachments/1477571857375957064/1481972961530482819/f937f89411dde97cb49f2dd25844793d.png?ex=69b5eb1f&is=69b4999f&hm=86a8c8cfe005534923934a95a8cdf90aa3312ab5a5388d3ad1c89a53807333a1&=&format=webp&quality=lossless&width=726&height=726',
    'https://media.discordapp.net/attachments/1477571857375957064/1481972964030288112/db28c43a15784014a3f8f270b5a7e2c8.png?ex=69b5eb20&is=69b499a0&hm=fa53612f96184d800b3690a0832522635325a9be5821f9548dca3d84a42b9e19&=&format=webp&quality=lossless&width=606&height=726',
    'https://media.discordapp.net/attachments/1477571857375957064/1482207188276744282/HDMozU1bQAIvihT.jpg?ex=69b61c83&is=69b4cb03&hm=bcb6ad2357c0047333bf3ac97a0662c457697f70849ba45817acac1168e02a87&=&format=webp',
    'https://media.discordapp.net/attachments/1477571857375957064/1488739485624569896/HEwsPW-bEAAOrKS.jpg?ex=69ce88f0&is=69cd3770&hm=7866ac6981574c29b287f03a843908d5d3691f358ccd97714e65bbcdeac82881&=&format=webp',
    'https://pbs.twimg.com/media/GSETlIIWoAAjzIH?format=jpg&name=4096x4096'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sleep')
        .setDescription('TIG: duerme con su cachorrito ---- KIO: duerme con su dueño 🦊')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Usuario con el que quieres dormir')
                .setRequired(true)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser('usuario');
        const author = interaction.user;

        // 💤 Si intenta dormir con sí mismo
        if (target.id === author.id) {

            if (author.id === NOVIO_ID) {
                return interaction.reply({
                    content: 'Estoy seguro que a tu dueño le encantaría estar en la cama contigo 🐶',
                    ephemeral: true
                });
            }

            if (author.id === TU_ID) {
                return interaction.reply({
                    content: '¿Tu cachorrito es un dormilón y aún así no tienes con quien dormir? 🐯',
                    ephemeral: true
                });
            }

            return interaction.reply({
                content: '🐶 Creo que tienes algo de esquizofrenia',
                ephemeral: true
            });
        }

        if (target.bot) {
            return interaction.reply({
                content: '¿No crees que sería un poco incómodo dormir con un pedazo de ojalata? 🤖',
                ephemeral: true
            });
        }

        // 💕 Crear embed
        const embed = new EmbedBuilder()
            .setColor('#8b0808') // rojito pasión
            .setTitle(`${author.username} ha deseado las buenas noches a ${target.username} 🐶🦁`)
            .setAuthor({
                name: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .setImage(sueñitos[Math.floor(Math.random() * sueñitos.length)])
            .setDescription(`¡Es hora de dormir! 🐶`)
            .setFooter({
                text: 'Se ven adorables junticos! 🐯❤️🐶',
            })
            .setTimestamp();

        await updateHappiness(author.id, target.id, 6);
        await updateStreak(author.id, target.id);
        await updateMoment(author.id, target.id, 'sleep');
        await interaction.reply({ embeds: [embed] });
    }
};