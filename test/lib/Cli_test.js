const assert = require('assert'),
  Promises = require('bluebird'),
  rewire = require('rewire'),
  stdout = require('test-console').stdout;

let underTest;

describe('CLI', function(){

  beforeEach(function(){
    underTest = rewire('../../lib/Cli');
  });

  /**
   * @todo finish this test.
   */
  it.skip('will prompt github', function(done){
  });

  it('will search github', function(){

    const expected = require('./fixtures/ConsumerGithub_return.json'),
      revertGithub = underTest.__set__('github', {
        searchRepos: function(){
          return Promises.resolve(expected);
        }
      }),
      revertPrompt = underTest.__set__('prompt', function(ques){
        assert.equal(ques[0].message, 'Please enter numbers of selected repos seperated by comma\'s: (eg 3,5,7)\n[0] Tetris\n');
        return Promises.resolve({repos: '0'});
      })

    return underTest.searchGithub('foobar')
      .then(actual => {
        assert.deepEqual(actual, expected);
        revertGithub();
        revertPrompt();
      });
  });

  it('will search tweets', function(){

    const expected = require('./fixtures/CliTweets_return.json'),
      repos = require('./fixtures/ConsumerGithub_return.json'),
      revert = underTest.__set__('twitter', {
        search: function(){
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

    assert.equal(inspect.output[0], '\n************************\n');
    assert.equal(inspect.output[1], 'Repo: Tetris (dtrupenn/Tetris)\n');
    assert.equal(inspect.output[2], '------------------------\n');
    assert.equal(inspect.output[3], '\tA C implementation of Tetris using Pennsim through LC4\n');
    assert.equal(inspect.output[4], '\n\n');
    assert.equal(inspect.output[5], '\tTweets:\n');
    assert.equal(inspect.output[6], '\t------------------------\n');
    assert.equal(inspect.output[7], '\tFrom pilot to astronaut, Robert H. Lawrence was the first African-American to be selected as an astronaut by any na… https://t.co/FjPEWnh804\n');
    assert.equal(inspect.output[8], '\tA magnetic power struggle of galactic proportions - new research highlights the role of the Sun\'s magnetic landscap… https://t.co/29dZgga54m\n');
    assert.equal(inspect.output[9], '\tSomeone\'s got to be first. In space, the first explorers beyond Mars were Pioneers 10 and 11, twin robots who chart… https://t.co/SUX30Y45mr\n');
    // assert.equal(inspect.output[11], '\t宇宙ステーションでも、日本と9時間の時差で月曜日が始まりました。n今週は6人から3人にクルーのサイズダウンがありますが、しっかりと任されているタスク をこなしたいと思います。nn写真は、NASAの実験施設「ディスティニー」のグローブ… https://t.co/2CYoPV6Aqx\n');
    assert.equal(inspect.output[11], '\tCongratulations to #Olympics athletes who won gold! Neutron stars like the one at the heart of the Crab Nebula may… https://t.co/vz4SnPupe2\n');
    assert.equal(inspect.output[12], '\n\n');
  });
});
