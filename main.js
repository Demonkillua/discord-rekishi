require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");
const music = require("@koenie06/discord.js-music");

const client = new Discord.Client({
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
		Discord.Intents.FLAGS.GUILD_VOICE_STATES,
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

music.event.on('playSong', (channel, songInfo, requester) => {
	channel.send({ content: `Started playing the song **${songInfo.title}** - ${songInfo.duration} | Requested by \`${requester.tag}\`\n(${songInfo.url})` });
});

music.event.on('addSong', (channel, songInfo, requester) => {
	channel.send({ content: `Added the song **${songInfo.title}** - ${songInfo.duration} to the queue | Added by \`${requester.tag}\`\n(${songInfo.url})` });
});

music.event.on('playList', async (channel, playlist, songInfo, requester) => {
    channel.send({
        content: `Started playing the song **${songInfo.title}** by \`${songInfo.author}\` of the playlist ${playlist.title}.
        This was requested by ${requester.tag} (${requester.id})\n(${songInfo.url})`
    });
});

music.event.on('addList', async (channel, playlist, requester) => {
    channel.send({
        content: `Added the playlist **${playlist.title}** with ${playlist.videos.length} amount of videos to the queue.
        Added by ${requester.tag} (${requester.id})\n(${playlist.url})`
    });
});

music.event.on('finish', (channel) => {
	channel.send({ content: `All music has been played, disconnecting..` });
});

client.login(process.env.TOKEN);