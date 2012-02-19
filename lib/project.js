var project = module.exports;
var glob = require('glob');
var path = require('path');
var fs = require('fs');

project.usage = [
  'Help for project',
  '-requires a project file',
  '',
  'Projects are JSON files named `.cfmproj`, and searched for recursively',
  'upward from the current directory to the top of the file system or $HOME,',
  'whichever is encountered first. Options in project files encountered',
  'earlier override those from project files encountered later.',
  '',
  '$HOME/.cfmproj is always the last project in the chain. This makes it',
  'like a global project, useful for putting your username and apikey in.',
  '',
  '',
  'The following options can be anywhere in the project chain:',
  '  "apikey": "<key>"',
  '    -Specifies API key to use. This is sensitive! *REQUIRED*',
  '',
  '  "username": "<name>"',
  '    -Specifies the username to use. *REQUIRED*',
  '',
  '  "host": "<url>"',
  '    -The URL of the authentication host.',
  '',
  '  "useservicenet": true',
  '    -Whether ServiceNet will be used. The default is false.',
  '',
  '',
  'The following options must ONLY be in the first encountered project:',
  '  "container": "<container>"',
  '    -Specifies the container to use. *REQUIRED*',
  '',
  '  "include": ["<exclude1>", "<exclude2>"]',
  '    -Specifies an array of file globs to include.',
  '     See github.com/isaacs/node-glob for the glob implementation.',
  '',
  '',
  'Actions:',
  '  status',
  '  upload'
];

function uploadFile(name, app, callback) {
  var localPath = path.join(app.project.dir, name);
  app.client.addFile(app.project.container, {
        local: localPath,
        remote: name
      }, function(err, up) {
    if (err) {
      app.log.error('uploadFile '+err);
      process.exit(1);
    }
    else if (up) {
      app.log.info('Uploaded '+name);
      callback();
    }
    else {
      app.log.error('Could not upload '+name);
      process.exit(1);
    }
  });
}

function updateFile(file, app, upload, callback) {
  var localPath = path.join(app.project.dir, file);
  fs.stat(localPath, function(err, stat) {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }

    if (stat.isFile()) {
      app.client.getFile(app.project.container, file, function(err, c) {
        if (err) {
          if (upload) {
            uploadFile(file, app, callback);
          }
          else {
            app.log.info ('Created '+file);
            callback();
          }
        }
        else {
          if (stat.mtime > Date.parse(c.lastModified)) {
            if (upload) {
              uploadFile(file, app, callback);
            }
            else {
              app.log.info('Modified '+file);
              callback();
            }
          }
        }
      });
    }
    else {
      callback();
    }
  });
}

function createFolders(folder, app, callback) {
  var t = path.join(app.client.config.cache.path, app.project.container);
  var q = path.join(t, folder);
  path.exists(q, function(exists) {
    if (exists) {
      callback();
    }
    else {
      fs.mkdir(q, function(err) {
        if (err) {
          app.log.error(err);
          process.exit(1);
        }
        else {
          callback();
        }
      });
    }
  });
}

function prepareInclude(gl, app, callback) {
  glob(gl, function(err, fileNames) {
    var i = 0;
    function next() {
      i++;
      if (i < fileNames.length) {
        createFolders(path.dirname(fileNames[i]), app, next);
      }
      else {
        callback();
      }
    }
    createFolders(path.dirname(fileNames[i]), app, next);
  });
}

function handleInclude(gl, app, upload, callback) {
  glob(gl, function(err, fileNames) {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }

    var a = app.argv.c || 10;

    var j = 0;
    function n() {
      j++;
      if (j < fileNames.length) {
        updateFile(fileNames[j], app, upload, n);
      }
      else {
        callback();
      }
    }

    //start the number of concurrent requests going
    for (var i = 0; i < a; i++) {
      updateFile(fileNames[j], app, upload, n);
    }
  });
}

function prepare(app, callback) {
  var j = 0;
  function next() {
    j++;
    if (j < app.project.include.length) {
      prepareInclude(app.project.include[j], app, next);
    }
    else {
      callback();
    }
  }
  prepareInclude(app.project.include[j], app, next);
}

project.status = function() {
  var app = this;
  app.connect();

  var container = app.project.container;

  if (container === undefined || container === null
    || typeof container !== 'string') {
    app.log.error('Invalid container name. See `cfmgr help containers add`');
    process.exit(1);
  }

  app.client.setAuth(function() {
    app.client.createContainer(container, function(err, c) {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }

      if (app.project.include === undefined || app.project.include === null ||
          app.project.include.length === 0) {
        //nothing to do anyways =S
        app.log.warn('No files were included. See `cfmgr help project`.')
        process.exit(0);
      }

      prepare(app, function() {
        var i = 0;
        function next() {
          i++;
          if (i < app.project.include.length) {
            handleInclude(app.project.include[i], app, false, next);
          }
        }
        handleInclude(app.project.include[i], app, false, next);
      });
    });
  });
};
project.status.usage = [
  'Prints out all of the files to be uploaded in the next call to',
  '`cfmgr project upload`.'
];

project.upload = function() {
  var app = this;
  app.connect();

  var container = app.project.container;

  if (container === undefined || container === null
    || typeof container !== 'string') {
    app.log.error('Invalid container name. See `cfmgr help containers add`');
    process.exit(1);
  }

  app.client.setAuth(function() {
    app.client.createContainer(container, function(err, c) {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }

      if (app.project.include === undefined || app.project.include === null ||
          app.project.include.length === 0) {
        //nothing to do anyways =S
        app.log.warn('No files were included. See `cfmgr help project`.')
        process.exit(0);
      }

      prepare(app, function() {
        var i = 0;
        function next() {
          i++;
          if (i < app.project.include.length) {
            handleInclude(app.project.include[i], app, true, next);
          }
        }
        handleInclude(app.project.include[i], app, true, next);
      });
    });
  });
};
project.upload.usage = [
  'Uploads the files that have been added to the project or',
  'have been modified in the project since the last upload.',
  'See the `include` project file option for including files.',
  '',
  'See `cfmgr project view` to preview this command\'s effects.'
];