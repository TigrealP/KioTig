const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

const shy = [
    'https://i.pinimg.com/736x/d4/88/0e/d4880eef567bb56979b362e9fb7311b0.jpg',
    'https://d.furaffinity.net/art/shorvost/1651917745/1651917745.shorvost_sex_but_like_with_signaturev2.jpg',
    'https://d.furaffinity.net/art/mr.lucifer/1661824158/1661824158.mr.lucifer_8.jpg',
    'https://x.com/i/status/2005817343306522913',
    'https://d.furaffinity.net/art/mimi-fox/1759715081/1759715081.mimi-fox_1000003207.png',
    'https://d.furaffinity.net/art/ruxvel/1733805947/1733805947.ruxvel_rux_.png',
    'https://media.discordapp.net/attachments/1477571857375957064/1484067305699803136/Gy-Mb5SWMAAX36w.jpg?ex=69bce0e2&is=69bb8f62&hm=30964ae024230599a59e3c3aac1c30825d995a25bf215163e136ab2e471cff94&=&format=webp&width=617&height=726',
    'https://media.discordapp.net/attachments/1477571857375957064/1484067306823749682/HDi1kjhaoAAFNCO.jpg?ex=69bce0e2&is=69bb8f62&hm=fa3a4eddcfbc4222e63c7e597f9bf006632f4a0ffa0f159ecf58afc699f9d3ca&=&format=webp&width=627&height=726',
    'https://media.discordapp.net/attachments/1477571857375957064/1484067307587244032/HDkXxlDbEAEHs4D.jpg?ex=69bce0e2&is=69bb8f62&hm=52788f32fcc4a1d2b35e058298172e15e77392a9dee71b7877e2eccc3e045dc1&=&format=webp',
    'https://media.discordapp.net/attachments/1477571857375957064/1484067306475884706/HDeMhVRWoAANt2q.jpg?ex=69bce0e2&is=69bb8f62&hm=4592666ad447df271f3a5243932f332b903b4215521d53f016f52d2b94a9630a&=&format=webp&width=613&height=726',
    'https://media.discordapp.net/attachments/1477571857375957064/1484067306123296858/HDe98m7awAAtwc2.png?ex=69bce0e2&is=69bb8f62&hm=7598b8623981178c3a56a3eedc19d2ab7a7686c0ab07e668b1932398ae582bba&=&format=webp&quality=lossless'
    ];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('angry')
        .setDescription('¿Estás enojado? 🐶🐯'),

    async execute(interaction) {
        const author = interaction.user;

        // 🎯 Footer personalizado
        let footerText;

        if (author.id === NOVIO_ID) {
            footerText = `Oh, vaya, ${author.username} está haciendo una escena de nuevo! 🐶`;
        } else if (author.id === TU_ID) {
            footerText = `Uy, parece que ${author.username} está molesto contigo, cachorrito🐯`;
        } else {
            footerText = 'Será mejor que solucionen este drama ahora! 🍎';
        }

        const embed = new EmbedBuilder()
            .setColor('#db581b')
            .setTitle(`${author.username}  está haciendo una escena ahora 😭`)
            .setAuthor({
                name: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setThumbnail(author.displayAvatarURL({ dynamic: true }))
            .setImage(shy[Math.floor(Math.random() * shy.length)])
            .setDescription(` Será mejor que vuelvas luego, cuando se le pase 🐯🐶`)
            .setFooter({ text: footerText })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};