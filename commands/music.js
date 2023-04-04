const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

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
                    { name: "Toggle Autoplay Mode", value: "autoPlay" },
                    { name: "Pause Music", value: "pause" },
                    { name: "View Queue", value: "queue" },
                    { name: "Add a Related Song", value: "relatedSong" },
                    { name: "Toggle Repeat Mode", value: "repeat" },
                    { name: "Resume Music", value: "resume" },
                    { name: "Shuffle Queue", value: "shuffle" },
                    { name: "Skip Song", value: "skip" },
                ).setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("volume")
                .setDescription("Change the volume of the music")
                .addIntegerOption(option => option.setName("percentage").setDescription("The new volume for the music. ex. 10 = 10%").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName("pathfinder")
                .setDescription("Select Pathfinder Ambiance Music")),
    async execute(interaction, client) {
        const { options, member, channel } = interaction;
        const VoiceChannel = member.voice.channel;
        if (!VoiceChannel) return interaction.reply({ content: 'You need to be in a voice channel to use the music command!', ephemeral: true });
        const queue = await client.distube.getQueue(VoiceChannel);
        
        try {
            
            if (options.getSubcommand() === "play") {
                client.distube.play(VoiceChannel, options.getString("search"), { textChannel: channel, member: member });
                return interaction.reply({ content: "🎶 Processing Request 🎶", ephemeral: true });
            }

            if (options.getSubcommand() === "stop") {
                await queue.stop(VoiceChannel);
                return interaction.reply({ content: "Music has been stopped." });
            }
    
            if (options.getSubcommand() === "settings") {
                const Options = options.getString("option");
                
                if (!queue) return interaction.reply({ content: "⛔ There is not a current queue available.", ephemeral: true });

                if (Options === "autoPlay") {
                    let autoPlayMode = await queue.toggleAutoplay(VoiceChannel);
                    return interaction.reply({ content: `Autoplay mode has been toggled ${autoPlayMode ? "On" : "Off"} by ${member.user.username}` });
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
                    return interaction.reply({ content: `Repeat mode has been toggled to ${repeatMode = repeatMode ? repeatMode == 2 ? "Queue" : "Song" : "Off"} by ${member.user.username}` });
                }

                if (Options === "resume") {
                    await queue.resume(VoiceChannel);
                    return interaction.reply({ content: "Song has been resumed." });
                }

                if (Options === "shuffle") {
                    let shuffleMode = await queue.shuffle(VoiceChannel);
                    return interaction.reply({ content: `Shuffle mode has been toggled ${shuffleMode ? "On" : "Off"} by ${member.user.username}` });
                }

                if (Options === "skip") {
                    await queue.skip(VoiceChannel);
                    return interaction.reply({ content: "Song has been skipped." });
                }
            }
    
            if (options.getSubcommand() === "volume") {
                const Volume = options.getInteger("percentage");

                if (Volume > 100 || Volume < 1 || Volume % 1 != 0) return interaction.reply({ content: "You must input a whole number between 1 and 100.", ephemeral: true });

                client.distube.setVolume(VoiceChannel, Volume);
                return interaction.reply({ content: `Volume has been set to ${Volume}% by \`${member.user.username}\`` });
            }

            if (options.getSubcommand() === "pathfinder") {
                const pathfinder = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("pathfinderSong")
                            .setPlaceholder("Select a Song")
                            .addOptions(
                                { label: "Fireplace Sounds - Medieval Tavern - Inn Ambience | 1 hour", value: "https://www.youtube.com/watch?v=rv3Nl-Od9YU" },
                                { label: "Back Alley Tavern | Medieval Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=Ag8sbpNXBEQ" },
                                { label: "D&D Ambience - Crowded Local Tavern", value: "https://www.youtube.com/watch?v=EULoybB2Nsw" },
                                { label: "Skyrim - Music & Ambience - Taverns", value: "https://www.youtube.com/watch?v=dd10InDdvJE" },
                                { label: "Quiet Tavern | Innkeeper ASMR Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=b1DUhonNQXM" },
                                { label: "Inn Room Daytime | Adventure ASMR Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=yRAUv3D1i3s" },
                                { label: "Countryside | Farms, Peasants, Medieval, Relaxing Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=wEEc9RhHTzU" },
                                { label: "Fantasy Medieval Town Ambience | 45 minutes", value: "https://www.youtube.com/watch?v=ugLwYV1GSvo" },
                                { label: "D&D Ambience - Snow Village", value: "https://www.youtube.com/watch?v=HkIzMuvIhNQ" },
                                { label: "Blizzard | Winter Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=cpGgQHAublY" },
                                { label: "Walking in a Snow Forest - 3.5 HRS of Crunching Snow Sound", value: "https://www.youtube.com/watch?v=a_oqcg0hvpo" },
                                { label: "10 hours | Medieval City Ambience | Backround Sounds | ASMR, Study, Fairytale", value: "https://www.youtube.com/watch?v=ORsxCDaPtrc" },
                                { label: "Rainy Monster Infested Post-Apocalyptic City Ambience", value: "https://www.youtube.com/watch?v=958NL0xgjIU" },
                                { label: "Palace Corridors | Castle Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=BwV1azM1Ifw" },
                                { label: "Ruined Castle | Haunted Or Not ? Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=TqH8B0_YV8M" },
                                { label: "Dwarven Blacksmith Working In The Underground Dwarven City | Fantasy Ambience Sounds", value: "https://www.youtube.com/watch?v=OTcR7MWLVAc" },
                                { label: "Potion Shop Sounds | Apothecary Ambience | 45 Minutes", value: "https://www.youtube.com/watch?v=JCIfDCxakPE" },
                                { label: "Library Sounds | Study Ambience | 2 hours", value: "https://www.youtube.com/watch?v=4vIQON2fDWM" },
                                { label: "Natural Ambiance - Cathedral (choir, footsteps, fireplace, bells)", value: "https://www.youtube.com/watch?v=gFwUEAL8A4Q" },
                                { label: "Rainy Night In A Medieval Priory - Monastery Ambience", value: "https://www.youtube.com/watch?v=2kjotqXfWeg" },
                                { label: "School Of Magic | Enchanted Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=xKBXnGcDO2Y" },
                                { label: "Wizard Tower | Ambience | 2 hours", value: "https://www.youtube.com/watch?v=TPs5PGBarIA" },
                                { label: "Cozy Camp in Eerie Forest | Campfire and Spooky Woods Sounds ・ Soundscape Ambience for D&D || RDR2", value: "https://www.youtube.com/watch?v=LYF2VzCN0os" },
                                { label: "D&D Ambience - Night Camp in Woods", value: "https://www.youtube.com/watch?v=7KFoj-SOfHs" },
                                { label: "River Campsite - Relaxing Nature Sounds | 2 Hours", value: "https://www.youtube.com/watch?v=wJ51tp1OYMg" }
                            ),
                    );

                    const pathfinder1 = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId("pathfinderSong1")
                                .setPlaceholder("Select a Song")
                                .addOptions(
                                    { label: "Nobles' Garden | Nature Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=Ci0XbtlNMys" },
                                    { label: "Waterfall Sounds - Garden Pond, Bird Life | 2 hours", value: "https://www.youtube.com/watch?v=euEwKtP5CG4" },
                                    { label: "Rain On Window with Thunder Sounds - Rain in Forest at Night - 10 Hours", value: "https://www.youtube.com/watch?v=x7SQaDTSrVg" },
                                    { label: "1870s Victorian London Thunderstorm | ASMR Ambience", value: "https://www.youtube.com/watch?v=adb6oCUqMtk" },
                                    { label: "Mountain Rain & Thunderstorm Sleep Sounds - Ambient Noise For Sleep & Meditation", value: "https://www.youtube.com/watch?v=Qo4JIT8jMtI" },
                                    { label: "Dominican Beach with Waves Rolling - Natural Background With Ocean Sounds", value: "https://www.youtube.com/watch?v=NLs3LqVgpT4" },
                                    { label: "D&D Ambience - Coastal Town", value: "https://www.youtube.com/watch?v=CY97XoaEjFg" },
                                    { label: "Harbor Sounds | Seaside Market Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=frEJTGfLOhM" },
                                    { label: "Pirate Ship in Thunderstorm [12 HOURS] - Creaky Wooden Pirate Ship Ambience with RAIN", value: "https://www.youtube.com/watch?v=4lf5i6goI3E" },
                                    { label: "Swamp Sounds at Night - Frogs, Crickets, Light Rain, Forest Nature Sounds", value: "https://www.youtube.com/watch?v=ih4_1FyVjaY" },
                                    { label: "D&D Ambience | Mysterious Jungle | Immersive, Realistic, Animals", value: "https://www.youtube.com/watch?v=5Jzp5H4mQVE" },
                                    { label: "Overgrown Ruins | Mysterious Jungle Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=Mmt7fK90m4I" },
                                    { label: "Phoberos Badlands | Theros ASMR Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=pOm7g9Awm4I" },
                                    { label: "DARK FOREST Ambience and Music - sounds of dark misty forest", value: "https://www.youtube.com/watch?v=EUer-Tto1ZA" },
                                    { label: "Forest Sounds | Woodland Ambience, Bird Song", value: "https://www.youtube.com/watch?v=xNN7iTA57jM" },
                                    { label: "Relaxing River - Water Stream & Birdsong Sounds - Sleep/Study/Meditate", value: "https://www.youtube.com/watch?v=zofBinqC2F4" },
                                    { label: "Relaxing River Sounds - Peaceful Forest River - 3 Hours Long", value: "https://www.youtube.com/watch?v=IvjMgVS6kng" },
                                    { label: "Duck Pond | Relaxing Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=KuZbAhX3z1U" },
                                    { label: "Forest Shrine | Magic, Enchanted, Nature, Faeries, Relaxing Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=-dDKzp_QA1o" },
                                    { label: "Haunted Forest Sounds | Ghostly Murmurs | 1 Hour", value: "https://www.youtube.com/watch?v=58dAcjgtfbk" },
                                    { label: "Haunted Mansion | Ambience | 2 hours", value: "https://www.youtube.com/watch?v=SWX1FkkeXkw" },
                                    { label: "Middle Earth | Rivendell - Music & Ambience", value: "https://www.youtube.com/watch?v=62j1xAdYKAQ" },
                                    { label: "D&D Ambience - Horse And Cart", value: "https://www.youtube.com/watch?v=65TV8jhp9Ns" },
                                    { label: "Carriage Ride Through the Woods | ASMR Ambience", value: "https://www.youtube.com/watch?v=xE0cgp4DbwU&t=1s" },
                                    { label: "Wind Blowing Across The Forest Meadow / Wind Through The Grass", value: "https://www.youtube.com/watch?v=yEn8_X7Ei3A" }
                                )
                        )

                    const pathfinder2 = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId("pathfinderSong2")
                                .setPlaceholder("Select a Song")
                                .addOptions(
                                    { label: "Tinkerer's Workshop | Steampunk Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=hCVA_0vRisw" },
                                    { label: "Craftsmens' Guild | Workers, Artisanship, Smiths, Tinkerers, Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=Yg5qWYP6wjo" },
                                    { label: "Magic Items Shop | Enchanted ASMR Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=x0CM_CPTotE" },
                                    { label: "Medieval Slums | Poverty, Underprivileged, Rats, Sickness, Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=UlbxDQMo1o4" },
                                    { label: "Mountain Village | Medieval, Peasants, Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=wPRIQMj94kE" },
                                    { label: "Windy Desert | Immersive, Realistic Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=4E-_Xpj0Mgo" },
                                    { label: "10 Hours Lava Flow, Kilauea Hawaii", value: "https://www.youtube.com/watch?v=kTpglKDyn4s" },
                                    { label: "Inside A Volcano | Magma, Searing Fire, Lava, Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=i56VB6j6kHE" },
                                    { label: "Volcano Temple | Sacred ASMR Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=fUN-T3zwAYc" },
                                    { label: "D&D Ambience - [CoS] - Catacombs", value: "https://www.youtube.com/watch?v=WPpVMmTt74Q" },
                                    { label: "Abandoned Tunnel | Post Apocalyptic Ambience | 2 hours", value: "https://www.youtube.com/watch?v=QrByMTa_rjQ" },
                                    { label: "D&D Ambience - Generic Dungeon", value: "https://www.youtube.com/watch?v=wScEFaoqwPM" },
                                    { label: "Deep Cave Ambience - 9 Hr Soundscape, Wind & Water", value: "https://www.youtube.com/watch?v=YZ2GanJIGbk" },
                                    { label: "Dark Cave Ambience | Cave Sounds | wind | 15 Minutes", value: "https://www.youtube.com/watch?v=NxxiCipxCBA" },
                                    { label: "D&D Ambience - Dark, Dank Cave | 3 Hours", value: "https://www.youtube.com/watch?v=E72yDpAfrgY" },
                                    { label: "D&D Ambience - The Underdark", value: "https://www.youtube.com/watch?v=NMUoicf5kYw" },
                                    { label: "Graveyard | Haunted Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=9DMvOFglC9A" },
                                    { label: "Prison | Immersive Medieval Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=FVmWdIwjgKA" },
                                    { label: "RPG Ambience - Joyful Festival (crowd, music, cheering)", value: "https://www.youtube.com/watch?v=gcPSA3sUilc" },
                                    { label: "Medieval Festival | Bear Tamers, Music, People, Blacksmith, Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=rEfKdWSlcUo" },
                                    { label: "Stadium Crowd Sound Effects | One Hour | HQ", value: "https://www.youtube.com/watch?v=-FLgShtdxQ8" },
                                    { label: "Arena Fight | Medieval Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=v5c0zLmVZR4" },
                                    { label: "Arena Group Fight With Magic | Combat ASMR Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=FIXRdRvD1vA" },
                                    { label: "RPG | D&D Ambience - Town Panic (screams, crowd, bells)", value: "https://www.youtube.com/watch?v=Sw9yC8rKcAY" },
                                    { label: "Battle In the City | Distant Fight, Ruined District, Building Collapsing, Ambience | 1 Hour", value: "https://www.youtube.com/watch?v=nEjMmL1nfsk" }
                                )
                        )

                    const pathfinder3 = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId("pathfinderSong3")
                                .setPlaceholder("Select a Song")
                                .addOptions(
                                    { label: "d&d Battle music", value: "https://www.youtube.com/watch?v=w0sUw735gRw" },
                                    { label: "D&D Battle Music 2", value: "https://www.youtube.com/watch?v=4szfmKTFoXA" },
                                    { label: "Darkest Dungeon - Combat Music", value: "https://www.youtube.com/watch?v=JYFU_RiefKk&t=1s" },
                                    { label: "\"VIKINGS\" | Most Epic Viking & Nordic Folk Music | Danheim", value: "https://www.youtube.com/watch?v=V5Watai4qPM" },
                                    { label: "D&D Official Roleplaying Soundtrack - Troubled Times", value: "https://www.youtube.com/watch?v=fV0YX166H_I" },
                                    { label: "Epic Battle Music VI", value: "https://www.youtube.com/watch?v=OAm2rsIibOw" },
                                    { label: "Baldur's Gate 1&2, Epic Dragon Battle Music Mix, D&D Fantasy Game Music", value: "https://www.youtube.com/watch?v=zyF9KQ_Vut4" },
                                    { label: "The Witcher 3 - Battle & Combat Music Mix - Medieval Instrumental", value: "https://www.youtube.com/watch?v=33q0sV030t0" },
                                    { label: "Fantasy battle theme", value: "https://www.youtube.com/watch?v=UmmL-73hT0s" },
                                    { label: "Lord of the Rings Battle Music Mix", value: "https://www.youtube.com/watch?v=M_qb89uGi0Y" },
                                    { label: "Germanic War Drums 1 hour Germania Forest Drums", value: "https://www.youtube.com/watch?v=bMu19nVkafM" },
                                    { label: "Drums of Drakkar Viking and medieval music", value: "https://www.youtube.com/watch?v=Hhq-WxifYt0" },
                                    { label: "Remnant: From the Ashes (OST) Ent", value: "https://www.youtube.com/watch?v=SEnGkdJCEas" },
                                    { label: "Godzilla's Theme (King of the Monsters Suite)", value: "https://www.youtube.com/watch?v=j2iUQ6sta_c" },
                                )
                        )
                await interaction.reply({ components:  [pathfinder, pathfinder1, pathfinder2, pathfinder3], ephemeral: true });
            }

            return;
            
        } catch(error) {
            let errorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`⛔ Error: ${error}`);
            return interaction.reply({ embeds: [errorEmbed] });
        }
    }
}