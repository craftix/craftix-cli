var fs = require('fs');

var craftix =
{
    version: '1.0.0',
    wrapper: '1.0.0',
    server: '1.0.0',
    command: '',
    folder: '',
    args: [],
    start: function start(command, folder, args)
    {
        this.command = command;
        this.args = args;
        this.folder = folder;
        var path = folder + '/command/' + command;

        if (fs.existsSync(path + '.js') || this.command == 'version')
        {
            console.log('=> Craftix CLI v' + this.version + ' using Node.JS ' + process.version);
            console.log('=> Copyright 2017 Adrien "Litarvan" Navratil under GPL-3.0 license\n');

            if (this.command != "version")
            {
                require(path)(craftix);
            }
            else
            {
                console.log('=> Uses Craftix Wrapper v' + this.wrapper);
                console.log('=> Uses Craftix v' + this.server);
            }
        }
        else
        {
            console.log('Unknown command \'' + command + '\'');
        }
    },
    build: function()
    {
        console.log('\n=> Building project\n');
        console.log('> Reading build scripts');

        var path = process.cwd() + '/craftix';

        if (!fs.existsSync(path + '.json'))
        {
            console.error('This is not a Craftix project (missing craftix.json)');
            process.exit();
        }

        var config = require(path);
        path = process.cwd() + '/build';

        if (!fs.existsSync(path + '.js'))
        {
            console.log('\n=> No build script found, nothing to do\n');
        }
        else
        {
            console.log('> Building project \'' + config.name + '\' using its build script');
            require(path)(this, config);

            console.log('\n=> Project built');
        }

        return config;
    }
};

module.exports = craftix;