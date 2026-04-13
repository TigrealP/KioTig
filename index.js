require('dotenv').config();
const fs = require('fs');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { createApiServer } = require('./api/server');
const { connectDatabase } = require('./config/database');

function resolveRunMode() {
    const mode = String(process.env.RUN_MODE || 'bot').toLowerCase();
    return ['bot', 'api', 'all'].includes(mode) ? mode : 'bot';
}

function createDiscordClient() {
    return new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessageReactions
        ]
    });
}

function loadCommands(client) {
    client.commands = new Collection();
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, command);
    }
}

function loadEvents(client) {
    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

function startApiServer() {
    const port = Number(process.env.API_PORT || 3000);
    const app = createApiServer();

    app.listen(port, () => {
        console.log(`API lista en http://localhost:${port}/api/v1/health`);
    });
}

async function startDiscordBot() {
    const client = createDiscordClient();

    loadCommands(client);
    loadEvents(client);

    client.once('ready', () => {
        console.log(`Bot listo como ${client.user.tag}`);
    });

    if (!process.env.TOKEN) {
        throw new Error('TOKEN no está configurado en el entorno.');
    }

    await client.login(process.env.TOKEN);
}

async function bootstrap() {
    const mode = resolveRunMode();

    await connectDatabase();

    if (mode === 'api' || mode === 'all') {
        startApiServer();
    }

    if (mode === 'bot' || mode === 'all') {
        await startDiscordBot();
    }
}

bootstrap().catch(error => {
    console.error('Error al iniciar la app:', error);
    process.exit(1);
});
