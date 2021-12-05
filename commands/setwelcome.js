const { SlashCommandBuilder } = require('@discordjs/builders');
const serverSettingsModel = require("../models/serverSettingsSchema")

module.exports = {
	name: "setwelcome",
	permissions: ["MANAGE_GUILD"],
	data: new SlashCommandBuilder()
		.setName('setwelcome')
		.setDescription('Set up the channel for all welcome messages')
		.addChannelOption(option => option.setName("welcomechannel").setDescription("The channel to set for all welcome messages"))
		.addBooleanOption(option => option.setName("delete").setDescription("Pass as true to remove your welcome channel")),
	async execute(interaction) {
		if (interaction.options.getChannel("welcomechannel").type !== "GUILD_TEXT" && interaction.options.getBoolean("delete") !== true) {
			return interaction.reply({ content: "Selected channel must be a text channel.", ephemeral: true });
		} else if (interaction.options.getChannel("welcomechannel") && interaction.options.getBoolean("delete") !== true) {
			var setChannelId = interaction.options.getChannel("welcomechannel").id;
		} else if (!interaction.options.getChannel("welcomechannel") && interaction.options.getBoolean("delete") === false) {
			return interaction.reply({ content: "Interaction choices can not set or delete welcome channel.", ephemeral: true });
		} else if (interaction.options.getBoolean("delete") === true) var setChannelId = null;
		else return interaction.reply({ content: "You need to select at least one option to set or delete a welcome channel.", ephemeral: true });

		let serverSettingsData;
		try {
			serverSettingsData = await serverSettingsModel.findOne({ serverId: interaction.guild.id })
			if (!serverSettingsData) {
				let serverSettings = await serverSettingsModel.create({
					serverId: interaction.guild.id,
					welcomeChannelId: setChannelId,
				});

				if (setChannelId !== null) { interaction.reply({ content: `Welcome Channel set to ${interaction.options.getChannel("welcomechannel")}`, ephemeral: true }); }
				else interaction.reply({ content: "Welcome channel deleted", ephemeral: true });
			} else {
				await serverSettingsModel.findOneAndUpdate({
					serverId: interaction.guild.id
				}, {
					$set: { welcomeChannelId: setChannelId },
				});

				if (setChannelId !== null) { interaction.reply({ content: `Welcome Channel set to ${interaction.options.getChannel("welcomechannel")}`, ephemeral: true }) }
				else interaction.reply({ content: "Welcome channel deleted", ephemeral: true })
			}
		} catch (err) {
			console.log(err)
		}
	},
};