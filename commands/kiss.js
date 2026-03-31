const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { updateHappiness, updateStreak } = require('../utils/happiness');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

let besos = ['https://pbs.twimg.com/media/HBXsyWrWcAAegjv?format=png&name=small',
    'https://pbs.twimg.com/media/Gz_hSE9bgAA8YnN?format=jpg&name=4096x4096',
    'https://pbs.twimg.com/media/HBJb1INaUAAvvHb?format=jpg&name=4096x4096',
    'https://pbs.twimg.com/media/G00dzoSawAAVXQr?format=jpg&name=large',
    'https://cdn.discordapp.com/attachments/1477571857375957064/1477577453294846043/ssstwitter.com_1772352264195.gif?ex=69a544bc&is=69a3f33c&hm=52c61be7b4a297bf762ba4283e14ca7e7a102f97eb5f2cdec2da40cf15bc1ec6&',
    'https://media.discordapp.net/attachments/1477571857375957064/1477578416554508288/GW0atZpWQAAG1cS.jpg?ex=69a545a2&is=69a3f422&hm=c5ae6f1a29991410fc61deb00d30ae4f5a980b8a0e59f2cfb71a89c53eb079c5&=&format=webp',
    'https://media.discordapp.net/attachments/1477571857375957064/1477963187897766009/furry-furry-kiss.gif?ex=69a6abfb&is=69a55a7b&hm=2b7bfd030496f486b202d0500b4239b7964d5d88cae6c9cf4953ff04c1b0492a&=',
    'https://media.discordapp.net/attachments/1477571857375957064/1477964614582009966/furry-kiss.gif?ex=69a6ad4f&is=69a55bcf&hm=9bb912515349f918ff18a1cee0426c000fb768aa5a4177acc970b4098f0a98fc&=',
    'https://media.discordapp.net/attachments/1477571857375957064/1478217755638370596/a76dce1963f268e87255dcb8a6faada9.jpg?ex=69a79910&is=69a64790&hm=a7b4f707b3a6de557969fa1dd02828983ee2cc4df2aab947d10b8c3a4c68c243&=&format=webp&width=853&height=712',
    'https://media.discordapp.net/attachments/1477571857375957064/1478217755927908423/135a00a47b11fe1370202d58eed12959.jpg?ex=69a79910&is=69a64790&hm=b74c54a822d797ae00b28b44f774a26ff01030a58bbdcf201f86d259389d832f&=&format=webp&width=874&height=712',
    'https://media.discordapp.net/attachments/1477571857375957064/1478234132743196753/9e1d58e1c558472b4cad5d2ac77a6493.jpg?ex=69a7a851&is=69a656d1&hm=c8d5ce68545d3a9858c1af73c68826164d2a1310dff32d79b91af9a3cc6bb8a9&=&format=webp&width=484&height=726',
    'https://media.discordapp.net/attachments/1477571857375957064/1478234133447835823/fd961910f8033ef0307a314920fb9517.png?ex=69a7a851&is=69a656d1&hm=ca066ebf42a27184a9be80b1aa08bed27c0df5b537833f5729ee9eec1b2d3c1c&=&format=webp&quality=lossless&width=917&height=726',
    'https://media.discordapp.net/attachments/1477571857375957064/1478268303561588747/8cb60bf569c3970b6e04aec95c2485dd.jpg?ex=69a870e4&is=69a71f64&hm=93604d940f58605de899682363a404c8263e71f208a7306045ef64c4f380f297&=&format=webp&width=726&height=726',
    'https://media.discordapp.net/attachments/1477571857375957064/1478268303855063160/8262b52f470a7c5faddfc4d69e30329c.jpg?ex=69a870e4&is=69a71f64&hm=5f6273b675acd37895063fad3d9609679a36c30010aa42302f65658ffe689e0a&=&format=webp&width=726&height=726',
    'https://media.discordapp.net/attachments/1477571857375957064/1478268304060842074/471b17955b9d7da820fcb1b6dc69423e.jpg?ex=69a870e4&is=69a71f64&hm=ad1d69078d86a1f385076e2df399b877b32cd1c34f36c3b7990dc64086863a55&=&format=webp',
    'https://media.discordapp.net/attachments/1477571857375957064/1480413071209140295/HCF3tLvX0AAX7L2.jpg?ex=69af959c&is=69ae441c&hm=2ad03121d026c9e4a7972703cc3dd7c969428131951c08f5396ec2f73ba859d9&=&format=webp',
    'https://media.discordapp.net/attachments/1477571857375957064/1480413071779303445/F1vIxHaWcAArD_t.jpg?ex=69af959d&is=69ae441d&hm=a46188f3b9d6bb6e5371fa17ab953ea6626295d0ae11e075f3961fa298a10251&=&format=webp',
    'https://media.discordapp.net/attachments/1477571857375957064/1482206646980837408/HDIWzINa4AAYfPW.jpg?ex=69b61c02&is=69b4ca82&hm=3961cace59980c4218a210bf89860c268ab7ec99cc2c1147189a22580b0e551b&=&format=webp&width=622&height=830'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('TIG: Besa a tu cachorrito ---- KIO: Besa a tu dueño 🦊')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Usuario al que quieres besar')
                .setRequired(true)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser('usuario');
        const author = interaction.user;

        // 💋 Si intenta besarse a sí mismo
        if (target.id === author.id) {

            if (author.id === NOVIO_ID) {
                return interaction.reply({
                    content: '¿Tu dueño no te quiere besar? 🐯 Ve y pídeselo.',
                    ephemeral: true
                });
            }

            if (author.id === TU_ID) {
                return interaction.reply({
                    content: '¿Tu cachorrito no te quiere besar? 🐶 es mejor que lo haga si no quiere un castigo',
                    ephemeral: true
                });
            }

            return interaction.reply({
                content: 'No puedes besarte a ti mismo 😳',
                ephemeral: true
            });
        }

        if (target.bot) {
            return interaction.reply({
                content: 'No pongas celoso a tu dueño... Con un bot 🤖',
                ephemeral: true
            });
        }

        // 💕 Crear embed
        const embed = new EmbedBuilder()
            .setColor('#8b0808') // rojito pasión
            .setTitle(`${author.username} ha besado a ${target.username} 💋`)
            .setAuthor({
                name: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .setImage(besos[Math.floor(Math.random() * besos.length)])
            .setDescription(`${author.username} y ${target.username} se han dado uno hermoso beso! 🐶`)
            .setFooter({
                text: 'Tigre adora a su cachorrito 🐯❤️🐶',
            })
            .setTimestamp();

        await updateHappiness(author.id, target.id, 8);
        await updateStreak(author.id, target.id);
        await interaction.reply({ embeds: [embed] });
    }
};