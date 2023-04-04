const client = require("../../index");
const { EmbedBuilder } = require('discord.js');

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
    .on('playSong', (queue, song) =>
        queue.textChannel.send({ embeds: [new EmbedBuilder()
            .setColor('Green')
            .setDescription(`Length: \`${song.formattedDuration}\`\nRequested by: ${song.user}\n${status(queue)}`)
            .setTitle(`${song.name}`)
            .setURL(`${song.url}`)] })
    )

    .on('addSong', (queue, song) =>
        queue.textChannel.send({ embeds: [new EmbedBuilder()
            .setColor('Green')
            .setDescription(`Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`)] })
    )
    
    .on('addList', (queue, playlist) =>
        queue.textChannel.send({ embeds: [new EmbedBuilder()
            .setColor('Green')
            .setDescription(`Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`)] })
    )

    .on('error', (channel, e) => {
        if (channel) channel.send({ embeds: [new EmbedBuilder()
            .setColor('Red')
            .setDescription(`⛔ An error was encountered: ${e.toString().slice(0, 1974)}`)] })
        else console.error(e)
    })

    .on('empty', queue => queue.textChannel.send({ embeds: [new EmbedBuilder()
            .setColor('Red')
            .setDescription("Voice channel is empty! Leaving the channel...")] })
    )

    .on('searchNoResult', (message, query) =>
        message.channel.send({ embeds: [new EmbedBuilder()
            .setColor('Red')
            .setDescription(`⛔ No result found for \`${query}\`!`)], ephemeral: true })
    )

    .on('finish', queue => queue.textChannel.send({ embeds: [new EmbedBuilder()
        .setColor('Yellow')
        .setDescription("Queue completed, leaving the channel...")] })
    )