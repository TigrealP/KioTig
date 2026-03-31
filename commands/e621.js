const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { searchE621, getRandomPost, getImageUrl, FORBIDDEN_TAGS } = require('../utils/e621Api');

/**
 * Valida que los tags del usuario no contengan tags prohibidos
 * @param {string} tags - Tags proporcionados por el usuario
 * @returns {string|null} - Tag prohibido encontrado o null si es válido
 */
function validateUserTags(tags) {
    const tagArray = tags.toLowerCase().split(/\s+/);
    for (const tag of tagArray) {
        const cleanTag = tag.replace(/^-/, ''); // Remover el prefijo - si existe
        if (FORBIDDEN_TAGS.includes(cleanTag)) {
            return cleanTag;
        }
    }
    return null;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('e621')
        .setDescription('¿Alguien quiere ver algo conichote? 🐶🐯')
        .addStringOption(option =>
            option.setName('tags')
                .setDescription('Tags para buscar (ej: lobo -female male anthro)')
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const tags = interaction.options.getString('tags');
        const apiKey = process.env.E621_API_KEY;

        // Validar que exista la API Key
        if (!apiKey || !process.env.E621_LOGIN) {
            return await interaction.editReply({
                content: '❌ La API Key de e621 no está configurada en las variables de entorno.',
                ephemeral: true
            });
        }

        // Validar que los tags del usuario no contengan contenido prohibido
        const forbiddenTag = validateUserTags(tags);
        if (forbiddenTag) {
            return await interaction.editReply({
                content: `❌ El tag **${forbiddenTag}** no está permitido en este comando.`,
                ephemeral: true
            });
        }

        try {
            // Buscar en e621
            const results = await searchE621(tags, apiKey);

            // Validar que hayan resultados después del filtrado
            if (!results.posts || results.posts.length === 0) {
                return await interaction.editReply({
                    content: `❌ No se encontraron resultados apropiados para los tags: **${tags}**\n\n*Los resultados fueron filtrados por contenido no permitido.*\n\n**Tags prohibidos:** ${FORBIDDEN_TAGS.join(', ')}`
                });
            }

            // Obtener post aleatorio
            const randomPost = getRandomPost(results.posts);
            const imageUrl = getImageUrl(randomPost);

            if (!imageUrl) {
                return await interaction.editReply({
                    content: '❌ No se pudo obtener la imagen del post.'
                });
            }

            // Crear el embed
            const embed = new EmbedBuilder()
                .setTitle('🎨 e621 Random Post')
                .setDescription(`**Tags:** \`${tags}\`\n*Contenido filtrado aplicado*`)
                .setImage(imageUrl)
                .setColor('#2F3136')
                .addFields(
                    { name: 'Post ID', value: `${randomPost.id}`, inline: true },
                    { name: 'Rating', value: randomPost.rating.toUpperCase(), inline: true },
                    { name: 'Artista', value: randomPost.tags.artist?.[0] || 'Desconocido', inline: true }
                )
                .setFooter({ text: `Solicitado por ${interaction.user.username} • Contenido seguro` })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error('Error en comando e621:', error);
            await interaction.editReply({
                content: `❌ Error al buscar en e621: ${error.message}`,
                ephemeral: true
            });
        }
    }
};
