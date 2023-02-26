const { Telegraf } = require('telegraf');
require('dotenv').config();
const axios = require('axios');
const download = require('download');
const fs = require('fs');
const path = require('path');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.on('text', async (ctx) => {
  // await ctx.reply(ctx.message.text);
  try {
    console.log('get messsage');
    let link = ctx.message.text;
    let res = await axios.post('https://ssyoutube.com/api/convert', {
      url: `${link}`,
    });

    // const willDownload = res.data.url[0].url;
    if (res.data.length) {
      for (let i = 0; i <= res.data.length; i++) {
        let willDownload = res.data[i].url[0].url;
        // Url of the image
        const urlFile = willDownload;
        // Path at which image will get downloaded
        const filePath = `${__dirname}/media`;
        let fileName;
        download(urlFile, filePath)
          .then(() => {
            //passsing directoryPath and callback function
            fs.readdir(filePath, function (err, files) {
              //handling error
              if (err) {
                return console.log('Unable to scan directory: ' + err);
              }
              //listing all files using forEach
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
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    // console.log(res.data);
    // await ctx.sendMessage(JSON.stringify(res.data));

    // // Url of the image
    // const urlFile = willDownload;
    // // Path at which image will get downloaded
    // const filePath = `${__dirname}/media`;
    // let fileName;
    // download(urlFile, filePath)
    //   .then(() => {
    //     //passsing directoryPath and callback function
    //     fs.readdir(filePath, function (err, files) {
    //       //handling error
    //       if (err) {
    //         return console.log('Unable to scan directory: ' + err);
    //       }
    //       //listing all files using forEach
    //       files.forEach(function (file) {
    //         // Do whatever you want to do with the file
    //         fileName = file;
    //         ctx
    //           .replyWithPhoto({ source: `${filePath}/${fileName}` })
    //           .then(() => {
    //             fs.unlinkSync(`${filePath}/${fileName}`);
    //           });
    //       });
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  } catch (error) {
    console.log(error.message);
  }
});
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
