var cloudfiles = require('cloudfiles');

exports.attach = function(options) {
  var app = this;

  app.connect = function() {
    if (app.project.username === undefined || app.project.apikey === undefined) {
      app.log.error('username and apikey must be in project chain, see cfmgr help project');
      process.exit(1);
    }

    var config = {
      auth: {
        username: app.project.username,
        apiKey: app.project.apikey
      }
    }

    if (app.project.useservicenet) {
      config.servicenet = true;
    }

    if (app.project.host) {
      config.auth.host = app.project.host;
    }

    app.client = cloudfiles.createClient(config);
  };
}

exports.init = function(done) {
  return done();
}