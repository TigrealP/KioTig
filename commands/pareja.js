const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Relationship = require('../models/Relationship');

const NOVIO_ID = '811091271023722586';
const TU_ID = '765660693835415552';

const images = [
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/43d7c22d-6b9c-4a70-86b4-4d5c68ed816c/deap27j-9ab77aed-b3f9-44fb-b986-6c9311aa0cf8.png/v1/fill/w_894,h_894/com__pillowfort_cuddles_by_seyumei_deap27j-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiIvZi80M2Q3YzIyZC02YjljLTRhNzAtODZiNC00ZDVjNjhlZDgxNmMvZGVhcDI3ai05YWI3N2FlZC1iM2Y5LTQ0ZmItYjk4Ni02YzkzMTFhYTBjZjgucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.aaa2d0mT-hXapqZNWNgjrJzIpXGNDBa65LQQJ09Fd08',
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d6b19302-3d1d-42a0-b376-61fae08f8ed3/dli9wif-06dad9d5-f85b-4421-9817-69fa6b164d4e.png/v1/fill/w_894,h_894,q_70,strp/wolf_and_bear_kiss_by_theaifurden_dli9wif-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiIvZi9kNmIxOTMwMi0zZDFkLTQyYTAtYjM3Ni02MWZhZTA4ZjhlZDMvZGxpOXdpZi0wNmRhZDlkNS1mODViLTQ0MjEtOTgxNy02OWZhNmIxNjRkNGUucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.6xAFE-fBSzYK8gOpjTSkZFfzelmFml19YmH9aCNQs-M',
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b70ced53-1392-40cc-b956-0c1984616a8c/dgy3o0k-30fea588-778c-4823-9056-8e867f6f1512.jpg/v1/fill/w_852,h_938,q_70,strp/cleir_bunny_and_lowis_by_fuzzylynxs_dgy3o0k-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTQwOSIsInBhdGgiOiIvZi9iNzBjZWQ1My0xMzkyLTQwY2MtYjk1Ni0wYzE5ODQ2MTZhOGMvZGd5M28way0zMGZlYTU4OC03NzhjLTQ4MjMtOTA1Ni04ZTg2N2Y2ZjE1MTIuanBnIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.i-2_HIpHU4yreKLHAwbzXcIwPGkq8Aj3oLopbG_SVfs',
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/7c5c9a9c-7656-4f64-8101-75c0dde0d369/da5aab7-cfd6e7b6-fd4d-4b49-b1ef-28fc491afcd5.png/v1/fill/w_1055,h_757,q_70,strp/cute_lil__lick_by_hot_gothics_da5aab7-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI1MCIsInBhdGgiOiIvZi83YzVjOWE5Yy03NjU2LTRmNjQtODEwMS03NWMwZGRlMGQzNjkvZGE1YWFiNy1jZmQ2ZTdiNi1mZDRkLTRiNDktYjFlZi0yOGZjNDkxYWZjZDUucG5nIiwid2lkdGgiOiI8PTE3NDIifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ._kNrVScOWzMPabnuKU9jy9EBeXOJK2AqIIRPHPo6PHI',
    'https://i.pinimg.com/1200x/6b/81/68/6b8168809fea4a0a7cef5feac4b51eee.jpg',
    'https://i.pinimg.com/736x/04/86/c9/0486c9910ff31e50d24cbbda162911f2.jpg',
    'https://i.pinimg.com/736x/bf/5b/67/bf5b67ba77e5e7db5f55a4158cf286d3.jpg',
    'https://i.pinimg.com/1200x/bf/81/02/bf81027b93b0e50418643712a3da95b5.jpg',
    'https://i.pinimg.com/1200x/40/c8/36/40c8364b6f455273b61f263a53095633.jpg',
    'https://instagram.feoh1-1.fna.fbcdn.net/v/t51.82787-15/588530351_18112844476593619_7385744202014967172_n.heic?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=Mzc3OTE2Mjg3NDgyMTA5NzUwOA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTU1Ni5zZHIuQzMifQ%3D%3D&_nc_ohc=FPbF2WuwogkQ7kNvwETgPmZ&_nc_oc=AdolRSSRUD5vtb5lLt9SgtVSp_Ib2hVNnohASv8n53KbzrgvlAiqVolLSbFQT_NwEpGqVyHtQeNpdzQfXdQjeGZ1&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.feoh1-1.fna&_nc_gid=FHDRx7h-CjQMXhLXqIJwDw&_nc_ss=7a32e&oh=00_AfyK61nHgbFDHpHglAvbMy3dmS3SskTfnB4vjXe0Lm3qqA&oe=69D0DE1D'
];

