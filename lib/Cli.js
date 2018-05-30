const async = require('async'),
  cli = require('commander'),
  Promises = require('bluebird'),
  {prompt} = require('inquirer'),
  config = require('../config'),
  Github = require('./ConsumerGithub'),
  Twitter = require('./ConsumerTwitter');

const github = new Github(config.github),
  twitter = new Twitter(config.twitter);

/**
 * Handle interactive terminal.
 *
 * @class Cli
 * @author daithi coombes <webeire@gmail.com>
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
   * @param  {String} keyword Keyword to search.
   * @return {Promise} Resolves to {ObjectArray}
   */
  static promptGithub(keyword){
    console.info('prompting github...');

    return github.searchRepos(keyword);
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
    return new Promises.Promise(function(resolve, reject){

      const tweets = [];

      async.eachSeries(repos, function(repo, cb){

        twitter.searchTweets(repo)
          .then(_tweets => {
            tweets.push(_tweets);
            cb();
          })
          .catch(cb);
      }, function(err){
        if(err) return reject(err);
        return resolve({repos, tweets});
      });

    });
  }

}
