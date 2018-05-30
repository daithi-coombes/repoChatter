const assert = require('assert'),
  nock = require('nock'),
  ConsumerTwitter = require('../../lib/ConsumerTwitter');

describe('Twitter Consumer', function(){

  let underTest,
    config = {
      key: 1234,
      secret: 12345,
      endpoint: 'http://example.com',
    };
    /// config = new ConsumerTwitter(require('../../config').twitter);

  beforeEach(function(){
    underTest = new ConsumerTwitter(config);
  });

  it('will load twitter config', function(){
    assert.equal(underTest.endpoint, config.endpoint);
    assert.equal(underTest.key, config.key);
    assert.equal(underTest.secret, config.secret);
  });

  it('will get access token', function(done){

    const expected = require('./fixtures/TwitterToken.json').access_token,
      expectedHeader = 'Basic ' + new Buffer(`${config.key}:${config.secret}`).toString('base64');
    let headers;

    nock(config.endpoint)
      .post('/oauth2/token?grant_type=client_credentials')
      .reply(function(uri, reqbody){
        headers = this.req.headers;
        return require('./fixtures/TwitterToken.json');
      });

    underTest.authenticate()
      .then(actual => {
        assert.equal(headers.authorization, expectedHeader);
        assert.equal(actual, expected);
        done();
      })
      .catch(done);
  });

  it('will search for tweets', function(done){

    const expectedTwitter = require('./fixtures/TwitterSearch.json'),
      expectedHeader = 'Bearer ' + require('./fixtures/TwitterToken.json').access_token;
    let headers;

    nock(config.endpoint)
      .post('/oauth2/token?grant_type=client_credentials')
      .reply(function(uri, reqbody){
        return require('./fixtures/TwitterToken.json');
      });

    nock(config.endpoint)
      .get('/1.1/search/tweets.json?q=foobar')
      .reply(function(uri, reqbody){
        headers = this.req.headers;
        return require('./fixtures/TwitterSearch.json');
      });

    underTest.search('foobar')
      .then(actual => {
        assert.equal(headers.authorization, expectedHeader);
        assert.deepEqual(actual, require('./fixtures/ConsumerTwitter_return.json'));
        done();
      })
      .catch(done);
  });
});
