var files = module.exports;
var fs = require('fs');
var path = require('path');

files.usage = [
  'Help for files',
  '',
  'Actions:',
  '  add <container> <files>',
  '  rm <container> <files>',
  '  list <container>'
];

files.add = function(container) {
  var app = this;
  app.connect();

  if (container === undefined || container === null
    || typeof container !== 'string') {
    app.log.error('Invalid container name. See `cfmgr help container mk`');
    process.exit(1);
  }

  var filePairs = [];
  for (var i = 1; i < arguments.length-1; i++) {
    filePairs.push(arguments[i]);
  }

  if (filePairs.length === 0) {
    app.log.error('No files specified.');
    process.exit(1);
  }

  var fileMap = {};
  for (var i = 0; i < filePairs.length; i++) {
    var string = filePairs[i];
    if (string.indexOf(':') === -1) {
      var file = string;
      var remote = path.basename(string);
    }
    else {
      var file = string.substring(0, string.indexOf(':'));
      var remote = string.substring(string.indexOf(':')+1);
    }
    fileMap[file] = remote;
  }

  app.client.setAuth(function() {
    for (var l in fileMap) {
      app.client.addFile(container, { remote: fileMap[l], local: l },
        function (t, err, up) {
          if (err) {
            app.log.error(err);
            process.exit(1);
          }
          else if (up) {
            app.log.info('Uploaded '+t+' to '+fileMap[t]+'!');
          }
          else {
            app.log.error('Failed to upload '+t+'.');
            process.exit(1);
          }
        }.bind(null, l));
    }
  });
};
files.add.usage = [
  'add <container> <files>',
  '',
  'Adds one or more files to the container.',
  '',
  '`files` is a space-delimited list of files to upload.',
  'They can take two forms: `file:remote` or just `file`,',
  'where file is the path to the local file to upload, and',
  'remote is the path to upload it to on the cloud. If you',
  'omit `remote`, as in the second form, the file will be',
  'uploaded with just the basename (root level on the cloud).'
];

files.rm = function(container) {
  var app = this;
  app.connect();

  if (container === undefined || container === null || typeof container !== 'string') {
    app.log.error('Invalid container name. See `cfmgr help container mk`');
    process.exit(1);
  }

  var fileNames = [];
  for (var i = 1; i < arguments.length-1; i++) {
    fileNames.push(arguments[i]);
  }

  if (fileNames.length === 0) {
    app.log.error('No files specified.');
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
      for (var l in fileNames) {
        app.client.destroyFile(container, fileNames[l],
          function (t, err, del) {
            if (err) {
              app.log.error(err);
              process.exit(1);
            }
            else if (del) {
              app.log.info('Deleted '+t+'!');
            }
            else {
              app.log.info('Could not delete '+t+'.');
              process.exit(1);
            }
          }.bind(null, fileNames[l]));
      }
    });
  });
};
files.rm.usage = [
  'rm <container> <files>',
  '',
  'Removes one or more files from the container.'
];

files.list = function(container) {
  var app = this;
  app.connect();

  if (container === undefined || container === null
      || typeof container !== 'string') {
    app.log.error('Invalid container name. See `cfmgr help container mk`');
    process.exit(1);
  }

  app.client.setAuth(function() {
    app.client.getFiles(container, function(err, fileList) {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
      else {
        for (var i in fileList) {
          var f = fileList[i];
          app.log.info(f.name);
        }
      }
    });
  });
};
files.list.usage = [
  'list <container>',
  '',
  'Lists files from the container.'
];
