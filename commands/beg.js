const { SlashCommandBuilder } = require("@discordjs/builders");
const profileModel = require("../models/profileSchema");

module.exports = {
    name: "beg",
    cooldown: 900,
    data: new SlashCommandBuilder()
        .setName("beg")
        .setDescription("beg for currency."),
    async execute(interaction, message, args) {
        var typeId = interaction.member.user.id;
        var guildId = interaction.member.guild.id;
        var replyUser = interaction.member.displayName;

        if (Math.floor(Math.random() * 2) > 0) { var randomCopper = Math.floor(Math.random() * 50) + 1 } else { var randomCopper = Math.floor(Math.random() * 20) + 1 };
        if (Math.floor(Math.random() * 5) > 3) { var randomSilver = Math.floor(Math.random() * 11) } else if (Math.floor(Math.random() * 3) > 1) {
            var randomSilver = Math.floor(Math.random() * 7)
        } else var randomSilver = Math.floor(Math.random() * 3);
        if (Math.floor(Math.random() * 20) > 18) { var randomGold = Math.floor(Math.random() * 2) } else { var randomGold = 0 };

        let profileData = await profileModel.findOne({ userID: typeId, serverID: guildId });
        if (!profileData) return await interaction.reply({ content: "Profile Data missing... Data created, please enter the command again. Cooldown may be in effect.", ephemeral: true });

        if (args === "beg" && profileData.contributor !== true) return interaction.channel.send("Become a contributor to use this command with a prefix!");
        
        const response = await profileModel.findOneAndUpdate(
            {
                userID: typeId,
                serverID: guildId,
            },
            {
                $inc: {
                    copper: randomCopper,
                    silver: randomSilver,
                    gold: randomGold,
                    totalCopper: randomCopper,
                    totalCopper: randomSilver,
                    totalCopper: randomGold,
                },
            }
        );

        const randomBegged = Math.floor(Math.random() * 10);
        const begged = [
            "begged and received",
            "made it big this time around and got",
            "stuck gold and received",
            "made out alright and received",
            "were noticed by another begger and received",
            "were pitied by a kind soul and gained",
            "almost lost hope until someone took pity upon you. You gained",
            "got noticed by a rich man and received",
            "got noticed by a rich woman and received",
            "were on the streets for hours, but you made"
        ]

        if (randomGold > 0 && randomSilver < 1) {
            var begReply = interaction.reply(`**${replyUser}**, you ${begged[randomBegged]} **${randomGold}** gold and **${randomCopper}** copper.`)
        } else if (randomGold > 0 && randomSilver > 0) {
            var begReply = interaction.reply(`**${replyUser}**, you ${begged[randomBegged]} **${randomGold}** gold, **${randomSilver}** silver, and **${randomCopper}** copper.`)
        } else if (randomGold < 1 && randomSilver > 0) {
            var begReply = interaction.reply(`**${replyUser}**, you ${begged[randomBegged]} **${randomSilver}** silver and **${randomCopper}** copper.`)
        } else var begReply = interaction.reply(`**${replyUser}**, you ${begged[randomBegged]} **${randomCopper}** copper.`);

        await begReply;
    },
};