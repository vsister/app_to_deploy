import { Error } from 'mongoose';
import { AuthException } from 'utils/exception/Auth/AuthException';
import { DataAccessException } from 'utils/exception/DataAccessException';
import { DatabaseException } from 'utils/exception/DatabaseException';
import { Exception } from 'utils/exception/Exception';
import { ValidationException } from 'utils/exception/ValidationException';
import { ValidatorSchemaMissingException } from 'utils/exception/ValidatorSchemaMissingException';
import { ErrorCode, ErrorResponse } from 'utils/response/ErrorResponse';

export class ExceptionHandler {
  public constructor(private readonly exception: any) {}

  public getResponse(): ErrorResponse {
    if (!(this.exception instanceof Exception)) {
      return new ErrorResponse(ErrorCode.ServerError, `Unhandled Exception: ${this.exception}`);
    }

    if (this.exception instanceof ValidatorSchemaMissingException) {
      return new ErrorResponse(ErrorCode.BadRequest, this.exception.message);
    }

    if (this.exception instanceof AuthException) {
      return new ErrorResponse(ErrorCode.Unauthorized, this.exception.message);
    }

    if (this.exception instanceof DataAccessException) {
      return new ErrorResponse(ErrorCode.Forbidden, this.exception.message);
    }

    if (this.exception instanceof ValidationException) {
      return new ErrorResponse(ErrorCode.BadRequest, this.exception.message);
    }

    return new ErrorResponse(ErrorCode.ServerError, `Unknown Exception: ${this.exception.message}`);
  }
}
