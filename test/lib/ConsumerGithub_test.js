const assert = require('assert'),
  nock = require('nock'),
  ConsumerGithub = require('../../lib/ConsumerGithub');

describe('Github Consumer', function(){

  let underTest,
    config = {
      // endpoint: 'https://api.github.com',
      endpoint: 'http://example.com',
    };

  beforeEach(function(){
    underTest = new ConsumerGithub(config);
  });

  it('will load github config', function(){
    assert.equal(underTest.endpoint, config.endpoint);
  });

  it('will search repositories', function(done){

    const expected = require('./fixtures/ConsumerGithub_return.json');

    nock(config.endpoint)
      .get('/search/repositories')
      .query({
        q: 'foobar',
      })
      .reply('200', require('./fixtures/GithubSearch.json'));

    underTest.searchRepos('foobar')
      .then(actual => {
        assert.deepEqual(actual, expected);
        done();
      });
  });

});
