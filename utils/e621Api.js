const https = require('https');

/**
 * Tags prohibidos que no deben aparecer en los resultados
 */
const FORBIDDEN_TAGS = [
    'gore',
    'feces',
    'urine',
    'scatplay',
    'watersports',
    'young',
    'loli',
    'shota',
    'female',
    'zoo'
];

/**
 * Verifica si un post contiene tags prohibidos
 * @param {Object} post - Post de e621
 * @returns {boolean} - true si el post contiene tags prohibidos
 */
function hasForbiddenTags(post) {
    if (!post.tags) return false;

    // Combinar todos los tags del post
    const allTags = [
        ...(post.tags.general || []),
        ...(post.tags.species || []),
        ...(post.tags.character || []),
        ...(post.tags.copyright || []),
        ...(post.tags.artist || []),
        ...(post.tags.invalid || []),
        ...(post.tags.lore || []),
        ...(post.tags.meta || [])
    ];

    // Verificar si algún tag prohibido está presente
    return FORBIDDEN_TAGS.some(forbiddenTag =>
        allTags.includes(forbiddenTag)
    );
}

/**
 * Filtra posts que contienen tags prohibidos
 * @param {Array} posts - Array de posts de e621
 * @returns {Array} - Posts filtrados
 */
function filterPosts(posts) {
    if (!posts || !Array.isArray(posts)) return [];
    return posts.filter(post => !hasForbiddenTags(post));
}
async function searchE621(tags, apiKey) {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams({
            tags: tags,
            limit: 100, // Traemos más resultados para tener variedad
            api_key: apiKey,
            login: process.env.E621_LOGIN // Tu usuario de e621
        });

        const url = `https://e621.net/posts.json?${params}`;

        https.get(url, { headers: { 'User-Agent': 'TigKioBot/1.0' } }, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    // Filtrar posts con contenido prohibido
                    if (parsedData.posts) {
                        parsedData.posts = filterPosts(parsedData.posts);
                    }
                    resolve(parsedData);
                } catch (error) {
                    reject(new Error('Error al parsear la respuesta de e621'));
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

/**
 * Obtiene una imagen aleatoria de los resultados
 * @param {Array} posts - Array de posts de e621
 * @returns {Object|null} - Post aleatorio o null si no hay resultados
 */
function getRandomPost(posts) {
    if (!posts || posts.length === 0) return null;
    return posts[Math.floor(Math.random() * posts.length)];
}

/**
 * Obtiene la URL de la imagen de mejor calidad disponible
 * @param {Object} post - Post de e621
 * @returns {string|null} - URL de la imagen o null
 */
function getImageUrl(post) {
    if (!post.file) return null;
    
    // Prioridad: sample > preview > fallback
    if (post.file.url) return post.file.url;
    if (post.preview.url) return post.preview.url;
    
    return null;
}

module.exports = {
    searchE621,
    getRandomPost,
    getImageUrl,
    filterPosts,
    hasForbiddenTags,
    FORBIDDEN_TAGS
};
