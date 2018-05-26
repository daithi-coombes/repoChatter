const cli = require('commander'),
  Promises = require('bluebird'),
  {prompt} = require('inquirer');

/**
 * Handle interactive terminal.
 *
 * @class Cli
 */
module.exports = class Cli{

  /**
   * Display results to user.
   * @todo loop back to ::promptGithub?
   * @param  {Object} results In format {repos, tweets}
   */
  static displayResults(results){
    console.log('displaying results: ', results);
  }

  /**
   * Search github by keyword.
   * @return {Promise} Resolves to {ObjectArray}
   */
  static promptGithub(){
    console.log('prompting github');
    return Promise.resolve([{},{}]);
  }

  /**
   * Run the cli. Binds to process.argv
   * @uses commaderjs
   */
  static run(){
    cli.parse(process.argv);
  }

  /**
   * Search for tweets about repo's
   *
   * @param  {ObjectArray} repos Repo list returned from self::promptGithub
   * @return {Promise}       Resolves to {repos, tweets}
   */
  static searchTweets(repos){
    console.log('getting tweets');
    return Promise.resolve({repos: [], tweets: []});
  }

}
