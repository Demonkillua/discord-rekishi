const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const serverSettingsModel = require("../models/serverSettingsSchema")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setgoodbye")
        .setDescription("Administation: Set up the channel for all goodbye messages")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option => option.setName("goodbyechannel").setDescription("The channel to set for all goodbye messages"))
        .addBooleanOption(option => option.setName("delete").setDescription("Pass as true to remove your goodbye channel")),
    async execute(interaction) {
        if (!interaction.options.getBoolean("delete") && !interaction.options.getChannel("goodbyechannel")) {
            return interaction.reply({ content: "You need to select at least one option to set or delete a goodbye channel.", ephemeral: true });
        } else if (interaction.options.getBoolean("delete") === true) {
            var setChannelId = null;
        } else if (interaction.options.getChannel("goodbyechannel").type !== "GUILD_TEXT" && interaction.options.getBoolean("delete") !== true) {
            return interaction.reply({ content: "Selected channel must be a text channel.", ephemeral: true });
        } else var setChannelId = interaction.options.getChannel("goodbyechannel").id;


        let serverSettingsData;
        try {
            serverSettingsData = await serverSettingsModel.findOne({ serverId: interaction.guild.id })
            if (!serverSettingsData) {
                let serverSettings = await serverSettingsModel.create({
                    serverId: interaction.guild.id,
                    welcomeChannelId: null,
                    goodbyeChannelId: setChannelId,
                });

                if (setChannelId !== null) { interaction.reply({ content: `goodbye Channel set to ${interaction.options.getChannel("goodbyechannel")}`, ephemeral: true }); }
                else interaction.reply({ content: "goodbye channel deleted", ephemeral: true });
            } else {
                await serverSettingsModel.findOneAndUpdate({
                    serverId: interaction.guild.id
                }, {
                    $set: { goodbyeChannelId: setChannelId },
                });

                if (setChannelId !== null) { interaction.reply({ content: `goodbye Channel set to ${interaction.options.getChannel("goodbyechannel")}`, ephemeral: true }) }
                else interaction.reply({ content: "Goodbye channel deleted", ephemeral: true })
            }
        } catch (err) {
            console.log(err)
        }
    },
};