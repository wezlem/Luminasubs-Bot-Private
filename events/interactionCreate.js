const { extractMalId, getAnimeInfo } = require('../utils/mal');
const { parseReleaseLinks } = require('../utils/parseLinks');
const { buildEpisodeEmbed, buildLinkButtons } = require('../utils/embed');
const pendingEpisodeData = require('../utils/pendingData');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Komut çalıştırılırken bir hata oluştu.', ephemeral: true });
      }
      return;
    }

    if (interaction.isModalSubmit() && interaction.customId.startsWith('episodeModal_')) {
      await interaction.deferReply({ ephemeral: true });

      const malLink = interaction.fields.getTextInputValue('malLink');
      const season = interaction.fields.getTextInputValue('season');
      const episode = interaction.fields.getTextInputValue('episode');
      const releaseLinksRaw = interaction.fields.getTextInputValue('releaseLinks');

      const roleId = interaction.customId.split('_')[1];
      const roleMention = roleId && roleId !== 'none' ? `<@&${roleId}>` : null;

      // Komut çalıştırılırken saklanan ekip bilgilerini geri al ve Map'ten temizle
      const teamData = pendingEpisodeData.get(interaction.user.id) || {};
      pendingEpisodeData.delete(interaction.user.id);

      const malId = extractMalId(malLink);
      if (!malId) {
        return interaction.editReply('❌ Geçersiz MyAnimeList linki. Lütfen linki kontrol edip tekrar dene.');
      }

      const animeInfo = await getAnimeInfo(malId);
      if (!animeInfo) {
        return interaction.editReply('❌ Anime bilgisi alınamadı. MAL ID doğru mu ya da Jikan API şu an yanıt vermiyor olabilir.');
      }

      const releaseLinks = parseReleaseLinks(releaseLinksRaw);
      if (releaseLinks.length === 0) {
        return interaction.editReply('❌ Yayın linkleri okunamadı. Formatın "site=url" şeklinde olduğundan emin ol.');
      }

      const embed = buildEpisodeEmbed(animeInfo, season, episode, teamData);
      const buttonRow = buildLinkButtons(releaseLinks);

      const channel = interaction.channel;

      await channel.send({
        content: roleMention || undefined,
        embeds: [embed],
        components: [buttonRow],
      });

      await interaction.editReply('✅ Bölüm bildirimi gönderildi!');
    }
  },
};