function happinessBar(happiness) {
    const filled = Math.round(happiness / 10);
    const empty = 10 - filled;
    return '🟥'.repeat(filled) + '⬛'.repeat(empty) + ` ${happiness}/100`;
}

function streakTitle(streak) {
    if (streak >= 100) return '💎 Irrompibles';
    if (streak >= 60) return '🔥 Llama viva';
    if (streak >= 30) return '🌸 Floreciendo';
    if (streak >= 7) return '🌱 Brote de amor';
    return '🐾 Comenzando';
}

function formatMoments(moments, lastMoment, lastMomentAt) {

    const lines = [];

    if (moments.kisses > 0) lines.push(`🐯💋🐶 Se han besado **${moments.kisses}** veces \n ------------------ \n`);
    if (moments.hugs > 0) lines.push(`🐯🫂🐶 Se han abrazado **${moments.hugs}** veces \n ------------------ \n`);
    if (moments.sleeps > 0) lines.push(`🐯🌙🐶 Han dormido juntos **${moments.sleeps}** veces \n ------------------ \n`);
    if (moments.fucks > 0) lines.push(`🐯🔥🐶 Han tenido sexo **${moments.fucks}** veces \n ------------------ \n`);
    if (moments.actions > 0) lines.push(`🐯💕🐶 Han compartido **${moments.actions}** acciones especiales \n ------------------ \n`);

    if (lines.length === 0) return '📸 Aún no tienen momentos juntos... ¡empiecen ya!';

    // Tiempo desde el último momento
    const diffMs = Date.now() - new Date(lastMomentAt).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    const timeAgo =
        diffDays > 0 ? `hace ${diffDays} día(s)` :
            diffHours > 0 ? `hace ${diffHours} hora(s)` :
                diffMins > 0 ? `hace ${diffMins} minuto(s)` : 'hace un momento';

    lines.push(`\n🎵 Último momento: ${lastMoment} ${timeAgo}`);

    return lines.join('\n');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pareja')
        .setDescription('Envía una solicitud de pareja 🐯🧡🐶')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('Usuario al que quieres enviar la solicitud')
                .setRequired(true)
        ),

    async execute(interaction) {
        const author = interaction.user;
        const target = interaction.options.getUser('usuario');

        // ❌ No puedes enviarte una solicitud a ti mismo
        if (author.id === target.id) {
            return interaction.reply({
                content: 'Tienes un dueño al cual amar... 🐶🧡🐯',
                ephemeral: true
            });
        }

        // ❌ No puedes enviarle una solicitud a un bot
        if (target.bot) {
            return interaction.reply({
                content: 'Le serás infiel a tu dueño con un... ¡¿BOT?! 🐶🐯',
                ephemeral: true
            });
        }

        // 🔎 Buscar relación existente
        const existing = await Relationship.findOne({
            $or: [
                { user1: author.id, user2: target.id },
                { user1: target.id, user2: author.id }
            ]
        });

        // 💕 Si ya tienen relación aceptada, mostrar perfil
        if (existing && existing.status === 'accepted') {
            const randomImage = images[Math.floor(Math.random() * images.length)];

            const profileEmbed = new EmbedBuilder()
                .setColor('#8b0808')
                .setTitle('🐯🧡🐶 Mi parejita')
                .setDescription(
                    `**${author.username}** y **${target.username}**\n\n` +
                    `💕 Juntos desde: <t:${Math.floor(existing.createdAt.getTime() / 1000)}:D>\n\n` +
                    `**Felicidad:**\n${happinessBar(existing.happiness)}\n\n` +
                    `**Racha:** ${streakTitle(existing.streak)} — ${existing.streak} días 🔥\n\n` +
                    `**📸 Sus momentos:**\n${formatMoments(existing.moments, existing.lastMoment, existing.lastMomentAt)}`
                )
                .setThumbnail(author.displayAvatarURL({ dynamic: true }))
                .setImage(randomImage)
                .setTimestamp();

            return interaction.reply({ embeds: [profileEmbed] });
        }

        // ⏳ Si hay solicitud pendiente, avisar
        if (existing && existing.status === 'pending') {
            return interaction.reply({
                content: 'Ya existe una solicitud pendiente entre ustedes 🐶🧡🐯',
                ephemeral: true
            });
        }

        // 📨 Crear nueva solicitud en la DB
        await Relationship.create({
            user1: author.id,
            user2: target.id
        });

        // 📩 Embed de solicitud con botones
        const requestEmbed = new EmbedBuilder()
            .setColor('#8b0808')
            .setTitle('💕 Solicitud de pareja')
            .setDescription(`${author} te ha enviado una solicitud de pareja 🐯🧡🐶 ${target}\n\n${target}, ¿aceptas?`)
            .setThumbnail(author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`pareja_accept_${author.id}`)
                .setLabel('Aceptar 💕')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`pareja_reject_${author.id}`)
                .setLabel('Rechazar 💔')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({ embeds: [requestEmbed], components: [row] });
        const message = await interaction.fetchReply();

        // 🧠 Collector para los botones
        const collector = message.createMessageComponentCollector({
            filter: i => i.user.id === target.id,
            time: 60000
        });

        collector.on('collect', async i => {

            // ✅ Aceptar solicitud
            if (i.customId === `pareja_accept_${author.id}`) {

                await Relationship.findOneAndUpdate(
                    { user1: author.id, user2: target.id },
                    { status: 'accepted' }
                );

                const randomImage = images[Math.floor(Math.random() * images.length)];

                const acceptEmbed = new EmbedBuilder()
                    .setColor('#8b0808')
                    .setTitle('🐯🧡🐶 ¡Nueva pareja!')
                    .setDescription(
                        `**${author.username}** y **${target.username}** ahora son pareja\n\n` +
                        `💕 Juntos desde: <t:${Math.floor(Date.now() / 1000)}:D>\n\n` +
                        `**Felicidad:**\n${happinessBar(50)}\n\n` +
                        `**Racha:** 🐾 Comenzando — 0 días 🔥`
                    )
                    .setThumbnail(author.displayAvatarURL({ dynamic: true }))
                    .setImage(randomImage)
                    .setTimestamp();

                await i.update({ embeds: [acceptEmbed], components: [] });

                // ❌ Rechazar solicitud
            } else if (i.customId === `pareja_reject_${author.id}`) {

                await Relationship.findOneAndDelete(
                    { user1: author.id, user2: target.id }
                );

                await i.update({
                    content: `💔 ${target.username} rechazó la solicitud de ${author.username}`,
                    embeds: [],
                    components: []
                });
            }

            collector.stop();
        });

        // ⏳ Solicitud expirada
        collector.on('end', async (_, reason) => {
            if (reason === 'time') {
                await Relationship.findOneAndDelete(
                    { user1: author.id, user2: target.id }
                );
                await message.edit({
                    content: '⏳ La solicitud expiró.',
                    embeds: [],
                    components: []
                }).catch(() => { });
            }
        });
    }
}