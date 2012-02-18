var containers = module.exports;

containers.usage = [
  'Help for containers',
  '',
  'Actions:',
  '  add <name>',
  '  rm <name>',
  '  url <name>',
  '  list'
];

containers.add = function(name) {
  var app = this;
  app.connect();

  if (name === undefined || name === null || typeof name !== 'string') {
    app.log.error('Invalid name. See `cfmgr help containers mk`');
    process.exit(1);
  }

  app.client.setAuth(function() {
    app.client.createContainer(name, function(err, container) {
      if (err) {
        app.log.error(err);
      }
      else {
        app.log.info('Success!');
      }
    });
  });
};
containers.add.usage = [
  'add <name>',
  '',
  'Adds a new container.'
];

containers.rm = function(name) {
  var app = this;
  app.connect();

  if (name === undefined || name === null || typeof name !== 'string') {
    app.log.error('Invalid name. See `cfmgr help containers rm`');
    process.exit(1);
  }

  app.log.info('Are you sure? This cannot be undone. (no)');
  app.prompt.get('answer', function(err, response) {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }

    if (response.answer.toLowerCase() !== 'yes') {
      process.exit(1);
    }

    app.client.setAuth(function() {
      app.client.destroyContainer(name, function(err, container) {
        if (err) {
          app.log.error(err);
        }
        else {
          app.log.info('Success!');
        }
      });
    });
  });
};
containers.rm.usage = [
  'rm <name>',
  '',
  'Removes a container.'
];

containers.url = function(name) {
  var app = this;
  app.connect();

  if (name === undefined || name === null || typeof name !== 'string') {
    app.log.error('Invalid name. See `cfmgr help containers mk`');
    process.exit(1);
  }

  app.client.setAuth(function() {
    app.client.getContainer(name, true, function(err, container) {
      if (err) {
        app.log.error(err);
      }
      else {
        if (app.argv.ssl) {
          app.log.info(container.cdnSslUri);
        }
        else {
          app.log.info(container.cdnUri);
        }
      }
    });
  });
};
containers.url.usage = [
  'url <name>',
  '',
  'Retrieves the public URL for a container.',
  '',
  'Options:',
  '   --ssl - Retrieves the secure SSL URL.'
];

containers.list = function() {
  var app = this;
  app.connect();

  var util = require('util');

  app.client.setAuth(function() {
    app.client.getContainers(function(err, containers) {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }

      for (var i = 0; i < containers.length; i++) {
        app.log.info(containers[i].name);
      }
    });
  });
};
containers.list.usage = [
  'Lists all containers.'
];