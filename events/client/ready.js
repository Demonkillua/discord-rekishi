const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');

module.exports = {
	name: "ready",
	once: true,
	execute(client, commands) {

		console.log("Rekishi is online!")

		const clientId = client.user.id;
        const commandsPath = path.join(__dirname, '../../commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

		mongoose.connect(process.env.MONGODB_URI, {
			keepAlive: true,
		}).then(() => {
			console.log("Connected to the database!");
		}).catch((err) => {
			console.log(err);
		});

		for (const file of commandFiles) {
            const command = require(`../../commands/${file}`);
            commands.push(command.data.toJSON());
        }

		(async () => {
			try {
				if (process.env.ENV === "production") {
					const data = await rest.put(Routes.applicationCommands(clientId), {
						body: commands,
					});
					console.log(`Successfully registered ${commands.length} commands globally.`);
				} else {
					const data = await rest.put(Routes.applicationGuildCommands(clientId, process.env.GUILDID), {
						body: commands,
					});
					console.log(`Successfully registered ${commands.length} commands within test server.`);
				}
			} catch (error) {
				if (error) console.error(error);
			}
		})();
	}
}