const assert = require('assert'),
  Promises = require('bluebird'),
  rewire = require('rewire');

let underTest;

describe('CLI', function(){

  beforeEach(function(){
    underTest = rewire('../../lib/Cli');
  });

  it('will prompt github', function(){

    const expected = require('./fixtures/ConsumerGithub_return.json'),
      revert = underTest.__set__('github', {
        searchRepos: function(){
          return Promises.resolve(expected);
        }
      });

    return underTest.promptGithub('foobar')
      .then(actual => {
        assert.deepEqual(actual, expected);
        revert();
      });
  });

  it('will search tweets', function(){

    const expected = require('./fixtures/CliTweets_return.json'),
      repos = require('./fixtures/ConsumerGithub_return.json'),
      revert = underTest.__set__('twitter', {
        searchTweets: function(){
          return Promises.resolve(require('./fixtures/ConsumerTwitter_return.json'));
        }
      });

    return underTest.searchTweets(repos)
      .then(actual => {
        assert.deepEqual(actual, expected);
        revert();
      });
  });

  it('will displayResults', function(done){

  });
});
