const { default: axios } = require('axios');

const download = require('download');
const { Telegraf } = require('telegraf');
const fs = require('fs');
const config = require('./app/config/config');
const bot = new Telegraf(config.telegram.token);
bot.on('text', async (ctx) => {
  try {
    const link = ctx.message.text;
    let res = await axios.post('https://ssyoutube.com/api/convert', {
      url: `${link}`,
    });
    // console.log(res.data.url);
    if (res.data.length) {
      for (let i = 0; i < res.data.length; i++) {
        let urlDownload = res.data[i].url[0].url;
        const urlFile = urlDownload;
        const filePath = `${__dirname}/media`;
        let fileName;
        download(urlFile, filePath).then(() => {
          fs.readdir(filePath, (err, files) => {
            if (err) {
              console.log('unable to scan directory');
            }
            files.forEach(function (file) {
              // Do whatever you want to do with the file
              fileName = file;
              ctx
                .replyWithPhoto({ source: `${filePath}/${fileName}` })
                .then(() => {
                  fs.unlinkSync(`${filePath}/${fileName}`);
                });
            });
          });
        });
      }
    } else {
      let urlDownload = res.data.url[0].url;
      const urlFile = urlDownload;
      const filePath = `${__dirname}/media`;
      let fileName;
      // return console.log(res.data.url[0].ext);
      // cek ekstensi file
      if (res.data.url[0].ext == 'jpg') {
        // console.log('jpg');
        download(urlFile, filePath).then(() => {
          fs.readdir(filePath, (err, files) => {
            if (err) {
              console.log('unable to scan directory');
            }
            files.forEach(function (file) {
              // Do whatever you want to do with the file
              fileName = file;
              ctx
                .replyWithPhoto({ source: `${filePath}/${fileName}` })
                .then(() => {
                  fs.unlinkSync(`${filePath}/${fileName}`);
                });
            });
          });
        });
      } else {
        // return console.log('mp4');
        download(urlFile, filePath).then(() => {
          fs.readdir(filePath, (err, files) => {
            if (err) {
              console.log('unable to scan directory');
            }
            files.forEach(function (file) {
              // Do whatever you want to do with the file
              fileName = file;
              ctx
                .replyWithVideo({ source: `${filePath}/${fileName}` })
                .then(() => {
                  fs.unlinkSync(`${filePath}/${fileName}`);
                });
            });
          });
        });
      }
    }
  } catch (error) {
    ctx.reply(error.message);
  }
});
console.log('bot launch');
bot.launch();
