var project = module.exports;

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
  '  "exclude": ["<exclude1>", "<exclude2>"]',
  '    -Specifies an array of file globs to exclude.',
  '',
  '',
  'Actions:',
  '  view',
  '  upload'
];

project.view = function() {
  var app = this;
  app.log.debug(arguments);
};
project.view.usage = [
  'Prints out the status of all files in the project.',
  'Files can either be added or modified.',
  'This is somewhat similar to `git status`.'
];

project.upload = function() {
  var app = this;
  app.log.debug(arguments);
};
project.upload.usage = [
  'Uploads the files that have been added to the project or',
  'have been modified in the project since the last upload.',
  'This includes all files in the same directory or in a child directory',
  'of the first encountered project file. Use the `exclude` option',
  'to prevent certain file globs from being uploaded.',
  '',
  'See `cfmgr project view` to preview what this command will do.'
];