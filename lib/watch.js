const radarr = require('../lib/radarr');
const events = require('events');

module.exports = (id, movie) => {
    console.log('Watcher starting');

    const Watcher = new events.EventEmitter();
    
    Watcher.interval = null;
    Watcher.id = id;
    Watcher.movie = movie;

    Watcher.start = () => {
        console.log(`Start watching ${Watcher.id}`);
        if(Watcher.interval) {
            console.log('Already watching');
            return;
        }
        Watcher.interval = setInterval(Watcher.watch, 10000);
        Watcher.emit('started', id, movie);
    };

    Watcher.stop = () => {
        console.log(`Stop watching ${Watcher.id}`);
        if(Watcher.interval) {
            clearInterval(Watcher.interval);
            Watcher.interval = null;
        }
        Watcher.emit('stopped', id, item);
    };

    Watcher.watch = async () => {
        console.log(`Watching ${Watcher.id}...` );
        const moviefiledata = await radarr.getMovieFile(Watcher.id);
        if(!moviefiledata || moviefiledata.length === 0) {
            console.log(`${Watcher.id} is not downloaded yet`);
        } else {
            Watcher.item.movieFile = moviefiledata[0];
            Watcher.emit('downloaded', Watcher.id, Watcher.item);
            Watcher.stop();
        }
        
    };

    return Watcher;    
}
