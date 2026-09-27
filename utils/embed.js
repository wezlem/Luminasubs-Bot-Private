const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');


const SITE_LABELS = {
  animecix: 'Animecix',
  anizm: 'Anizm',
  prax: 'AnimePrax',
  castle: 'AnimeCastle',
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

  // Çevirmen ve Redaktör: birden fazla kişi olabilir, "," ile ayrılıp tek satırda gösterilir.
  // Encoder ve Uploader: tek kişi.
  const teamParts = [];

  if (teamData.cevirmenIds && teamData.cevirmenIds.length > 0) {
    const mentions = teamData.cevirmenIds.map((id) => `<@${id}>`).join(', ');
    teamParts.push(`Çevirmen: ${mentions}`);
  }
  if (teamData.redaktorIds && teamData.redaktorIds.length > 0) {
    const mentions = teamData.redaktorIds.map((id) => `<@${id}>`).join(', ');
    teamParts.push(`Redaktör: ${mentions}`);
  }
  if (teamData.encoderId) {
    teamParts.push(`Encoder: <@${teamData.encoderId}>`);
  }
  if (teamData.uploaderId) {
    teamParts.push(`Uploader: <@${teamData.uploaderId}>`);
  }

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