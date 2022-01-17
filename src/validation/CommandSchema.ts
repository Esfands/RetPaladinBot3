const joi = require('@hapi/joi');
import { Actions, CommonUserstate } from "tmi.js";
import { OPTIONAL_PERMISSIONS, VALID_PERMISSIONS } from "./PermissionTypes";

export type commandInt = {
  name: string;
  aliases: [string];
  permissions: [string];
  globalCooldown: number;
  cooldown: number;
  description: string;
  dynamicDescription: [string];
  testing: boolean;
  offlineOnly: boolean;
  count: number;
  code: (client: Actions, channel: string, userstate: CommonUserstate, context: (string | number | boolean)[]) => void;
}

/**
 * Validation for command files.
 * Change this when needed or when extending your system for more capabilities.
 */
export const CommandSchema = joi.object({
  name: joi.string().min(1).max(32).required(),
  aliases: joi.array().items(joi.string()),
  permissions: joi.array().items(joi.string().valid(...VALID_PERMISSIONS, ...OPTIONAL_PERMISSIONS)),
  globalCooldown: joi.number(),
  cooldown: joi.number(),
  description: joi.string(),
  dynamicDescription: joi.array(),
  testing: joi.boolean(),
  // Check if the user a developer, 
  offlineOnly: joi.boolean(),
  code: joi.function().required()
});