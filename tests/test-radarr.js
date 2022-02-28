const radarr = require('../lib/radarr');
const config = require('../config.json');
const fs = require('fs');

async function main() {
    const lookupdata = await radarr.lookupMovie('Fast and furious 1');
    if(!lookupdata || lookupdata.length === 0) {
        console.log('No movie found');
        return;
    }
    const result = lookupdata[0];
    fs.writeFileSync('./test-radar-lookup.json', JSON.stringify(result));
    var movieid=0;
    if(result.id && result.id>0) {
        console.error('Already added: ' + result.id);
        movieid = result.id;
    } else {
        //console.log(result);
        const added = await radarr.addMovie(result);
        if(!added) {
            console.log('No movie added');
            return;
        }
        fs.writeFileSync('./test-radar-addmovie.json', JSON.stringify(added));
        movieid = added.id;
    }
   
    const moviefile = await radarr.getMovieFile(movieid);
    if(!moviefile) {
        console.log('No moviefile found');
        return;
    }
    fs.writeFileSync('./test-radar-moviefile.json', JSON.stringify(moviefile));
    console.log(moviefile);
}

main();
