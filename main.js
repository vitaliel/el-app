// https://github.com/msokk/electron-render-service

// const pjson = require('../package.json');

var fs = require("fs");

const electron = require('electron')
// Модуль, контролирующий основное: сам Electron.
const app = electron.app
// Модуль, создающий окно приложения.
const BrowserWindow = electron.BrowserWindow

// Удерживайте глобальное обращение к объекту окна, если Вы так не сделаете, то
// окно само закроется после того, как объект будет собран сборщиком мусора.
let mainWindow

function createWindow () {
  // Создаём окно браузера
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    transparent: false,
    enableLargerThanScreen: true,
    webPreferences: {
      blinkFeatures: 'OverlayScrollbars', // Slimmer scrollbars
      allowDisplayingInsecureContent: true, // Show http content on https site
      allowRunningInsecureContent: true, // Run JS, CSS from http urls
    },
  });


  // Set user agent
  // const { webContents } = window;
  // webContents.setUserAgent(`${webContents.getUserAgent()} ${pjson.name}/${pjson.version}`);

  mainWindow.webContents.on("did-finish-load", function() {
    console.log('devicePixelRatio:', mainWindow.devicePixelRatio);
    console.log('retina?:', mainWindow.retina);

    // give it some time to load the images...
    // TODO is there a better way to wait for the images to load?

    setTimeout(function() {
      // Retina adjusted width http://jsbin.com/IzEYuCI/3/edit?js,output
      const clipRect = {
        x: 0,
        y: 0,
        width: 1024,
        height: 800
      };
      mainWindow.capturePage(clipRect, function(imageBuffer) {
        fs.writeFile("out.png", imageBuffer.toPng(), function(err) {
          if (err) {
            console.log("ERROR Failed to save file", err);
          }
        });
      });
    }, 10);
  });


  // Будет выполнено, когда пользователь закроет окно
  mainWindow.on('closed', function () {
    // Убрать обращение на объект окна, обычно стоит хранить окна в массиве,
    // если ваше приложение поддерживает несколько, сейчас стоит удалить
    // соответствующий элемент.
    mainWindow = null
  })

  // и загружаем index.html приложения.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Открываем DevTools.
  // mainWindow.webContents.openDevTools()
}

// Этот метод будет вызван, когда Electron закончит инициализацию
// и будет готов создавать окна браузера.
// Некоторые API возможно использовать только после того, как
// это произойдёт.
app.on('ready', createWindow)

// Выйти, если все окна закрыты
app.on('window-all-closed', function () {
  // На macOS приложение и его строка меню обычно остаются активными,
  // пока пользователь не завершит их с помощью `Cmd + Q`.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // На macOS приложение обычно пересоздаёт окно, когда
  // пользователь кликает на его иконку в доке, если не открыто
  // других окон.
  if (mainWindow === null) {
    createWindow()
  }
})

// В этот файл Вы можете включить остальной код вашего главного процесса.
// Вы также можете разложить его по отдельным файлам и подключить с помощью require.
