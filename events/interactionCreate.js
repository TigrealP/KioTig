module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

        // Slash commands
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
            }
        }

        // Select menus
        if (interaction.isStringSelectMenu()) {

            if (interaction.customId === 'mood_action') {
                // Aquí va la lógica de acción
            }

        }
    }
};