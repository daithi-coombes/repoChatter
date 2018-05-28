const assert = require('assert'),
  nock = require('nock'),
  ConsumerTwitter = require('../../lib/ConsumerTwitter');

describe('Twitter Consumer', function(){

  let underTest,
    config = {
      endpoint: 'http://example.com',
    };

  beforeEach(function(){
    underTest = new ConsumerTwitter(config);
  });

  it.only('will load twitter config', function(){
    assert.equal(underTest.endpoint, config.endpoint);
  });

});
