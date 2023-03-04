const Mongo = require('mongoose');

const UserAccountsSchema = new Mongo.Schema({
    Email: { type: String, required: true, unique: true },
    FirstName: { type: String, required: true, unique: false },
    LastName: { type: String, required: true, unique: false },
    Username: { type: String, required: true, unique: true },
    ConsoleID: { type: Number, required: true, unique: true },
    DiscordID: { type: Number, required: true, unique: true },
    TimeSaved: { type: Number, required: true, unique: false },
    PremiumServers: { type: Number, required: true, unique: false },
    NormalServers: { type: Number, required: true, unique: false },
    Domains: [{
        Name: { type: String, required: true, unique: true },
        IP: { type: String, required: true, unique: false },
        Port: { type: String, required: true, unique: false }
    }]
});

const UserAccounts = Mongo.model('UserAccounts', UserAccountsSchema);

module.exports = UserAccounts;