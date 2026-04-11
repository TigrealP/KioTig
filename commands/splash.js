const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { updateHappiness, updateStreak, updateMoment } = require('../utils/happiness');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

let besos = ['https://static1.e621.net/data/6d/30/6d3009d508e4232ebd79231d3f8441a7.gif'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rociar')
        .setDescription('TIG: Rocía a tu cachorrito ---- KIO: resive una rociada 🦊')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Usuario al que quieres rociar')
                .setRequired(true)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser('usuario');
        const author = interaction.user;

        if (author.id === NOVIO_ID && target.id === TU_ID) {
            return interaction.reply({
                content: '¡Mal portado! Solo el dueño puede rociar al cachorrito. 😠',
                ephemeral: true
            });
        }

        // 💋 Si intenta besarse a sí mismo
        if (target.id === author.id) {

            if (author.id === NOVIO_ID) {
                return interaction.reply({
                    content: '¿Qué travesura hiciste ahora para querer un splash? 🐶',
                    ephemeral: true
                });
            }

            if (author.id === TU_ID) {
                return interaction.reply({
                    content: '¿Has sentido la necesidad de rociar a tu cachorrito? a todos nos pasa 🐯🐶',
                    ephemeral: true
                });
            }

            return interaction.reply({
                content: 'No puedes rociarte a ti mismo 😳',
                ephemeral: true
            });
        }

        if (target.bot) {
            return interaction.reply({
                content: 'El bot no te ha hecho nada! 🤖',
                ephemeral: true
            });
        }

        // 💕 Crear embed
        const embed = new EmbedBuilder()
            .setColor('#8b0808') // rojito pasión
            .setTitle(`${author.username} ha rociado a ${target.username} 💦`)
            .setAuthor({
                name: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .setImage(besos[Math.floor(Math.random() * besos.length)])
            .setDescription(`${target.username} se ha portado mal y ha sido rociado por ${author.username} 🐶`)
            .setFooter({
                text: 'Tigre adora a su cachorrito, pero esta vez debe castigarle 🐯❤️🐶',
            })
            .setTimestamp();

        await updateHappiness(author.id, target.id, 8);
        await updateStreak(author.id, target.id);
        await updateMoment(author.id, target.id, 'splash');
        await interaction.reply({ embeds: [embed] });
    }
};