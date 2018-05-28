const axios = require('axios');

/**
 * Github API Consumer.
 * @author daithi coombes <webeire@gmail.com>
 */
class ConsumerGithub{

  /**
   * Constructor.
   * @param {Object} config {endpoint}
   */
  constructor(config){
    this.endpoint = config.endpoint;
    this.http = axios.create({
      baseURL: this.endpoint,
    });
  }

  /**
   * Search github for repos by keyword.
   * @param  {String} keyword The keyword to search.
   * @return {Object}         Returns a parsed version of github results.
   */
  searchRepos(keyword){

    const self = this;

    return this.http.get('/search/repositories', {
        params: {
          q: keyword,
        },
      })
      .then(res => {
        return self.parseResults(res.data);
      });
  }

  /**
   * Parse results from github.
   * @param  {Object} data Search results from github.
   * @return {Object}      Parsed results.
   */
  parseResults(data){
    console.log(data);
  }
}

module.exports = ConsumerGithub;
