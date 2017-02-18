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
