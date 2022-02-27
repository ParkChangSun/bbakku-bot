import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
} from "@discordjs/voice";
import { CommandInteraction, CacheType } from "discord.js";
import ytdl from "discord-ytdl-core";
// import ytdl from "ytdl-core";
import { DBotCommand } from "../type";

export default class Music implements DBotCommand {
  static commandName = "music";
  private static instance: Music;

  async execute(interaction: CommandInteraction<CacheType>): Promise<any> {
    const guild = interaction.guild!;
    const channel = guild.members.cache.get(interaction.member?.user.id!)?.voice
      .channelId;
    if (!channel) {
      return interaction.reply("voice channel is not detected");
    }
    const connection = joinVoiceChannel({
      channelId: channel,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    const link = interaction.options.getString("url", true);
    const stream = ytdl(link, {
      filter: "audioonly",
      opusEncoded: true,
      encoderArgs: ["-af", "bass=g=10,dynaudnorm=f=200"],
      highWaterMark: 1 << 25,
    });
    const resource = createAudioResource(stream, {
      inputType: StreamType.Opus,
    });
    const player = createAudioPlayer();

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => connection.destroy());

    // return interaction.reply("music play");
  }

  getBuilder():
    | Partial<SlashCommandBuilder>
    | SlashCommandSubcommandsOnlyBuilder {
    return new SlashCommandBuilder()
      .setName("music")
      .setDescription("play youtube music")
      .addStringOption((op) =>
        op
          .setName("url")
          .setDescription("youtube url to play")
          .setRequired(true)
      );
  }

  static getInstance(): Music {
    if (!Music.instance) {
      Music.instance = new Music();
    }
    return Music.instance;
  }
}
