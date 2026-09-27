const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const pendingEpisodeData = require('../utils/pendingData');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bolumbildirimi')
    .setDescription('Yeni bölüm bildirimi gönder')
    .addRoleOption((option) =>
      option
        .setName('rol')
        .setDescription('Bildirimde etiketlenecek rol (opsiyonel)')
        .setRequired(false),
    )
    .addUserOption((option) =>
      option.setName('cevirmen').setDescription('Çevirmen (opsiyonel)').setRequired(false),
    )
    .addUserOption((option) =>
      option.setName('redaktor').setDescription('Redaktör (opsiyonel)').setRequired(false),
    )
    .addUserOption((option) =>
      option.setName('encoder').setDescription('Encoder (opsiyonel)').setRequired(false),
    )
    .addUserOption((option) =>
      option.setName('uploader').setDescription('Uploader (opsiyonel)').setRequired(false),
    ),

  async execute(interaction) {
    const yetkiliRolId = process.env.YETKILI_ROL;
    if (yetkiliRolId && !interaction.member.roles.cache.has(yetkiliRolId)) {
      return interaction.reply({
        content: 'Bu komutu kullanma yetkin yok.',
        ephemeral: true,
      });
    }

    const selectedRole = interaction.options.getRole('rol');
    const cevirmen = interaction.options.getUser('cevirmen');
    const redaktor = interaction.options.getUser('redaktor');
    const encoder = interaction.options.getUser('encoder');
    const uploader = interaction.options.getUser('uploader');

    // Girilen ekip bilgilerini, bu moderatörün Discord ID'siyle eşleştirip
    // geçici olarak saklıyoruz. Modal gönderilince buradan geri okuyacağız.
    pendingEpisodeData.set(interaction.user.id, {
      cevirmenId: cevirmen ? cevirmen.id : null,
      redaktorId: redaktor ? redaktor.id : null,
      encoderId: encoder ? encoder.id : null,
      uploaderId: uploader ? uploader.id : null,
    });

    const roleId = selectedRole ? selectedRole.id : 'none';

    const modal = new ModalBuilder()
      .setCustomId(`episodeModal_${roleId}`)
      .setTitle('Yeni Bölüm Bildirimi');

    const malLinkInput = new TextInputBuilder()
      .setCustomId('malLink')
      .setLabel('MyAnimeList Linki')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('https://myanimelist.net/anime/16498/...')
      .setRequired(true);

    const seasonInput = new TextInputBuilder()
      .setCustomId('season')
      .setLabel('Sezon')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('1')
      .setRequired(true);

    const episodeInput = new TextInputBuilder()
      .setCustomId('episode')
      .setLabel('Bölüm')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('12')
      .setRequired(true);

    const linksInput = new TextInputBuilder()
      .setCustomId('releaseLinks')
      .setLabel('Yayın Linkleri (site=url, satır başı)')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('animecix=https://...\nanizm=https://...')
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(malLinkInput),
      new ActionRowBuilder().addComponents(seasonInput),
      new ActionRowBuilder().addComponents(episodeInput),
      new ActionRowBuilder().addComponents(linksInput),
    );

    await interaction.showModal(modal);
  },
};