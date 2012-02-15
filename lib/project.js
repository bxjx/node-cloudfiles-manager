var project = module.exports;

project.usage = [
  'Help for project',
  'requires a project file',
  '',
  'Project files are named `.cfmproj` and are searched for recursively upwards through the file system.',
  'Options in project files encountered earlier override those from later project files.',
  '~/.cfmproj is always considered the last project file encountered, even if it is never encountered.',
  '',
  'Each line can contain one of the following options.',
  '',
  'These are required to be somewhere in the project chain:',
  '  apikey <key>          - Specifies API key to use.',
  '  username <name>       - Specifies the username to use.',
  '',
  'These must only be in the first encountered project',
  '  container <container> - Specifies the container to use.',
  '  include <include>     - Specifies a file glob to include.',
  '',
  'These are optional:',
  '  host <url>    - The URL of the authentication host.',
  '  useservicenet - If specified, ServiceNet will be used.',
  '  cache <dir>   - Sets the directory to cache files in. This is `./cfcache/` by default.',
  '',
  'Actions:',
  '  view',
  '  upload',
  '  url',
];

project.view = function() {
  app.log.debug(arguments);
};
project.view.usage = [
  'Prints out all files to be uploaded by the current project.',
  'Also shows what has already been uploaded or has changed.',
  'This is somewhat similar to `git status`.'
];

project.upload = function() {
  app.log.debug(arguments);
};
project.upload.usage = [
  'Uploads the files that have been added to the project or',
  'have changed in the current project since the last upload.',
  'See `cfmgr project view` to preview what this command will do.'
];

project.url = function() {
  app.log.debug(arguments);
};
project.url.usage = [
  "Prints the URL to access this project's container from the internet"
];
