const { v2: cloudinary } = require('cloudinary');
const https = require('https');
const http = require('http');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Descarga una imagen desde una URL y la devuelve como Buffer
 */
function downloadImage(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; TigKioBot/1.0)'
            }
        };

        const request = protocol.get(url, options, (res) => {
            // Seguir redirecciones
            if (res.statusCode === 301 || res.statusCode === 302) {
                return resolve(downloadImage(res.headers.location));
            }

            if (res.statusCode !== 200) {
                return reject(new Error(`HTTP ${res.statusCode} al descargar imagen`));
            }

            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        });

        request.on('error', reject);
        request.setTimeout(15000, () => {
            request.destroy();
            reject(new Error('Timeout descargando imagen'));
        });
    });
}

/**
 * Sube una imagen desde URL a Cloudinary descargándola primero
 */
async function uploadFromUrl(imageUrl, publicId) {
    const buffer = await downloadImage(imageUrl);

    const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                public_id: publicId,
                folder: 'tigkio/profiles',
                overwrite: true,
                resource_type: 'image',
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto', fetch_format: 'auto' }
                ]
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });

    return {
        url: result.secure_url,
        publicId: result.public_id
    };
}

/**
 * Elimina una imagen de Cloudinary por su publicId
 */
async function deleteImage(publicId) {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId).catch(() => {});
}

module.exports = { uploadFromUrl, deleteImage };