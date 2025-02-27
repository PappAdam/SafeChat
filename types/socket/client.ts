export type ClientPackage = 
  (ClientConnectionPackage
  | ClientNewMessagePackage
  | ClientBodyLessPackage
  | ClientSync) & {id: string};

export type ClientNewMessagePackage = {
  header: "NewMessage";
  chatId: string;
  messageContent: string;
};

export type ClientConnectionPackage = {
  header: "Authorization";
  token: string;
};

export type ClientBodyLessPackage = {
  header: "DeAuthorization";
};

export type ClientSync = {
  header: "Sync";
  displayedGroupCount: number;
  maxDisplayableMessagCount: number;
};
