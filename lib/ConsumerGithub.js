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
   * @return {Promise}        Resolves to object [{name, score, desc, full_name}]
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
    const res = [];

    data.items.forEach(item => {
      res.push( (({ name, score, description, full_name }) => ({ name, score, description, full_name }))(item) );
    });

    return res;
  }
}

module.exports = ConsumerGithub;
