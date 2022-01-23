interface OriginalApiError {
  error: string;
  message: string[] | string;
  statusCode: number;
}

interface ApiError {
  message: string;
  code: number;
}

export enum StatusCode {
  OK = 200,
  UNAUTHORIZED = 401,
  METHOD_NOT_ALLOWED = 405,
  FORBIDDEN = 403,
}

export const mapErrors = (error: OriginalApiError): ApiError => {
  let message = '';

  if (error.message && Array.isArray(error.message)) {
    (error.message || []).forEach(e => {
      message = `${message}\n\n${e}`;
    });
  }

  if (typeof error.message === 'string') {
    message = error.message;
  }

  message = message.trim();
  return {
    message,
    code: error.statusCode,
  };
};
