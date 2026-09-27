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
      option.setName('cevirmen2').setDescription('Çevirmen 2 (opsiyonel)').setRequired(false),
    )
    .addUserOption((option) =>
      option.setName('cevirmen3').setDescription('Çevirmen 3 (opsiyonel)').setRequired(false),
    )
    .addUserOption((option) =>
      option.setName('cevirmen4').setDescription('Çevirmen 4 (opsiyonel)').setRequired(false),
    )
    .addUserOption((option) =>
      option.setName('cevirmen5').setDescription('Çevirmen 5 (opsiyonel)').setRequired(false),
    )
    .addUserOption((option) =>
      option.setName('redaktor').setDescription('Redaktör (opsiyonel)').setRequired(false),
    )
    .addUserOption((option) =>
      option.setName('redaktor2').setDescription('Redaktör 2 (opsiyonel)').setRequired(false),
    )
    .addUserOption((option) =>
      option.setName('redaktor3').setDescription('Redaktör 3 (opsiyonel)').setRequired(false),
    )
    .addUserOption((option) =>
      option.setName('redaktor4').setDescription('Redaktör 4 (opsiyonel)').setRequired(false),
    )
    .addUserOption((option) =>
      option.setName('redaktor5').setDescription('Redaktör 5 (opsiyonel)').setRequired(false),
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

    // Çevirmen ve Redaktör için 1'den 5'e kadar olan kullanıcıları topla
    const cevirmenler = ['cevirmen', 'cevirmen2', 'cevirmen3', 'cevirmen4', 'cevirmen5']
      .map((name) => interaction.options.getUser(name))
      .filter(Boolean)
      .map((user) => user.id);

    const redaktorler = ['redaktor', 'redaktor2', 'redaktor3', 'redaktor4', 'redaktor5']
      .map((name) => interaction.options.getUser(name))
      .filter(Boolean)
      .map((user) => user.id);

    const encoder = interaction.options.getUser('encoder');
    const uploader = interaction.options.getUser('uploader');

    // Girilen ekip bilgilerini, bu moderatörün Discord ID'siyle eşleştirip
    // geçici olarak saklıyoruz. Modal gönderilince buradan geri okuyacağız.
    pendingEpisodeData.set(interaction.user.id, {
      cevirmenIds: cevirmenler,
      redaktorIds: redaktorler,
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