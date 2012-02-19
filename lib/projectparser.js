var fs = require('fs');
var path = require('path');

exports.attach = function(options) {
  var app = this;

  app.project = {};
  app.project.dir = "";

  var defaults = {
    useservicenet: false,
    cache: './cfcache/'
  };

  var projectData = [];
  var getProjectFiles = function (dir, callback) {
    //set up next directory and the file for which to check
    var next = path.join(dir, '../');
    var file = path.join(dir, '.cfmproj');

    fs.readFile(file, function(err, data) {
      //if there's no error, then we can use the project data
      if (!err) {
        projectData.push(JSON.parse(data));

        //save the first project encountered's directory
        if (app.project.dir === "") {
          app.project.dir = dir;
          var l = app.project.dir.length;
          if (app.project.dir[l-1] === '/' || app.project.dir[l-1] === '\\') {
            app.project.dir = app.project.dir.substr(0, l-1);
          }
        }
      }

      //remember to go do ~ as well if it reaches / before ~
      if (dir === '/')
        next = process.env['HOME'];

      //we just did ~, so we're done!
      if (dir === process.env['HOME']) {
        callback();

        //reset project files and data for next search
        projectFiles = [];
        projectData = [];

        return; //don't recurse, we're done
      }

      //recurse if there's still directories above us
      getProjectFiles(next, callback);
    });
  };

  var isKeyValid = function (key) {
    if (key === "apikey" || key === "username" || key === "host"
        || key === "useservicenet" || key === "cache") {
      return true;
    }
    else {
      return false;
    }
  };

  //load project with all of it's recursiveness, ignoring other data
  app.loadProject = function (finish) {
    //reset the project data
    app.project = {};
    app.project.dir = "";

    getProjectFiles(process.cwd(), function() {
      //add the defaults with the least precedence
      projectData.push(defaults);

      //reverse iteration (excluding first project encountered)
      for (var i = projectData.length-1; i > 0; i--) {
        for (var key in projectData[i]) {
          //for projects before first encountered, only copy specified data
          if (isKeyValid(key)) {
            app.project[key] = projectData[i][key];
          }
        }
      }

      //for first project encountered, copy all of the above and a few more
      for (var key in projectData[i]) {
        if (isKeyValid(key) || key === "container" || key ==="include") {
          app.project[key] = projectData[i][key];
        }
      }

      finish();
    });
  };
};

exports.init = function(done) {
  var app = this;
  app.loadProject(done);
};