// src/common/helpers/response.helper.ts

import { ApiResponse } from 'src/types/common';

export function successResponse<T>(
  data: T,
  usrMsg = 'Request successful',
): ApiResponse<T> {
  return {
    success: true,
    usrMsg,
    data,
  };
}

export function errorResponse(
  errMsg = 'Something went wrong',
  usrMsg = 'An error occurred',
): ApiResponse<null> {
  return {
    success: false,
    usrMsg,
    errMsg,
  };
}
