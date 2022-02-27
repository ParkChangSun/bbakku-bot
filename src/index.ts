import { BOT_TOKEN, options } from "./config";
import { Client, Intents } from "discord.js";
import { commandInstances, registerCommands } from "./commands";
import { createConnection } from "typeorm";

global.AbortController = require("node-abort-controller").AbortController;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.once("ready", async () => {
  await registerCommands(client.user?.id ?? "");
  console.log("command registeration complete");
  await createConnection(options);
  console.log("database connection complete");
  console.log("ready");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const command = commandInstances.get(interaction.commandName);
  if (!command) {
    return await interaction.reply("command not found");
  }
  await command.execute(interaction);
});

client.login(BOT_TOKEN);
