export function successResponse(message: string, data?: object) {
    return {
      success: true,
      message,
      data,
    };
  }
  
  export function errorResponse(message: string, errors?: any) {
    return {
      success: false,
      message,
      errors,
    };
  }