export type AccountSignupDetails = {
  email: string;
  nickname: string;
  password: string;
};

export type AccountLoginDetails = {
  email: string;
  password: string;
};

export type SuccessfulLoginResult = {
  passwordKey: ArrayBuffer;
  accountKey: ArrayBuffer;
};

export type SuccessfulSignupResult = {
  accountKey: ArrayBuffer;
};
