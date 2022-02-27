import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import dayjs from "dayjs";
import { CommandInteraction, CacheType, MessageEmbed } from "discord.js";
import { getRepository } from "typeorm";
import { AttendanceEntity } from "../database/AttendanceEntity";
import { PlanEntity } from "../database/PlanEntity";
import { DBotCommand } from "../type";

export default class Show implements DBotCommand {
  static commandName = "show";
  private static instance: Show;

  async execute(interaction: CommandInteraction<CacheType>): Promise<any> {
    const sub = interaction.options.getSubcommand();
    const planRepo = getRepository(PlanEntity);
    if (sub === "plan") {
      const plan = interaction.options.getString("plan", true);
      const target = await planRepo.findOne({ where: { name: plan } });
      if (!target) {
        return interaction.reply("there is no plan named " + plan);
      }
      let memListStr: string = "";
      target.member?.forEach((m) => (memListStr += "<@" + m + ">,"));
      const attRepo = getRepository(AttendanceEntity);
      const attHistory = await attRepo.find({ where: { plan: plan } });
      let attStr = "";
      attHistory.forEach((att) => {
        attStr +=
          "<@" +
          att.member +
          "> " +
          dayjs(att.attendedAt).format("YYYY-MM-DD") +
          "\n";
      });
      const planEmbed = new MessageEmbed()
        .setColor("#7289da")
        .setTitle(target.name)
        .setDescription(target.goal)
        .setAuthor({
          name: interaction.client.user?.username!,
          iconURL: interaction.client.user?.displayAvatarURL(),
        })
        .addField("dday", target.d_day || "dday not set")
        .addField("member", memListStr || "no member")
        .addField("attendance", attStr || "not attended");
      interaction.reply({ embeds: [planEmbed] });
    } else if (sub === "list") {
      const plans = await planRepo.find({ select: ["name"] });
      const repl = "plan list : " + plans.map((p) => p.name);
      interaction.reply(repl);
    }
  }

  getBuilder():
    | Partial<SlashCommandBuilder>
    | SlashCommandSubcommandsOnlyBuilder {
    return new SlashCommandBuilder()
      .setName("show")
      .setDescription("information of..")
      .addSubcommand((sub) =>
        sub
          .setName("plan")
          .setDescription("plan")
          .addStringOption((op) =>
            op.setName("plan").setDescription("plan name").setRequired(true)
          )
      )
      .addSubcommand((sub) =>
        sub.setName("list").setDescription("list current plans")
      );
  }

  static getInstance(): Show {
    if (!Show.instance) {
      Show.instance = new Show();
    }
    return Show.instance;
  }
}
