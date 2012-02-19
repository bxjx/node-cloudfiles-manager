var flatiron = require('flatiron');
var app = flatiron.app;

//get the version from the package.json
require('pkginfo')(module, 'version');
app.version = module.exports.version;

app.use(flatiron.plugins.cli, {
  dir: __dirname,
  usage: [
    'cloudfiles-manager (cfmgr) version '+app.version,
    '',
    'Usage: cfmgr <resource> <action> [options]',
    'For more help: cfmgr help <resource> [action]',
    '',
    'Options:',
    '  --help    | -h : prints this help message',
    '  --version | -v : print the version and exit',
    '  -c <num> : sets the number of concurrent requests (defaults to 10)',
    '',
    'Resources:',
    '  containers - create and delete containers',
    '  files      - add, remove or view files in a container',
    '  project    - saves configurations for uploading files to containers',
    '',
    'Aliases:',
    '  upload - `project upload`',
    '  status - `project status`'
  ],
  version: true
});

app.use(require('./projectparser'));
app.use(require('./config'));

app.alias('upload', { resource: 'project', command: 'upload' });
app.alias('status', { resource: 'project', command: 'status' });

app.start();