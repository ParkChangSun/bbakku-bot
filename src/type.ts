import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export interface DBotCommand {
  execute(interaction: CommandInteraction): Promise<any> | void;
  getBuilder():
    | Partial<SlashCommandBuilder>
    | SlashCommandSubcommandsOnlyBuilder;
}
