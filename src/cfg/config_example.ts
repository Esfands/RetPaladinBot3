export default {
  tmiOptions: {
      options: {
          debug: true
      },
      connection: {
          reconnect: true,
          secure: true
      },
      identity: {
          username: "bot_username",
          password: "oauth:token"
      },
      channels: ["yourchannel"]
  },
  helixOptions: {
      clientId: "",
      clientSecret: "",
      redirect: "",
      token: "",
      appToken: "",
      eventSub: ""
  },
  apiKeys: {
      nasa: "",
      imgur: "",
      twitter: {
          apiKey: "",
          apiSecret: "",
          bearer: ""
      },
      deep_api: "",
      last_fm: "",
      riot: ""
  },
  permissions: {
      developers: [],
      admins: [],
      trusted: []
  },
  "testing-channels": [],
  prefix: "!",
  mongoUri: ""
}
