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
    'https://pbs.twimg.com/media/GZYu_sSWUAAbTGC?format=jpg&name=large'];

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
            .setColor('#6A4C93') // morado suave
            .setTitle(`${author.username} abrazó a ${target.username} 🤗`)
            .setAuthor({
                name: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .setImage(abrazos[Math.floor(Math.random() * abrazos.length)])
            .setFooter({
                text: 'Un lindo abrazo para cachorritos y dueños 🐾',
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};