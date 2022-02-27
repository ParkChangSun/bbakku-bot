import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
import { getRepository } from "typeorm";
import { AttendanceEntity } from "../database/AttendanceEntity";
import { PlanEntity } from "../database/PlanEntity";
import { DBotCommand } from "../type";

export default class Attendance implements DBotCommand {
  static commandName: string = "attendance";
  private static instance: Attendance;

  async execute(interaction: CommandInteraction<CacheType>): Promise<void> {
    const plan = interaction.options.getString("plan", true);
    const attRepo = getRepository(AttendanceEntity);
    const planRepo = getRepository(PlanEntity);
    const p = await planRepo.findOne({ where: { name: plan } });
    if (!p) {
      return interaction.reply("no plan");
    }
    await attRepo.save(
      attRepo.create({ member: interaction.user.id, plan: p })
    );
    return interaction.reply(`${plan} attended`);
  }

  getBuilder():
    | Partial<SlashCommandBuilder>
    | SlashCommandSubcommandsOnlyBuilder {
    return new SlashCommandBuilder()
      .setName("attendance")
      .setDescription("att")
      .addStringOption((option) =>
        option.setName("plan").setDescription("plan to att").setRequired(true)
      );
  }

  static getInstance(): Attendance {
    if (!Attendance.instance) {
      Attendance.instance = new Attendance();
    }
    return Attendance.instance;
  }
}
