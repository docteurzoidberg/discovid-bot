const radar = require('../lib/radarr');

radar.getProfiles().then(function(profiles) {
    console.log(profiles);
});