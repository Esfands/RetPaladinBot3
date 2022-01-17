import config from "./cfg/config";

import * as TMI from "tmi.js";
const pb = require("@madelsberger/pausebuffer");

const client = pb.wrap(new TMI.client(config.tmiOptions));
client.setMessageCountLimit(95);
client.setMessageCountDuration(30);
client.setThrottle({
	high: 500,
	low: 500
})

client.connect();

import onChatEvent from "./events/onChatEvent/onChatEvent";
import onJoinEvent from "./events/onJoinEvent/index";
import { CommonUserstate } from "tmi.js";

// Mongo
import mongoose from "mongoose";
import onSubEvent from "./events/onSubEvent";
import onResubEvent from "./events/onResubEvent";
import onSubMysteryGiftEvent from "./events/onSubMysteryGiftEvent";
import onGiftPaidUpgradeEvent from "./events/onGiftPaidUpgradeEvent";
import onAnonGiftPaidUpgradeEvent from "./events/onAnonGiftPaidUpgradeEvent";
mongoose.connect(config.mongoUri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
} as mongoose.ConnectOptions).then(() => {
	console.log(`[SQL] Connected to MongoDB`);
}).catch((err) => {
	console.log(`[SQL] Error connecting to MongoDB ${err}`);
})

client.on("chat", async (channel: string, userstate: CommonUserstate, message: string, self: string) => await onChatEvent(client, channel, userstate, message, self));
client.on("join", async (channel: string, username: CommonUserstate, self: boolean) => await onJoinEvent(client, channel, username, self));

// TODO: Clean up the disaster that is sub events
client.on("sub", async (channel: any, username: any, method: any, message: any, userstate: any) => await onSubEvent(client, channel, username, method, message, userstate));
client.on("resub", async (channel: any, username: any, months: any, message: any, userstate: any, methods: any) => await onResubEvent(client, channel, username, months, message, userstate, methods));
client.on("submysterygift", async (channel: any, username: any, numbOfSubs: any, methods: any, userstate: any) => await onSubMysteryGiftEvent(client, channel, username, numbOfSubs, methods, userstate));
client.on("giftpaidupgrade", async (channel: any, username: any, sender: any, userstate: any) => await onGiftPaidUpgradeEvent(client, channel, username, sender, userstate));
client.on("anongiftpaidupgrade", async (channel: any, username: any, userstate: any) => await onAnonGiftPaidUpgradeEvent(client, channel, username, userstate));