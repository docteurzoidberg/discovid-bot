const fakevideos = [
  {
    id: 1,
    title: 'Dune (2021)',
    type: 'movie',
    embedurl: 'https://imdb/382098098',
    ddl: ['https://seedboxbidule/incoming/Dune.2021.fullhd.bidule.machin.mkv'],
    keywords: [],
    description: '',
    reactions: [
      {user: 'ref', comment: 'genial', emoji: ':thumbsup:'},
      {user: 'tintin', comment: 'ca fé du bruit', emoji: ':ok_hand:'}
    ]
  }
];

module.exports = {
  connect: async function() {

  },
  close: async function() {

  },
  searchVideo: async function(searchopts) {
    return fakevideos;
  }
};