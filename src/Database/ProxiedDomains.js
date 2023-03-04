const Mongo = require('mongoose');

const ProxiedDomainsSchema = new Mongo.Schema({
    Domain: {
        Name: { type: String, required: true, unique: true },
        IP: { type: String, required: true, unique: false },
        Port: { type: String, required: true, unique: false }
    },
    User: {
        DiscordID: { type: Number, required: true, unique: true },
        ConsoleID: { type: Number, required: true, unique: true },
    },
    Server: {
        UUID: { type: String, required: true, unique: true },
        ShortUUID: { type: String, required: true, unique: true }
    },
    TimeSaved: { type: Number, required: true, unique: false }
});

const ProxiedDomains = Mongo.model('ProxiedDomains', ProxiedDomainsSchema);

module.exports = ProxiedDomains;
