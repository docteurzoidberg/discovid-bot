const radarr = require('../lib/radarr');
const config = require('../config.json');
const fs = require('fs');

async function main() {
    const moviefile = await radarr.getMovieFile(2);
    if(!moviefile) {
        console.log('No moviefile found');
        return;
    }
    fs.writeFileSync('./test-radar-moviefile.json', JSON.stringify(moviefile));
    console.log(moviefile);
}

main();
