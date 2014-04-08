// init the test client
var client = restify.createJsonClient({
  version: '*',
  url: 'http://127.0.0.1:3000'
});

describe('service: base', function() {

    // Test #1
  describe('200 response check', function() {
    it('should get a 200 response', function(done) {
      client.get('/', function(err, req, res, data) {
        if (err) {
          throw new Error(err);
        }
        else {
          if (res.statusCode != 200) {
            throw new Error('invalid response from /');
          }
          done();
        }
      });
    });
  });
    // Add more tests as needed...
});
