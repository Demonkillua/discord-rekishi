const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const guildNumber = new Map();
const guildAttempts = new Map();

function guildNumberMap(interaction) {
    const guildId = interaction.guild.id;

    var number = Math.floor(Math.random() * 20000) + 1;
    if (!guildNumber.get(guildId)) {
        guildNumber.set(guildId, number);
    }
}

function guildAttemptsMap(message) {
    const guildId = message.guild.id;
    if (!guildAttempts.get(guildId)) {
        guildAttempts.set(guildId, { attempts: 1 });
    } else {
        guildAttempts.get(guildId).attempts++;
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("guess")
        .setDescription("Try to guess the number!")
        .addNumberOption(option => option.setName("number").setDescription("Input your guess (between 1 and 20,000)").setRequired(true)),
    async execute(interaction) {

        const provideaguess = new EmbedBuilder()
            .setColor('#F30B04')
            .setDescription(`**❌ Please provide a guess!**`)

        const pickinganumber = new EmbedBuilder()
            .setColor('#33F304')
            .setDescription('**Picking a number between 1 and 20000**')

        await guildNumberMap(interaction);
        await guildAttemptsMap(interaction);

        let guess = interaction.options.getNumber("number");
        if (!guess && guildAttempts.get(interaction.guild.id).attempts === 1) {
            return interaction.reply({ embeds: [pickinganumber] })
        } else if (!guess) {
            return interaction.reply({ embeds: [provideaguess] });
        }

        if (+guess === guildNumber.get(interaction.guild.id)) {
            let attempts = guildAttempts.get(interaction.guild.id);

            const guessedthenumber = new EmbedBuilder()
                .setColor('#33F304')
                .setDescription(`✅ Perfect, ${interaction.member.user} the number was ${guildNumber.get(interaction.guild.id)}, it only took you ${attempts.attempts} attempts!`)

            interaction.reply({ embeds: [guessedthenumber] });
            guildNumber.delete(interaction.guild.id);
            guildAttempts.delete(interaction.guild.id);

            return;
        } else if (+ guess < guildNumber.get(interaction.guild.id)) {
            return interaction.reply(`${guess} Is too low!`);
        } else if (+ guess > guildNumber.get(interaction.guild.id)) {
            return interaction.reply(`${guess} Is too high!`);
        } else {
            return interaction.reply("Invalid number please try again");
        }
    },
};