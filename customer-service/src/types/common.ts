export interface ApiResponse<T> {
  success: boolean;
  usrMsg?: string;
  data?: T;
  errMsg?: string;
}
