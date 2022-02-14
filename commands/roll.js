const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Roll some dice")
        .addNumberOption(option => option.setName("amount").setDescription("How many dice to roll").setRequired(true))
        .addNumberOption(option => option.setName("die").setDescription("Select a die type").addChoices([
            ["d2", 2],
            ["d4", 4],
            ["d6", 6],
            ["d8", 8],
            ["d10", 10],
            ["d12", 12],
            ["d20", 20],
            ["d100", 100],
        ]).setRequired(true))
        .addNumberOption(option => option.setName("modifier").setDescription("Input a modifier if needed")),
    async execute(interaction, message, args) {
        if (args === "roll") return;
        var amount = interaction.options.getNumber("amount");
        var dice = interaction.options.getNumber("die");
        var mod = interaction.options.getNumber("modifier")

        if (mod > 0) var sign = " + "
        else if (mod < 0) var sign = " - "
        else var sign = "";

        var modText = Math.abs(mod)
        if (modText === 0) var modText = "";

        if (amount % 1 != 0 || amount < 1) return interaction.reply({ content: "Amount must be a whole number greater than or equal to 1", ephemeral: true });
        if (mod % 1 != 0) return interaction.reply({ content: "Modifier must be a whole number", ephemeral: true })

        var randomNumber = Math.floor(Math.random() * (amount * dice)) + Math.floor(amount / 2) + 1;
        var maxAmount = amount * dice;
        if (randomNumber < amount) var randomNumber = amount;
        if (randomNumber > maxAmount) var randomNumber = maxAmount;
        const rollEmbed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor({
                name: `${interaction.member.user.username}`,
                iconURL: `${interaction.member.user.displayAvatarURL({ dynamic: true })}`
            })
            .setDescription(`You rolled ${amount} D${dice}${sign}${modText}!`)
            .addFields(
                { name: 'Results', value: `**${randomNumber + mod}**` }
            )
            .setFooter({ text: `Roll with /roll` });
        await interaction.reply({ embeds: [rollEmbed] });
    },
};