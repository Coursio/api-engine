'use strict';

const options = [
  ...require('../config'),

  ...require('./idl'),
  ...require('./env'),
  ...require('./events'),
  ...require('./server_name'),
  ...require('./pagination'),
  ...require('./http'),
];

const runOptions = {
  options,
  name: 'run',
  // This means this is the default command
  aliases: '*',
  description: 'Start the server',
  examples: [
    ['Start the server', '--http.port=5001'],
  ],
};

module.exports = {
  ...runOptions,
};