const watch = require('../lib/watch');
const radarr = require('../lib/radarr'); 
const Watcher = require('../lib/watch');

async function main() {
    const lookupdata = await radarr.lookupMovie('Dobermann')
    const movie = lookupdata[0];
    var movieid = movie.id;
    if(!movieid) {
        const added = await radarr.addMovie(movie);
        if(!added) {
            console.log('No movie added');
            return;
        }
        movieid = added.id;
    }
   
    watch.on('started', function() {
        console.log(`watcher started`);
    });
    watch.on('added', function(movieid) {
        console.log(`${movieid} added`);
    });
    watch.on('removed', function(movieid) {
        console.log(`${movieid} removed`);
    });
    watch.on('downloaded', function(movieid) {
        Watcher.stop();
        console.log(`${movieid} downloaded`);
    });
    watch.add(movieid, movie);
    watch.start();
}

main();