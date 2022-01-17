require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");

const client = new Discord.Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
	],
});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

const load_dir = (dirs) => {
	const event_files = fs.readdirSync(`./events/${dirs}`).filter(file => file.endsWith('.js'));

	for (const file of event_files) {
		const event = require(`./events/${dirs}/${file}`);
		const event_name = file.split('.')[0];;

		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, commands, Discord, client));
		} else if (file == "messageCreate.js") {
			client.on(event_name, event.bind(null, Discord, client))
		} else {
			client.on(event.name, (...args) => event.execute(...args, Discord, client));
		}
	}
}

['client', 'guild'].forEach(e => load_dir(e));

client.login(process.env.TOKEN);