const assert = require('assert'),
  ConsumerGithub = require('../../lib/ConsumerGithub');

describe('Github Consumer', function(){

  let underTest,
    config = {
      url: 'http://example.com',
    };

  beforeEach(function(){
    underTest = new ConsumerGithub(config);
  });

  it('will load github config', function(){
    assert.equal(underTest.endpoint, config.url);
  });

  it('will search repositories', function(done){

    const expected = require('./fixtures/ConsumerGithub_return.json');

    underTest.searchRepos()
      .then(repos => {
        assert.deepEqual(actual, expected);
        done();
      });
  });

});
