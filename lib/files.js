var files = module.exports;

files.usage = [
  'Help for files',
  '',
  'Actions:',
  '  add <container> <files>',
  '  dir <container> <dir>',
  '  rm <container> <files>',
  '  rmdir <container> <dir>',
  '  view <container>'
];

files.add = function() {
  app.log.debug(arguments);
};
files.add.usage = [
  'add <container> <files>',
  '',
  'Adds one or more files to the container.'
];

files.dir = function() {
  app.log.debug(arguments);
};
files.dir.usage = [
  'dir <container> <dir>',
  '',
  'Adds all files from a directory to the container.'
];

files.rm = function() {
  app.log.debug(arguments);
};
files.rm.usage = [
  'rm <container> <files>',
  '',
  'Removes one or more files from the container.'
];

files.rmdir = function() {
  app.log.debug(arguments);
};
files.rmdir.usage = [
  'rmdir <container> <dir>',
  '',
  'Removes a directory (recursively) from the container.'
];

files.view = function() {
  app.log.debug(arguments);
};
files.view.usage = [
  'view <container>',
  '',
  'Views files from the container.'
];
