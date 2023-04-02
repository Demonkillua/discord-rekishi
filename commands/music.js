const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Control youtube music in the users current voice channel")
        .setDefaultMemberPermissions(PermissionFlagsBits.Speak)
        .addSubcommand(subcommand =>
            subcommand
                .setName("play")
                .setDescription("Play music in your current voice chat")
                .addStringOption(option => option.setName("search").setDescription("Search a song").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("stop")
                .setDescription("Stop playing and exit the current voice channel"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("settings")
                .setDescription("Select settings")
                .addStringOption(option => option.setName("option").setDescription("Select settings option").addChoices(
                    { name: "pause", value: "pause" },
                    { name: "queue", value: "queue" },
                    { name: "resume", value: "resume" },
                    { name: "skip", value: "skip" },
                ).setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("volume")
                .setDescription("Change the volume of the music")
                .addIntegerOption(option => option.setName("percentage").setDescription("The new volume for the music. ex. 10 = 10%").setRequired(true))),
    async execute(interaction, client) {
        const { options, member, channel } = interaction;
        const queue = await client.distube.getQueue(VoiceChannel);
        const VoiceChannel = member.voice.channel;

        if (!VoiceChannel) return interaction.reply({ content: 'You need to be in a voice channel to use the music command!', ephemeral: true });
        
        try {

            if (interaction.options.getSubcommand() === "play") {
                client.distube.play(VoiceChannel, options.getString("search"), { textChannel: channel, member: member });
                return interaction.reply({ content: "🎶 Processing Request 🎶", ephemeral: true });
            }

            if (interaction.options.getSubcommand() === "stop") {
                await queue.stop(VoiceChannel);
                return interaction.reply({ content: "Music has been stopped." });
            }
    
            if (interaction.options.getSubcommand() === "settings") {
                const Options = options.getString("option");
                
                if (!queue) return interaction.reply({ content: "⛔ There is not a current queue available.", ephemeral: true });

                if (Options === "pause") {
                    await queue.pause(VoiceChannel);
                    return interaction.reply({ content: "Song has been paused." });
                }

                if (Options === "queue") {
                    let queueEmbed = new EmbedBuilder();
                    queueEmbed
                        .setColor("Blurple")
                        .setDescription(`${queue.songs.map(
                            (song, id) => `\n**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
                        )}`)

                    return interaction.reply({ embeds: [queueEmbed] });
                }

                if (Options === "resume") {
                    await queue.resume(VoiceChannel);
                    return interaction.reply({ content: "Song has been resumed." });
                }

                if (Options === "skip") {
                    await queue.skip(VoiceChannel);
                    return interaction.reply({ content: "Song has been skipped." });
                }
            }
    
            if (interaction.options.getSubcommand() === "volume") {
                const Volume = options.getInteger("percentage");

                if (Volume > 100 || Volume < 1 || Volume % 1 != 0) return interaction.reply({ content: "You must input a whole number between 1 and 100.", ephemeral: true });

                client.distube.setVolume(VoiceChannel, Volume);
                return interaction.reply({ content: `Volume has been set to ${Volume}% by \`${interaction.member.user.username}\`` });
            }
            return;
            
        } catch(error) {
            let errorEmbed = new EmbedBuilder();
            errorEmbed
                .setColor("Red")
                .setDescription(`⛔ Error: ${error}`)
            return interaction.reply({ embeds: [errorEmbed] });
        }
    }
}