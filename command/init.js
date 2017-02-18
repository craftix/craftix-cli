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
 * You should have received a copy of the GNU Lesser General Public License
 * along with Craftix CLI.  If not, see <http://www.gnu.org/licenses/>.
 */

var fs = require('fs');
var exec = require('child_process').exec;
var ncp = require('ncp').ncp;

function install(callback)
{
    console.log('> Getting dependencies');

    exec('npm install', function (error, stdout, stderr)
    {
        if (stdout != '')
        {
            console.log('npm: ' + stdout);
        }

        if (stderr != '')
        {
            console.log('npm: err: ' + stderr);
        }

        if (error !== null)
        {
            console.log('exec error: ' + error);
        }
        else
        {
            callback();
        }
    });
}

module.exports = function(craftix)
{
    console.log('=> Creating empty Craftix project using default template\n');
    console.log('> Copying template');

    var folder = craftix.folder + '/base';
    ncp(folder, './', function (err)
    {
        if (err)
        {
            return console.error(err);
        }

        install(function()
        {
            console.log('\n=> Project created');
        });
    });
};
