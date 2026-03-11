const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

var abrazos = ['https://pbs.twimg.com/media/HCGiHQkXQAA1_1b?format=jpg&name=large',
    'https://i.pinimg.com/736x/15/15/a7/1515a7c2fb3fe502a97aabb213b95853.jpg',
    'https://pbs.twimg.com/media/GXr9ZnbXYAAK9xT?format=jpg&name=large',
    'https://pbs.twimg.com/media/Gnw4UxebYAQ35pG?format=jpg&name=medium',
    'https://pbs.twimg.com/media/G_TgixDXAAAmi6r?format=jpg&name=small',
    'https://pbs.twimg.com/media/G_nAPVgWgAAqX6m?format=jpg&name=large',
    'https://pbs.twimg.com/media/G5_Pgt9XEAAubzD?format=jpg&name=medium',
    'https://pbs.twimg.com/media/G5lVh9QWsAAI94x?format=jpg&name=4096x4096',
    'https://pbs.twimg.com/media/GuxSvmOWIAEv6Zx?format=jpg&name=medium',
    'https://pbs.twimg.com/media/Gt66v-RWcAA-A0R?format=jpg&name=large',
    'https://pbs.twimg.com/media/GjmSxXoXEAAMGdi?format=jpg&name=large',
    'https://pbs.twimg.com/media/GZYu_sSWUAAbTGC?format=jpg&name=large',
    'https://media.discordapp.net/attachments/1477571857375957064/1477962354716180561/f11c8ae8-6111-4e4b-b2bd-80ebbafuckb553ca.jpg?ex=69a6ab34&is=69a559b4&hm=16118e7cccd2246a6ba27dcbaad8215c7c47dd841d82b2fd97dde5f3bb4bce15&=&format=webp&width=826&height=795',
    'https://media.discordapp.net/attachments/1477571857375957064/1477962778739216485/d2ba307c-54db-4fde-98e5-c10cfcd11951.jpg?ex=69a6ab99&is=69a55a19&hm=cc3726472ecf0af0522da149de4640464e84d9b157e2d45a9bf4918de5d70c5b&=&format=webp&width=826&height=795',
    'https://media.discordapp.net/attachments/1477571857375957064/1477965239885762670/qmh16tm82wwg3la52jwds5es3vix.png?ex=69a6ade4&is=69a55c64&hm=305c0c10f09a1e7c7d17668a63f86b946c1ab523ffd9e433f4b0252f51168ea3&=&format=webp&quality=lossless&width=712&height=712',
    'https://media.discordapp.net/attachments/1477571857375957064/1477965240179101861/images_4.jpg?ex=69a6ade4&is=69a55c64&hm=9ab5d30d15851a9c49494a4620fbf643833486ef42e5abdb29393def4a5ee787&=&format=webp',
    'https://media.discordapp.net/attachments/1477571857375957064/1477966708953055302/50a4729fc28ef56baa0e0551cdd30bb7.jpg?ex=69a6af42&is=69a55dc2&hm=84e0371be8dd7cd599bcafda685ae5b12ea1bd2e86fcd022f9c5c481ae1186f3&=&format=webp&width=503&height=712',
    'https://media.discordapp.net/attachments/1477571857375957064/1477966709397782528/a67dd8ff75951d31e534982d1e328b9b.png?ex=69a6af42&is=69a55dc2&hm=e763503c2c6c99a3f3e8c1082becdde28bab7c14f2c8e2e9c663c6335ca02893&=&format=webp&quality=lossless',
    'https://media.discordapp.net/attachments/1477571857375957064/1477968155094552626/402182a63c15d892a1861290dca4903c.png?ex=69a6b09b&is=69a55f1b&hm=7346cbdf7c1f05f3036b2978b0aac138cd4e58ad6f5cd677005a5a234e600fc2&=&format=webp&quality=lossless&width=333&height=350',
    'https://media.discordapp.net/attachments/1477571857375957064/1478251006289641667/0f5f263624faebe43f6e840d5c8ac306.jpg?ex=69a7b808&is=69a66688&hm=6ba9a001ffa6f5112142b78b307a3c34011ca560950cb583492a76331810371d&=&format=webp&width=696&height=830',
    'https://media.discordapp.net/attachments/1477571857375957064/1478268303561588747/8cb60bf569c3970b6e04aec95c2485dd.jpg?ex=69a870e4&is=69a71f64&hm=93604d940f58605de899682363a404c8263e71f208a7306045ef64c4f380f297&=&format=webp&width=726&height=726',
    'https://media.discordapp.net/attachments/1477571857375957064/1478268303855063160/8262b52f470a7c5faddfc4d69e30329c.jpg?ex=69a870e4&is=69a71f64&hm=5f6273b675acd37895063fad3d9609679a36c30010aa42302f65658ffe689e0a&=&format=webp&width=726&height=726',
    'https://media.discordapp.net/attachments/1477571857375957064/1478268304060842074/471b17955b9d7da820fcb1b6dc69423e.jpg?ex=69a870e4&is=69a71f64&hm=ad1d69078d86a1f385076e2df399b877b32cd1c34f36c3b7990dc64086863a55&=&format=webp',
    'https://media.discordapp.net/attachments/1477571857375957064/1480413071485698099/HCG3WbDbYAA9iDb.jpg?ex=69af959c&is=69ae441c&hm=2cd082f3fc6802616c83391e4c55724f272a4bb97694d5ea66d7491d45bceeb7&=&format=webp',
    'https://media.discordapp.net/attachments/1477571857375957064/1480413071779303445/F1vIxHaWcAArD_t.jpg?ex=69af959d&is=69ae441d&hm=a46188f3b9d6bb6e5371fa17ab953ea6626295d0ae11e075f3961fa298a10251&=&format=webp',
    'https://media.discordapp.net/attachments/1477571857375957064/1481071139101872198/fbe0f13c63320bc81009efd2405d68e8.jpg?ex=69b1fa7c&is=69b0a8fc&hm=b75ea6b62e4f04648c09a97e2f99e85a6ed43d1dbfd995cfed278ced926233a7&=&format=webp&width=638&height=830'
    ];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Abraza a otro usuario 🤗')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Usuario al que quieres abrazar')
                .setRequired(true)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser('usuario');
        const author = interaction.user;

        if (target.id === author.id) {

            if (author.id === NOVIO_ID) {
                return interaction.reply({
                    content: 'Estoy seguro de que tu dueño quiere abrazarte también 🐯 Anda, búscalo.',
                    ephemeral: true
                });
            }

            if (author.id === TU_ID) {
                return interaction.reply({
                    content: 'Tu cachorrito debe estar ansiando un abrazo de tu parte 🐶 No lo hagas esperar.',
                    ephemeral: true
                });
            }

            return interaction.reply({
                content: 'No puedes abrazarte a ti mismo 🥀',
                ephemeral: true
            });
        }

        if (target.bot) {
            return interaction.reply({
                content: 'No pongas celoso a tu dueño... Con un bot 🤖',
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor('#d13e25') // morado suave
            .setTitle(`${author.username} abrazó a ${target.username} 🤗`)
            .setAuthor({
                name: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .setImage(abrazos[Math.floor(Math.random() * abrazos.length)])
            .setDescription(`${author} le dió un abrazo a ${target}, ¡qué lindo! 🐯🐶`)
            .setFooter({
                text: 'Un lindo abrazo para cachorritos y dueños 🐾',
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};