
//contrib
var mongoose = require('mongoose');
var fs = require('fs');

//mine
var config = require('./config');

exports.init = function(cb) {
    mongoose.connect(config.mongodb, {
        useMongoClient: true
    }, function(err) {
        if(err) return cb(err);
        console.log("connected to mongo");
        cb();
    });
}

var pvsysSchema = mongoose.Schema({
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    comment: mongoose.Schema.Types.String,
    lon: mongoose.Schema.Types.Number,
    lat: mongoose.Schema.Types.Number,
    ownertype: mongoose.Schema.Types.String,
    county: mongoose.Schema.Types.String,
    connection: mongoose.Schema.Types.String,
    address: mongoose.Schema.Types.Mixed,
    year: mongoose.Schema.Types.Number,
    age: mongoose.Schema.Types.Number,
    installer: mongoose.Schema.Types.String,
    capacity_watt: mongoose.Schema.Types.Number,
    utility: mongoose.Schema.Types.String
});

// const pvdata = fs.readFileSync('./config/solarmap_data.js', 'utf-8');
// async function loadPvdata() {
//   try {
//     await Pvsys.insertMany(pvdata);
//     console.log('Done!' + length.pvdata);
//     process.exit();
//   } catch(e) {
//     console.log(e);
//     process.exit();
//   }
// };

exports.Pvsys  = mongoose.model('Pvsys', pvsysSchema);

