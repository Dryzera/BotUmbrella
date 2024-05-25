const express = require('express');
const app = express();
app.get("/", (request, response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});
app.listen(process.env.PORT);

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});
const config = require('./config.json');

let dinheiroTotal = 0;

client.once('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);
    client.user.setActivity(config.status, { type: 'PLAYING' });
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'adicionar') {
        const valorDigitado = parseFloat(args[0]);
        if (!isNaN(valorDigitado)) {
            dinheiroTotal += valorDigitado;
            message.channel.send(`✅ **Você adicionou ${valorDigitado} ao total.**\nNovo saldo: **${dinheiroTotal}**`);
        } else {
            message.channel.send('❌ **Digite um valor numérico válido.**');
        }
    } else if (command === 'remover') {
        const valorDigitado = parseFloat(args[0]);
        if (!isNaN(valorDigitado)) {
            if (dinheiroTotal >= valorDigitado) {
                dinheiroTotal -= valorDigitado;
                message.channel.send(`✅ **Você retirou ${valorDigitado} do total.**\n**Novo saldo:** *${dinheiroTotal}*`);
            } else {
                message.channel.send('❌ **Saldo insuficiente para retirada.**');
            }
        } else {
            message.channel.send('❌ **Digite um valor numérico válido.**');
        }
    } else if (command === 'extrato') {
        message.channel.send(`💰 **O saldo total é:** *${dinheiroTotal}*`);
    }
});

client.login(config.token);