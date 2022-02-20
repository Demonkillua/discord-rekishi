const { SlashCommandBuilder } = require("@discordjs/builders");
const music = require("@koenie06/discord.js-music");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Control youtube music in the users current voice channel")
        .addSubcommand(subcommand =>
            subcommand
                .setName("play")
                .setDescription("Play music in your current voice chat")
                .addStringOption(option => option.setName("search").setDescription("Search a song").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("queue")
                .setDescription("Check the music queue"))
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName("pause")
        //         .setDescription("Pause the playing audio"))
        // .addSubcommand(subcommand =>
        //     subcommand
        //         .setName("resume")
        //         .setDescription("Resume playing the paused audio"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("skip")
                .setDescription("Skip to the next in queue"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("repeat")
                .setDescription("Repeat the current song")
                .addBooleanOption(option => option.setName("onoroff").setDescription("True to repeat, False to stop repeating").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("stop")
                .setDescription("Stop playing music"))
        .addSubcommand(subcommand =>
            subcommand
                .setName("volume")
                .setDescription("Change the colume of the music")
                .addIntegerOption(option => option.setName("volume").setDescription("The new volume for the music").setRequired(true))),
    async execute(interaction, message, args) {
        if (args === "music") return;

        const isConnected = await music.isConnected({
            interaction: interaction
        });
        const voiceChannel = interaction.member.voice.channel;

        if (interaction.options.getSubcommand() === "play") {
            const song = interaction.options.getString('search');

            if (!voiceChannel) return interaction.reply({ content: 'You need to be in a voice channel!', ephemeral: true });

            music.play({
                interaction: interaction,
                channel: voiceChannel,
                song: song
            });

            return interaction.reply({ content: "Song added to queue.", ephemeral: true });
        }

        if (interaction.options.getSubcommand() === "queue") {
            if (!isConnected) return interaction.reply({ content: 'There is currently nothing in the queue!', ephemeral: true });

            const queue = await music.getQueue({
                interaction: interaction
            });

            let response = ``;

            for (let i = 0; i < queue.length; i++) {
                response += `${i + 1}. [${queue[i].info.title}](${queue[i].info.url}) - ${queue[i].info.duration}\n`
            };

            return interaction.reply({ content: response });
        }

        // if(interaction.options.getSubcommand() === "pause") {
        //     if(!isConnected) return interaction.reply({ content: 'There are no songs playing right now.', ephemeral: true });

        //     const isPaused = music.isPaused({
        //         interaction: interaction
        //     });

        //     if(isPaused) return interaction.reply({ content: "Music is already paused", ephemeral: true });

        //     music.pause({
        //         interaction: interaction
        //     });

        //     return interaction.reply({ content: `Paused the music` });
        // }

        // if(interaction.options.getSubcommand() === "resume") {
        //     if(!isConnected) return interaction.reply({ content: 'There are no songs playing', ephemeral: true });

        //     const isResumed = music.isResumed({
        //         interaction: interaction
        //     });
        //     if(isResumed) return interaction.reply({ content: 'The song is already resumed', ephemeral: true });

        //     music.resume({
        //         interaction: interaction
        //     });

        //     interaction.reply({ content: `Resumed the music` });
        // }

        if (interaction.options.getSubcommand() === "repeat") {
            if (!isConnected) return interaction.reply({ content: 'There are no songs playing', ephemeral: true });

            const boolean = interaction.options.getBoolean('onoroff');


            const isRepeated = music.isRepeated({
                interaction: interaction
            });
            if(isRepeated === boolean) return interaction.reply({ content: `Repeat mode is already on ${boolean}`, ephemeral: true });


            music.repeat({
                interaction: interaction,
                value: boolean
            });

            interaction.reply({ content: `Turned repeat mode to ${boolean}` });
        }

        if (interaction.options.getSubcommand() === "skip") {
            if (!isConnected) return interaction.reply({ content: 'There are no songs playing', ephemeral: true });

            music.skip({
                interaction: interaction
            });

            return interaction.reply({ content: `Skipped the song` });
        }

        if (interaction.options.getSubcommand() === "stop") {
            if (!isConnected) return interaction.reply({ content: 'There are no songs playing', ephemeral: true });

            music.stop({
                interaction: interaction
            });

            return interaction.reply({ content: "Stopped playing all music." });
        }

        if (interaction.options.getSubcommand() === "volume") {
            const volume = interaction.options.getInteger('volume');

            if (volume > 100) return interaction.reply({ content: 'Can\'t go higher than 100%', ephemeral: true });

            const isConnected = await music.isConnected({
                interaction: interaction
            });
            if (!isConnected) return interaction.reply({ content: 'There are no songs playing', ephemeral: true });

            music.volume({
                interaction: interaction,
                volume: volume
            });

            interaction.reply({ content: `Set the volume to ${volume}` });
        }
    }
}