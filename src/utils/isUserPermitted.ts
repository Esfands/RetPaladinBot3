import { EXEMPT } from "../validation/PermissionTypes";
import { CommonUserstate } from "tmi.js";
import config from "../cfg/config";

/**
 * Compares the supplied badges with the required badges.
 * @public
 * @param {Object} currentPermissionsObj  The badges object returned from the TMI
 * @param {Array} requiredPermissionsArr The permissions array from the specified command
 * @returns {Boolean} True if the supplied badges have at least one required badge, false if it doesn't have any required badge
 */
export default (currentUserstate: CommonUserstate, requiredPermissionsArr: Array<string>) => {

  // if the command doesn't require any badges/permissions, we can return true and run the command
  if (!requiredPermissionsArr || requiredPermissionsArr.length == 0) return true;

  // put all keys from the TMI 'badges' object into an array
  const currentPermsArr = currentUserstate["badges"] == null ? [] : Object.keys(currentUserstate["badges"]);

  // if the user has any permission which is exempt from permission handling, we can return true and run the command
  if (EXEMPT.some(perm => currentPermsArr.includes(perm))) return true;

  // Check for if user is a developer, admin, or trusted
  if (requiredPermissionsArr.includes("developer")) return config.permissions.developers.includes(currentUserstate["username"]);
  if (requiredPermissionsArr.includes("admin")) return config.permissions.developers.includes(currentUserstate["username"]);
  if (requiredPermissionsArr.includes("trusted")) return config.permissions.trusted.includes(currentUserstate["username"]);

  // otherwise, check if the user has any permissions specified in the command, true : false
  return requiredPermissionsArr.some(perm => currentPermsArr.includes(perm));
}