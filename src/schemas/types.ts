export interface IChatter {
  TID: number;
  Username: string;
  DisplayName: string;
  Color: string;
  RetFuel: number;
  Badges: object;
}

export interface ICommand {
  name: string;
  aliases: Array<string>;
  permissions: Array<string>;
  trusted: boolean;
  globalCooldown: number;
  cooldown: number;
  description: string;
  dynamicDescription: Array<string>;
  testing: boolean;
  offlineOnly: boolean;
  count: number;
}

export interface IOTFCommand {
  Name: string;
  Response: string;
  Creator: string;
  Count: number;
}

enum FeedbackType {
  feedback,
  bug
}

enum FeedbackStatus {
  pending,
  complete,
  'in progress',
  bug
}

export interface IFeedback {
  ID: number;
  Username: string;
  DisplayName: string;
  Message: string;
  type: FeedbackType;
  status: FeedbackStatus;
}

export interface INotify {
  Type: string;
  Users: Array<string>;
}

export interface ICron {
  Title: string;
  Pattern: string;
  Disabled: boolean;
  Response: {
    Command: boolean;
    Response: string;
  };
}

export interface IKeyword {
  Title: string;
  Regex: string;
  Cooldown: number;
  Disabled: string;
  Message: string;
}