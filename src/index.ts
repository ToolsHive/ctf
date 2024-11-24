#!/usr/bin/env node

import { Command } from 'commander';

import initCommand from './commands/init';

const program = new Command();

program
  .version('1.0.0', '-v, --version')
  .description(
    'A command-line shell utility for setting up and managing Capture The Flag (CTF)'
  )
  .helpOption('-h, --help', 'Display help for command');

// Alternative: Custom error handling for older commander versions
program.configureOutput({
  outputError: (str, write) => {
    write(`\nError: ${str}`);
    write('\nUse -h or --help to see usage information.\n');
  },
});

program
  .command('init')
  .description('Initializes the CTF Directory')
  .action(initCommand);

program.parse(process.argv);
