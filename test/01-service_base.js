var request = require('supertest');
var server = require('../server.js');

describe('service: base', function() {

  // /
  describe('GET /', function() {
    it('should return 200 OK', function(done) {
      request(server)
        .get('/')
        .expect(200, done);
    });
  });
    // Add more tests as needed...
});
