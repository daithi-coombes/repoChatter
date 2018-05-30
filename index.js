const cli = require('./lib/Cli');

cli.init();
cli.promptGithub()
  .then(results => {
    return cli.searchTweets(results);
  })
  .then(results => {
    cli.displayResults(results);
  });
cli.bind();
