const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roll")
        .setDescription("Roll some dice")
        .addNumberOption(option => option.setName("amount").setDescription("How many dice to roll").setRequired(true))
        .addNumberOption(option => option.setName("die").setDescription("Select a die type").addChoices(
            { name: "d2", value: 2 },
            { name: "d4", value: 4 },
            { name: "d6", value: 6 },
            { name: "d8", value: 8 },
            { name: "d10", value: 10 },
            { name: "d12", value: 12 },
            { name: "d20", value: 20 },
            { name: "d100", value: 100 },
        ).setRequired(true))
        .addNumberOption(option => option.setName("modifier").setDescription("Enter a modifier to add"))
        .addStringOption(option => option.setName("note").setDescription("Add a note to the results")),
    async execute(interaction) {
        var amount = interaction.options.getNumber("amount");
        var dice = interaction.options.getNumber("die");
        var mod = interaction.options.getNumber("modifier");
        var note = interaction.options.getString("note");
        let breakdown = []
        let sum = 0

        if (amount > 100) return interaction.reply({ content: "Please enter 100 or less of the amount of dice.", ephemeral: true })

        if (mod > 0) var sign = " + "
        else if (mod < 0) var sign = " - "
        else var sign = "";

        var modText = Math.abs(mod)
        if (modText === 0) var modText = "";

        if (amount % 1 != 0 || amount < 1) return interaction.reply({ content: "Amount must be a whole number greater than or equal to 1", ephemeral: true });
        if (mod % 1 != 0) return interaction.reply({ content: "Modifier must be a whole number", ephemeral: true })

        for (i = 0; i < amount; i++) {
            breakdown[i] = Math.floor(Math.random() * dice + 1)
        }

        for (i = 0; i < breakdown.length; i++) {
            sum += breakdown[i]
        }

        let rollEmbed = new EmbedBuilder()
            .setAuthor({
                name: `${interaction.member.user.username}`,
                iconURL: `${interaction.member.user.displayAvatarURL({ dynamic: true })}`
            })
            .setDescription(`You rolled ${amount} D${dice}${sign}${modText}!`)
            .setFooter({ text: `Roll with /roll` });

        if (breakdown.includes(dice) && breakdown.includes(1)) {
            rollEmbed.setColor("Blue")
        } else if (breakdown.includes(dice)) {
            rollEmbed.setColor("Green")
        } else if (breakdown.includes(1)) {
            rollEmbed.setColor("Red")
        } else rollEmbed.setColor("Grey");

        if (breakdown[1]) {
            rollEmbed.addFields(
                { name: 'Total:', value: `${sum + mod}\n(${breakdown.join(" + ")}${sign}${modText})` },
            )
        } else if (!mod) {
            rollEmbed.addFields(
                { name: 'Roll:', value: `${sum}` },
            )
        } else {
            rollEmbed.addFields(
                { name: 'Total:', value: `${sum + mod}\n(${sum}${sign}${modText})` },
            )
        }


        if (note) {
            rollEmbed.addFields({ name: 'Note:', value: `${note}` })
        }
        await interaction.reply({ embeds: [rollEmbed] });
    },
};