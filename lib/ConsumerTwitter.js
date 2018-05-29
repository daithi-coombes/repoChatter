const axios = require('axios');

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
    this.bearer;
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
        data: {
          grant_type: 'client_credentials',
        },
      })
      .then(res => {
        return res.data.access_token;
      })
  }
}

module.exports = ConsumerTwitter;
