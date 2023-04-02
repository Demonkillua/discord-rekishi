const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription("Moderation: Bulk delete recent messages.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addNumberOption(option => option.setName("amount").setDescription("Amount of messages to delete").setRequired(true))
		.addUserOption(option => option.setName("target").setDescription("User to target")),
	async execute(interaction) {
		const amount = interaction.options.getNumber("amount");
		const target = interaction.options.getMember("target");

		const Messages = await interaction.channel.messages.fetch();

		const response = new EmbedBuilder()
			.setColor("#ff5100")

		if (amount > 100 || amount <= 0) {
			response.setDescription(`Amount cannot exceed 100 and cannot be less than 1.`)
			return interaction.reply({
				embeds: [response],
				ephemeral: true,
			})
		}

		if (target) {
			let i = 0;
			const filtered = [];
			(await Messages).filter((m) => {
				if (m.author.id === target.id && amount > i) {
					filtered.push(m);
					i++;
				}
			})

			await interaction.channel.bulkDelete(filtered, true).then(messages => {
				if (messages.size < 2) {
					response.setDescription(`Cleared ${messages.size} message from ${target.user.username}.`)
					interaction.reply({
						embeds: [response],
						ephemeral: true,
					});
				} else {
					response.setDescription(`Cleared ${messages.size} messages from ${target.user.username}.`)
					interaction.reply({
						embeds: [response],
						ephemeral: true,
					});
				}
			})
		} else {
			await interaction.channel.bulkDelete(amount, true).then(messages => {
				if (messages.size < 2) {
					response.setDescription(`Cleared ${messages.size} message from the channel.`)
					interaction.reply({
						embeds: [response],
						ephemeral: true,
					});
				} else {
					response.setDescription(`Cleared ${messages.size} messages from the channel.`)
					interaction.reply({
						embeds: [response],
						ephemeral: true,
					});
				}
			})
		}
	}
};