import { IResponse, Response, ResponseStatus } from './Response';

export interface ISuccessResponse extends IResponse {
  status: ResponseStatus.Success;
  data: any;
}

export enum SuccessCode {
  OK = 200,
}

export class SuccessResponse<ResponseData> extends Response {
  public constructor(
    statusCode: SuccessCode,
    private readonly data: ResponseData
  ) {
    super(statusCode);
  }

  protected buildPayload(): ISuccessResponse {
    return {
      status: ResponseStatus.Success,
      data: this.data,
    };
  }
}
