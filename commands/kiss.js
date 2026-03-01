const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

let besos = ['https://pbs.twimg.com/media/HBXsyWrWcAAegjv?format=png&name=small',
            'https://pbs.twimg.com/media/Gz_hSE9bgAA8YnN?format=jpg&name=4096x4096',
            'https://pbs.twimg.com/media/HBJb1INaUAAvvHb?format=jpg&name=4096x4096',
            'https://pbs.twimg.com/media/G00dzoSawAAVXQr?format=jpg&name=large',
            'https://cdn.discordapp.com/attachments/1477571857375957064/1477577453294846043/ssstwitter.com_1772352264195.gif?ex=69a544bc&is=69a3f33c&hm=52c61be7b4a297bf762ba4283e14ca7e7a102f97eb5f2cdec2da40cf15bc1ec6&',
            'https://media.discordapp.net/attachments/1477571857375957064/1477578416554508288/GW0atZpWQAAG1cS.jpg?ex=69a545a2&is=69a3f422&hm=c5ae6f1a29991410fc61deb00d30ae4f5a980b8a0e59f2cfb71a89c53eb079c5&=&format=webp']
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

            if (author.id === CACHORRITO_ID) {
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
            .setDescription(`¡Qué lindo beso! ${author.username} y ${target.username} se ven adorables juntos 🐶`)
            .setFooter({
                text: 'Tigre adora a su cachorrito 🐯❤️🐶',
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};