const axios = require('axios'),
  fs = require('fs'),
  Promises = require('bluebird');

/**
 * Twitter consumer.
 * @author daithi coombes <webeire@gmail.com>
 */
class ConsumerTwitter{

  /**
   * Constructor.
   * @param {Object} config {endpoint}
   */
  constructor(config){
    this.token;
    this.endpoint = config.endpoint;
    this.key = config.key;
    this.secret = config.secret;
    this.http = axios.create({
      baseURL: this.endpoint,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    });
  }

  /**
   * Authenticate, get access_token
   * @return {Promise} Resolves to access_token
   */
  authenticate(){
    let bearer = new Buffer(`${this.key}:${this.secret}`).toString('base64');

    return this.http({
        url: '/oauth2/token',
        method: 'POST',
        headers: {'Authorization': `Basic ${bearer}`},
        params: {
          grant_type: 'client_credentials',
        },
      })
      .then(res => {
        return res.data.access_token;
      });
  }

  /**
   * Search for tweets.
   * @param  {String}  keyword Keyword(s) to search.
   * @return {Promise}         Resolves to parsed results.
   */
  async search(keyword){

    const self = this;
    let res;

    // check authentication
    if(!this.token) try{
      this.token = await this.authenticate();
    }catch(e){
      return Promises.reject(e);
    }

    // search twitter
    try{
      res = await this.http({
          url: '/1.1/search/tweets.json',
          headers: {
            'authorization': `Bearer ${this.token}`
          },
          params: {
            q: keyword,
          }
        });
    }catch(e){
      return Promises.reject(e);
    }

    // return parsed results
    return Promises.resolve(self.parseResults(res.data));
  }

  /**
   * Parse twitter search results.
   * @param  {Array} data Object array of twitter results.
   * @return {Array}      Array of parsed objects.
   */
  parseResults(data){

    const res = [];

    data.statuses.forEach(item => {
      res.push( (({ id, text }) => ({ id, text }))(item) );
    });

    return res;
  }
}

module.exports = ConsumerTwitter;
