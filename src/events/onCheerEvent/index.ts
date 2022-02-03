import { subathonLogEvent, SubathonStatType } from "../../modules/subathon-stats"

export default async (client: any, channel: any, userstate: any, message: any) => {
  subathonLogEvent(userstate, SubathonStatType.BITS, userstate["bits"]);
}