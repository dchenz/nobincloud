export type Success<T> = {
  success: true;
  data: T;
};

export type Failure = {
  success: false;
  data: string;
};

export type Response<T = undefined> = Success<T> | Failure;
