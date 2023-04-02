const profileModel = require("../../models/profileSchema");

module.exports = async (message, client) => {
    if (message.author.bot) return;

    let profileData;
    try {
        profileData = await profileModel.findOne({ userID: message.author.id, serverID: message.guild.id });
        if (!profileData) {
            let profile = await profileModel.create({
                userID: message.author.id,
                serverID: message.guild.id,
                userName: member.user.username,
				serverName: member.guild.name,
                contributor: false,
                copper: 1000,
                silver: 0,
                gold: 0,
                platinum: 0,
                bank: 0,
                totalCopper: 1000,
                totalSilver: 0,
                totalGold: 0,
                totalPlatinum: 0,
                exp: 0,
                level: 1,
                inventory: {
                    head: null,
                    neck: null,
                    cloak: null,
                    hands: null,
                    ring1: null,
                    ring2: null,
                    belt: null,
                    feet: null,
                    lhand: null,
                    rhand: null,
                    bag: [

                    ],
                },
            });
        }
    } catch (error) {
        console.error(error);
    }
}