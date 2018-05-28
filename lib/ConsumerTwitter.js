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
    this.endpoint = config.endpoint;
    this.http = axios.create({
      baseUrl: this.endpoint,
    });
  }

}

module.exports = ConsumerTwitter;
