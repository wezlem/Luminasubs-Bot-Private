const { setPresence } = require('../utils/presence');

module.exports = {
  name: 'clientReady',
  once: true,
  execute(client) {
    console.log(`Bot giriş yaptı: ${client.user.tag}`);
    setPresence(client);
  },
};