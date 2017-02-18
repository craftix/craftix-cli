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
        return console.error('Usage: craftix build <target> [wrapper_config]\n\n' +
            '' +
            'Args :\n' +
            '    target\n' +
            '        The target platform. Can be one of "win", "mac", or "jar".\n' +
            '    wrapper_config\n' +
            '        craftix-wrapper.json file to pack')
    }

    console.log('=> Building and exporting project\n');
    console.log('> Cleaning output directory');

    rimraf(output, function(err) {
        if (err)
        {
            return console.err('Error while cleaning output directory : ' + err);
        }

        var file = 'craftix-wrapper.json';

        if (craftix.args.length > 1)
        {
            file = craftix.args[1];
        }

        if (!fs.existsSync(file))
        {
            return console.error('Can\'t find the wrapper config "' + file + '"');
        }

        var config = fs.readFileSync(file);
        var target = craftix.args[0];

        if (target == 'win')
        {
            buildWindows(craftix, config);
        }
        else if (target == 'mac')
        {
            buildMac(craftix, config);
        }
        else if (target == 'jar')
        {
            buildBase(craftix, config, function()
            {
            });
        }
        else
        {
            return console.error('Unknown target "' + target + '"');
        }
    });
};

function buildWindows(craftix, config)
{
    buildBase(craftix, config, function(jar)
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

function wrapExe(craftix, config, launch4j, jar)
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

function buildBase(craftix, config, callback)
{
    var buildConfig = craftix.build();

    console.log('=> Building JAR using Craftix Wrapper ' + craftix.wrapper + '\n');

    var wrapper = output + 'wrapper/';
    var extract = wrapper + 'content/';

    console.log('> Downloading wrapper');
    var jar = 'craftix-wrapper-' + craftix.wrapper + '.jar';
    //download('http://github.com/craftix/craftix-wrapper/releases/download/' + craftix.version + '/' + jar, jar = wrapper + jar);

    console.log('> Unzipping it');
    unzip(jar, extract);

    console.log('> Setting up wrapper');
    config = JSON.parse(config);
    config.launcher = buildConfig;
    config = JSON.stringify(config, null, 4);

    fs.writeFileSync(extract + 'craftix-wrapper.json', config);

    console.log('> Rebuilding it');
    var file = output + buildConfig.name + '.jar';

    var out = fs.createWriteStream(file);
    var archive = archiver('zip');

    out.on('close', function()
    {
        callback(file);
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