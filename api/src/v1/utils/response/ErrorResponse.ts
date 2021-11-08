import { IResponse, Response, ResponseStatus } from './Response';

export interface IErrorResponse extends IResponse {
  status: ResponseStatus.Error;
  error: {
    message: string;
  };
}

export enum ErrorCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ServerError = 500,
}

export class ErrorResponse extends Response {
  public constructor(
    statusCode: ErrorCode,
    private readonly errorMessage: string
  ) {
    super(statusCode);
  }

  protected buildPayload(): IErrorResponse {
    return {
      status: ResponseStatus.Error,
      error: {
        message: this.errorMessage,
      },
    };
  }
}
