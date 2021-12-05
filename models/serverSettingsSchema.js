const mongoose = require("mongoose");

const serverSettingsSchema = new mongoose.Schema({
    serverId: { type: String, require: true},
    welcomeChannelId: { type: String },
});

const model = mongoose.model("ServerSettingsModel", serverSettingsSchema);

module.exports = model;