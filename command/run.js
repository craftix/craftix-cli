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

var exec = require('child_process').exec;

module.exports = function(craftix)
{
    console.log('=> Launching Craftix project');
    var config = craftix.build();

    console.log('=> Launching electron\n');

    exec(process.cwd() + '/node_modules/.bin/electron ' + config.buildFolder, function (err, stdout, stderr) {
        if (err) {
            console.error('Unable to launch !  ' + err);
        }

        if (stdout && stdout != '')
        {
            console.log('STDOUT: ' + stdout);
        }

        if (stderr && stderr != '')
        {
            console.error('STDERR: ' + stderr);
        }

        console.log('\n=> Launcher exited\n');
    });
};