const assert = require('assert'),
  Promises = require('bluebird'),
  rewire = require('rewire'),
  stdout = require('test-console').stdout;

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

  it('will displayResults', function(){

    const inspect = stdout.inspect();

    underTest.displayResults(require('./fixtures/CliTweets_return.json'));
    inspect.restore();

    assert.equal(inspect.output[0], 'results...\n');
    assert.equal(inspect.output[1], '\n************************\n');
    assert.equal(inspect.output[2], 'Repo: Tetris (dtrupenn/Tetris)\n');
    assert.equal(inspect.output[3], '------------------------\n');
    assert.equal(inspect.output[4], '\tA C implementation of Tetris using Pennsim through LC4\n');
    assert.equal(inspect.output[5], '\n\n');
    assert.equal(inspect.output[6], '\tTweets:\n');
    assert.equal(inspect.output[7], '\t------------------------\n');
    assert.equal(inspect.output[8], '\tFrom pilot to astronaut, Robert H. Lawrence was the first African-American to be selected as an astronaut by any na… https://t.co/FjPEWnh804\n');
    assert.equal(inspect.output[9], '\tA magnetic power struggle of galactic proportions - new research highlights the role of the Sun\'s magnetic landscap… https://t.co/29dZgga54m\n');
    assert.equal(inspect.output[10], '\tSomeone\'s got to be first. In space, the first explorers beyond Mars were Pioneers 10 and 11, twin robots who chart… https://t.co/SUX30Y45mr\n');
    // assert.equal(inspect.output[11], '\t宇宙ステーションでも、日本と9時間の時差で月曜日が始まりました。n今週は6人から3人にクルーのサイズダウンがありますが、しっかりと任されているタスク をこなしたいと思います。nn写真は、NASAの実験施設「ディスティニー」のグローブ… https://t.co/2CYoPV6Aqx\n');
    assert.equal(inspect.output[12], '\tCongratulations to #Olympics athletes who won gold! Neutron stars like the one at the heart of the Crab Nebula may… https://t.co/vz4SnPupe2\n');
    assert.equal(inspect.output[13], '\n\n');
  });
});
