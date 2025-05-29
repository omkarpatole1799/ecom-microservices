export interface ApiResponse<T> {
  success: boolean;
  usrMsg?: string;
  data?: T;
  errMsg?: string;
}

export interface JwtPayloadInterface {
  id: string | undefined;
  email: string | undefined;
  name: string | undefined;
}
