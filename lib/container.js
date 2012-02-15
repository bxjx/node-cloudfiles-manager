var container = module.exports;

container.usage = [
  'Help for container',
  '',
  'Actions:',
  '  mk <name>',
  '  rm <name>'
];

container.mk = function() {
  app.log.debug(arguments);
};
container.mk.usage = [
  'mk <name>',
  '',
  'Adds a new container.'
];

conatiner.rm = function() {
  app.log.debug(arguments);
};
container.rm.usage = [
  'rm <name>',
  '',
  'Removes a container.'
];