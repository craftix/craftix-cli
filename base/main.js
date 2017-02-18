const electron = require('electron');
const path = require('path');
const url = require('url');
const config = require('./craftix');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var mainWindow;

function createWindow()
{
    mainWindow = new BrowserWindow({
        title: config.title,
        width: config.size.width,
        height: config.size.height,
        frame: !config.undecorated,
        resizable: config.resizable,
        autoHideMenuBar: true,
        center: true
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, config.main),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', function()
    {
        mainWindow = null
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', function()
{
    if (process.platform !== 'darwin')
    {
        app.quit()
    }
});

app.on('activate', function()
{
    if (mainWindow === null)
    {
        createWindow()
    }
});