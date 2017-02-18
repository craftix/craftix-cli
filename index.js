#!/usr/bin/env node

/*
 * Copyright 2017 Adrien "Litarvan" Navratil
 *
 * This file is part of Craftix CLI.
 *
 * Craftix CLI is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Craftix CLI is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Craftix CLI.  If not, see <http://www.gnu.org/licenses/>.
 */

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

