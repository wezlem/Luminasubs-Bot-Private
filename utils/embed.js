const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');


const SITE_LABELS = {
  animecix: 'Animecix',
  anizm: 'Anizm',
  prax: 'AnimePrax',
  castle: 'AnimeCastle',
};

// Ekip bilgisi anahtarları ile embed'de görünecek etiketlerin eşleşmesi
const TEAM_LABELS = {
  cevirmenId: 'Çevirmen',
  redaktorId: 'Redaktör',
  encoderId: 'Encoder',
  uploaderId: 'Uploader',
};

function formatSiteLabel(site) {
  if (SITE_LABELS[site]) return SITE_LABELS[site];
  return site.charAt(0).toUpperCase() + site.slice(1);
}


function buildEpisodeEmbed(animeInfo, season, episode, teamData = {}) {
  const embed = new EmbedBuilder()
    .setColor(0xEBEBEB)
    .setTitle(animeInfo.title)
    .setDescription(`\u200b${season}. Sezon ${episode}. Bölüm Yayında! <:emo1:1553566222476378202>\n*İyi seyirler dileriz!*\n\n-# -Butonlardan sitelere erişebilirsiniz.`)
    .setFooter({ text: 'LuminaSubs' })
    .setTimestamp();

  if (animeInfo.image) {
  embed.setImage(animeInfo.image);
}


  const fields = [];

  if (animeInfo.studio) {
    fields.push({ name: 'Stüdyo', value: animeInfo.studio, inline: true });
  }
  if (animeInfo.year) {
    fields.push({ name: 'Yıl', value: String(animeInfo.year), inline: true });
  }
  if (animeInfo.score) {
    fields.push({ name: 'MAL Puanı', value: `⭐ ${animeInfo.score}`, inline: true });
  }

  if (fields.length > 0) {
    embed.addFields(fields);
  }

  // Sadece doldurulan ekip bilgilerini "Çevirmen: @a & Redaktör: @b" şeklinde
  // tek satırda, başlıksız (\u200b) bir field olarak ekle
  const teamParts = Object.keys(TEAM_LABELS)
    .filter((key) => teamData[key])
    .map((key) => `${TEAM_LABELS[key]}: <@${teamData[key]}>`);

  if (teamParts.length > 0) {
    embed.addFields({ name: '\u200b', value: teamParts.join(' & '), inline: false });
  }

  return embed;
}


function buildLinkButtons(releaseLinks) {
  const row = new ActionRowBuilder();

  for (const { site, url } of releaseLinks) {
    row.addComponents(
      new ButtonBuilder()
        .setLabel(formatSiteLabel(site))
        .setStyle(ButtonStyle.Link)
        .setURL(url),
    );
  }

  return row;
}

module.exports = { buildEpisodeEmbed, buildLinkButtons };