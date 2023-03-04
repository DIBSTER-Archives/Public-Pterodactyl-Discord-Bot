const Client = {
    allowedMentions: ({
        parse: ["roles", "users", "everyone"],
        users: [],
        roles: [],
        repliedUser: true
    }),
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_INTEGRATIONS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"],
    partials: ['USER', 'CHANNEL', 'MESSAGE', "REACTION"]
};

module.exports = Client;