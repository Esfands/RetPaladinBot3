import { addSubToSpin } from "../../modules/wheel-spin-counter"

export default async (client: any, channel: any, username: any, streakMonths: any, recipient: any, methods: any, userstate: any) => {
  addSubToSpin(1, username);
}