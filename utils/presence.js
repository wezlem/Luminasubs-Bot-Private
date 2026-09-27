const { ActivityType } = require('discord.js');

function setPresence(client) {
  client.user.setPresence({
    activities: [
      {
        name: 'LuminaSubs',
        type: ActivityType.Watching,
      },
    ],
    status: 'online',
  });
}

module.exports = { setPresence };