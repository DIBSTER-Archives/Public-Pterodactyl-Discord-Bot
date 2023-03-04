const Mongo = require('mongoose');

const CodeDropsSchema = new Mongo.Schema({
    DroppedBy: { type: Number, required: true, unique: false },
    ServerCode: { type: String, required: true, unique: false},
    TimeDropped: {type: Number, required: false, unique: false }
});

const CodeDrops = Mongo.model('CodeDrops', CodeDropsSchema);

module.exports = CodeDrops;