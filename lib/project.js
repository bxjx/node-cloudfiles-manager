var project = module.exports;

project.usage = [
  'Help for project',
  'requires a project file',
  '',
  'Projects are JSON files named `.cfmproj` and searched for recursively upwards through the file system.',
  'Options in project files encountered earlier override those from project files encountered later.',
  '~/.cfmproj is always considered the last project file encountered, even if it is never encountered.',
  '',
  'The following options are available.',
  '',
  'These can be anywhere in the project chain:',
  '  "apikey": "<key>"',
  '    -Specifies API key to use. *REQUIRED*',
  '',
  '  "username": "<name>"',
  '    -Specifies the username to use. This is sensitive: be cautious. ',
  '     *REQUIRED*',
  '',
  '  "host": "<url>"',
  '    -The URL of the authentication host.',
  '',
  '  "useservicenet": true',
  '    -Whether ServiceNet will be used. The default is false.',
  '',
  '',
  'These must be ONLY in the first encountered project:',
  '  "container": "<container>"',
  '    -Specifies the container to use. *REQUIRED*',
  '',
  '  "exclude": ["<exclude1>", "<exclude2>"]',
  '    -Specifies an array of file globs to exclude.',
  '',
  '',
  'Actions:',
  '  view',
  '  upload',
  '  url'
];

project.view = function() {
  var app = this;
  app.log.debug(arguments);
};
project.view.usage = [
  'Prints out all files to be uploaded by the current project.',
  'Also shows what has already been uploaded or has changed.',
  'This is somewhat similar to `git status`.'
];

project.upload = function() {
  var app = this;
  app.log.debug(arguments);
};
project.upload.usage = [
  'Uploads the files that have been added to the project or',
  'have changed in the current project since the last upload.',
  'This includes all files in the directory or a child directory',
  'of the first encountered project file. Use the exclue option',
  'to prevent certain file globs from being uploaded.',
  '',
  'See `cfmgr project view` to preview what this command will do.'
];

project.url = function() {
  var app = this;
  app.log.debug(arguments);
};
project.url.usage = [
  "Prints the URL to access this project's container from the internet"
];
