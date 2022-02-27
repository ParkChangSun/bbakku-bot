import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { getRepository } from "typeorm";
import { PlanEntity } from "../database/PlanEntity";
import { DBotCommand } from "../type";
import dayjs from "dayjs";

export default class Plan implements DBotCommand {
  static commandName: string = "plan";
  private static instance: Plan;

  async execute(interaction: CommandInteraction): Promise<any> {
    const planRepo = getRepository(PlanEntity);
    const sub = interaction.options.getSubcommand();
    if (sub === "create") {
      const planOption = interaction.options.getString("plan", true);
      await planRepo.save(
        planRepo.create({
          name: planOption,
          goal: planOption,
          d_day: dayjs().format("YYYY-MM-DD"),
        })
      );
      return interaction.reply(`plan ${planOption} created`);
    } else if (sub === "edit") {
      const plan = interaction.options.getString("plan", true);
      const user = interaction.options.getUser("user");
      if (!user) {
        return interaction.reply("no payload user");
      }
      const p = await planRepo.findOne(plan);
      if (!p) {
        return interaction.reply("no plan found");
      }
      const newmem = p.member || [];
      newmem.push(interaction.user.id);
      await planRepo.update({ name: plan }, { member: newmem });
      return interaction.reply("plan edited");
    } else if (sub === "delete") {
      const plan = interaction.options.getString("plan", true);
      const p = await planRepo.findOne(plan);
      if (!p) {
        return interaction.reply("plan not found");
      }
      await planRepo.delete({ name: plan });
      interaction.reply(`plan ${plan} deleted`);
    }
  }

  getBuilder():
    | Partial<SlashCommandBuilder>
    | SlashCommandSubcommandsOnlyBuilder {
    return new SlashCommandBuilder()
      .setName("plan")
      .setDescription("create plan")
      .addSubcommand((sub) =>
        sub
          .setName("create")
          .setDescription("create new plan")
          .addStringOption((option) =>
            option
              .setName("plan")
              .setDescription("new plan name")
              .setRequired(true)
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("edit")
          .setDescription("edit your plan")
          .addStringOption((op) =>
            op.setName("plan").setDescription("plan to edit").setRequired(true)
          )
          .addUserOption((op) =>
            op.setName("user").setDescription("user to add to plan")
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("delete")
          .setDescription("delete plan")
          .addStringOption((op) =>
            op
              .setName("plan")
              .setDescription("plan to delete")
              .setRequired(true)
          )
      );
  }

  static getInstance(): Plan {
    if (!Plan.instance) {
      Plan.instance = new Plan();
    }
    return Plan.instance;
  }
}
