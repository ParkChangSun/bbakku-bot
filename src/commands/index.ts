import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Collection } from "discord.js";
import { PARK_GUILD_ID, BOT_TOKEN, BBAKKU_GUILD_ID } from "../config";
import { DBotCommand } from "../type";
import Attendance from "./Attendance";
import Music from "./Music";
import Plan from "./Plan";
import Show from "./Show";

const commandInstances = new Collection<string, DBotCommand>();

commandInstances.set(Attendance.commandName, Attendance.getInstance());
commandInstances.set(Plan.commandName, Plan.getInstance());
commandInstances.set(Show.commandName, Show.getInstance());
commandInstances.set(Music.commandName, Music.getInstance());

async function registerCommands(clientId: string) {
  const rest = new REST({ version: "9" }).setToken(BOT_TOKEN);
  const builders = commandInstances.map((command) => command.getBuilder());
  try {
    await rest.put(Routes.applicationGuildCommands(clientId, PARK_GUILD_ID), {
      body: builders,
    });
    await rest.put(Routes.applicationGuildCommands(clientId, BBAKKU_GUILD_ID), {
      body: builders,
    });
  } catch (error) {
    console.error(error);
  }
}

export { commandInstances, registerCommands };
