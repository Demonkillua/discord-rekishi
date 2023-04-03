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
                .setDescription("Stop playing music and exit the current voice channel"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("settings")
                .setDescription("Select settings")
                .addStringOption(option => option.setName("option").setDescription("Select settings option").addChoices(
                    { name: "🔃 Toggle Autoplay Mode", value: "autoPlay" },
                    { name: "⏸ Pause Music", value: "pause" },
                    { name: "🔜 View Queue", value: "queue" },
                    { name: "🔜 Add a Related Song", value: "relatedSong" },
                    { name: "🔁 Toggle Repeat Mode", value: "repeat" },
                    { name: "⏯ Resume Music", value: "resume" },
                    { name: "🔀 Shuffle Queue", value: "shuffle" },
                    { name: "⏭ Skip Song", value: "skip" },
                ).setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("volume")
                .setDescription("Change the volume of the music")
                .addIntegerOption(option => option.setName("percentage").setDescription("The new volume for the music. ex. 10 = 10%").setRequired(true))),
    async execute(interaction, client) {
        const { options, member, channel } = interaction;
        const VoiceChannel = member.voice.channel;
        const queue = await client.distube.getQueue(VoiceChannel);

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

                if (Options === "autoPlay") {
                    let autoPlayMode = await queue.toggleAutoplay(VoiceChannel);
                    return interaction.reply({ content: `Autoplay mode has been toggled ${autoPlayMode ? "On" : "Off"} by ${interaction.member.user.username}` });
                }

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

                if (Options === "relatedSong") {
                    await queue.addRelatedSong(VoiceChannel);
                    return interaction.reply({ content: "A random related song has been added to the queue." });
                }

                if (Options === "repeat") {
                    let repeatMode = await client.distube.setRepeatMode(queue);
                    return interaction.reply({ content: `Repeat mode has been toggled to ${repeatMode = repeatMode ? repeatMode == 2 ? "Queue" : "Song" : "Off"} by ${interaction.member.user.username}` });
                }

                if (Options === "resume") {
                    await queue.resume(VoiceChannel);
                    return interaction.reply({ content: "Song has been resumed." });
                }

                if (Options === "shuffle") {
                    let shuffleMode = await queue.shuffle(VoiceChannel);
                    return interaction.reply({ content: `Shuffle mode has been toggled ${shuffleMode ? "On" : "Off"} by ${interaction.member.user.username}` });
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