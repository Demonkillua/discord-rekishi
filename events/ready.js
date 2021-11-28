const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9")
const mongoose = require("mongoose");

module.exports = {
    name: "ready",
    once: true,
    execute(client, commands) {

        console.log("Rekishi is online!")

        client.user.setPresence({ activities: [{ name: `for /help`, type: 'WATCHING' }] })

        mongoose.connect(process.env.MONGODB_URI, {
            keepAlive: true,
        }).then(() => {
            console.log("Connected to the database!");
        }).catch((err) => {
            console.log(err);
        });

        const clientId = client.user.id;

		const rest = new REST({
			version: "9",
		}).setToken(process.env.TOKEN);

		(async () => {
			try {
				if (process.env.ENV === "production") {
					await rest.put(Routes.applicationCommands(clientId), {
						body: commands,
					});
					console.log("Successfully registered commands globally.");
				} else {
					await rest.put(Routes.applicationGuildCommands(clientId, process.env.GUILDID), {
						body: commands,
					});
					console.log("Successfully registered commands within test server.");
				}
			} catch (err) {
				if (err) console.log(err);
			}
		})();
    }
}