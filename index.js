const cli = require('./lib/Cli');

cli.init();
cli.promptGithub()
  .then(keyword => {
    return cli.searchGithub(keyword);
  })
  .then(results => {
    return cli.searchTweets(results);
  })
  .then(results => {
    cli.displayResults(results);
  });
cli.bind();
