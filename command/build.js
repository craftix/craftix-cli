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

var http = require('http');
var fs = require('fs');
var AdmZip = require('adm-zip');
var archiver = require('archiver');
var rimraf = require('rimraf');

var output = 'output/';
var shared = process.env.APPDATA + '/craftix' || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support/craftix' : process.env.HOME + '/.local/share/craftix/');

module.exports = function(craftix)
{
    if (craftix.args.length == 0)
    {
        return console.error('Usage: craftix build <target>\n\n' +
            '' +
            'Args :\n' +
            '    target\n' +
            '        The target platform. Can be one of "win", "mac", or "jar".\n')
    }

    console.log('=> Building and exporting project\n');
    console.log('> Cleaning output directory\n');

    rimraf(output, function(err) {
        if (err)
        {
            return console.err('Error while cleaning output directory : ' + err);
        }

        var target = craftix.args[0];

        if (target == 'win')
        {
            buildWindows(craftix);
        }
        else if (target == 'mac')
        {
            buildMac(craftix);
        }
        else if (target == 'jar')
        {
            buildBase(craftix);
        }
        else
        {
            return console.error('Unknown target "' + target + '"');
        }
    });
};

function buildWindows(craftix)
{
    buildBase(craftix, function(jar)
    {
        console.log('=> Building .exe\n');
        console.log('> Searching for Launch4j');

        var launch4j = shared + '/launch4j';
        var launch4jex = launch4j + '/launch4j/launch4j' + (process.platform == 'win32' ? 'c.exe' : '');
        var url = "http://netix.dl.sourceforge.net/project/launch4j/launch4j-3/3.9/launch4j-3.9-win32.zip";

        if (fs.existsSync(launch4jex))
        {
            wrapExe(craftix, config, launch4jex, jar);
        }
        else
        {
            if (!fs.existsSync(launch4j))
            {
                fs.mkdirSync(launch4j);
            }

            var zip = launch4j + '/launch4j-3.9.zip';

            console.log('> Downloading Launch4J');
            download(url, zip, function()
            {
                console.log('> Unzipping it');
                unzip(zip, launch4j);

                wrapExe(craftix, config, launch4jex, jar);
            });
        }
    });
}

function wrapExe(craftix, launch4j, jar)
{
    console.log('> Wrapping jar');
}

function buildMac(craftix, config)
{
    buildBase(craftix, config, function(jar)
    {
        console.log('\n=> Building .app\n')
    });
}

function buildBase(craftix, callback)
{
    var buildConfig = craftix.build();
    var config = buildConfig.wrapper;

    delete buildConfig.wrapper;

    console.log('=> Building JAR using Craftix Wrapper ' + craftix.wrapper + '\n');

    var wrapper = output + 'wrapper/';
    var extract = wrapper + 'content/';

    console.log('> Downloading wrapper');
    var jar = 'craftix-wrapper-' + craftix.wrapper + '.jar';
    //download('http://github.com/craftix/craftix-wrapper/releases/download/' + craftix.version + '/' + jar, jar = wrapper + jar);

    console.log('> Unzipping it');
    unzip(jar, extract);

    console.log('> Setting up wrapper');
    config.launcher = buildConfig;
    config = JSON.stringify(config, null, 4);

    fs.writeFileSync(extract + 'craftix-wrapper.json', config);

    console.log('> Rebuilding it');
    var file = output + buildConfig.name + '.jar';

    var out = fs.createWriteStream(file);
    var archive = archiver('zip');

    out.on('close', function()
    {
        if (callback)
        {
            callback(file);
        }
    });

    archive.on('error', function(err)
    {
        throw err;
    });

    archive.pipe(out);
    process._loggedBulkDeprecation = true;
    archive.bulk([{
        expand: true,
        cwd: extract,
        src: ['**'],
        dest: ''
    }]);
    archive.finalize();

    console.log('\n=> Jar built in ' + file);

    return file;
}

function download(url, dest, cb)
{
    var file = fs.createWriteStream(dest);

    http.get(url, function(response)
    {
        response.pipe(file);

        file.on('finish', function()
        {
            file.close(cb);
        });
    }).on('error', function(err)
    {
        fs.unlink(dest);

        if (cb)
        {
            cb(err.message);
        }
    });
}

function unzip(file, dest)
{
    var zip = new AdmZip(file);
    zip.extractAllTo(dest, true);
}