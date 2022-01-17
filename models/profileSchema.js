const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userID: { type: String, require: true },
    serverID: { type: String, require: true },
    userName: { type: String },
    serverName: { type: String },
    contributor: { type: Boolean },
    copper: { type: Number, default: 1000 },
    silver: { type: Number },
    gold: { type: Number },
    platinum: { type: Number },
    bank: { type: Number },
    totalCopper: { type: Number, default: 1000 },
    totalSilver: { type: Number },
    totalGold: { type: Number },
    totalPlatinum: { type: Number },
    exp: { type: Number },
    level: { type: Number, default: 1 },
    inventory: {
        type: Object,
        head: { type: String },
        neck: { type: String },
        cloak: { type: String },
        hands: { type: String },
        ring1: { type: String },
        ring2: { type: String },
        belt: { type: String },
        feet: { type: String },
        armor: { type: String },
        hand1: { type: String },
        hand2: { type: String },
        bag: { type: Array },
    },
});

const model = mongoose.model("ProfileModels", profileSchema);

module.exports = model;