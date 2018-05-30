const async = require('async'),
  cli = require('commander'),
  Promises = require('bluebird'),
  {prompt} = require('inquirer'),
  config = require('../config'),
  Github = require('./ConsumerGithub'),
  Twitter = require('./ConsumerTwitter');

const github = new Github(config.github),
  twitter = new Twitter(config.twitter),
  questions = [
    {
      type : 'input',
      name : 'githubKeyword',
      message : 'Enter keyword to search GitHub'
    },
  ],
  questionRepos = [
    {
      type: 'input',
      name: 'repos',
    }
  ];

/**
 * Handle interactive terminal.
 *
 * @class Cli
 * @author daithi coombes <webeire@gmail.com>
 */
module.exports = class Cli{

  static init(){
    cli.version('0.0.1')
      .description('Tech Test');
  }

  /**
   * Display results to user.
   * @todo loop back to ::promptGithub?
   * @param  {Object} results In format {repos, tweets}
   */
  static displayResults(results){

    for(const [i, repo] of results.repos.entries() ){
      const tweets = results.tweets[i];

      console.log('\n************************');
      console.info(`Repo: ${repo.name} (${repo.full_name})`);
      console.log('------------------------');
      console.log(`\t${repo.description}`);
      console.log('\n');

      console.log('\tTweets:');
      console.log('\t------------------------');
      for(const tweet of tweets){
        console.info(`\t${tweet.text}`);
      }

      console.log('\n');
    }
  }

  /**
   * Search github by keyword.
   * @param  {String} keyword Keyword to search.
   * @return {Promise} Resolves to {ObjectArray}
   */
  static promptGithub(){
    return new Promises.Promise(function(resolve, reject){

      console.log('starting cli');
      cli.command('search')
        .alias('s')
        .description('Enter repo to search')
        .action(()=>{
          console.info('prompting github...');

          prompt(questions)
            .then(arg => {
              github.searchRepos(arg.githubKeyword)
                .then(results => {

                  const strRepos = [];

                  for(const [index, value] of results.entries()){
                    strRepos.push(`[${index}] ${value.name}`);
                  }

                  questionRepos[0].message = 'Please enter numbers of selected repos seperated by comma\'s: (eg 3,5,7)\n' + strRepos.join('\n') + '\n';

                  prompt(questionRepos)
                    .then(selectedRepos => {

                      const indexes = selectedRepos.repos.split(','),
                        repos = [];
                      for(const i of indexes){
                        repos.push(results[i]);
                      }

                      resolve(repos);
                    })
                    .catch(reject);
                })
                .catch(reject);
            })
            .catch(reject);
        });
    })
  }

  /**
   * Run the cli. Binds to process.argv
   * @uses commaderjs
   */
  static bind(){
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

        twitter.search(repo.name)
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
