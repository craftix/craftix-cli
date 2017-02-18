#!/usr/bin/env node

'use strict';

var args = process.argv.slice(2);

if (args.length == 0)
{
    help();
    process.exit();
}

var command = args[0];
args = args.slice(1);

if (command == 'help')
{
    help();
    process.exit();
}

require('./craftix').start(command, require('path').dirname(require.main.filename), args);

function help()
{
    console.log("\n" +
        "Usage: craftix <command>\n\n" +
        "" +
        "where <command> is one of :\n" +
        "    init\n" +
        "        Creates an empty Craftix project\n" +
        "    build <target>\n" +
        "        Build the launcher (where target is exe, app, or jar)\n" +
        "    help\n" +
        "        Prints this message and exit\n" +
        "    run\n" +
        "        Run the launcher\n" +
        "    version\n" +
        "        Prints the craftix-cli version and exit");
}

