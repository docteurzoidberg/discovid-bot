const radarr = require('../lib/radarr');
var events = require('events');

var Watcher = new events.EventEmitter();

Watcher.interval = null;
Watcher.watchList = new Map();

Watcher.add = (id, movie) => {
    console.log(`Adding ${id} to watchlist`);
    Watcher.watchList.set(id, movie);
    Watcher.emit('added', id);
};

Watcher.remove = (movieId) => {
    console.log(`Removing ${movieId} from watchlist`);
    Watcher.watchList.delete(movieId);
    Watcher.emit('removed', movieId);
};

Watcher.start = () => {
    console.log('Watcher starting');
    Watcher.interval = setInterval(Watcher.watch, 10000);
    Watcher.emit('started');
};

Watcher.stop = () => {
    if(Watcher.interval) {
        clearInterval(Watcher.interval);
        Watcher.interval = null;
    }
};

Watcher.watch = async () => {
    console.log('Watching...');
    for([id, ctx] of Watcher.watchList.entries()) {
        const moviefiledata = await radarr.getMovieFile(id);
        if(!moviefiledata || moviefiledata.length === 0) {
            console.log(`${id} is not downloaded yet`);
        } else {
            ctx.movieFile = moviefiledata[0];
            Watcher.emit('downloaded', id, ctx);
            Watcher.remove(id);
        }
    };
};

module.exports = Watcher;