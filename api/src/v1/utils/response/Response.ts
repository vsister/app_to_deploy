import express from 'express';

export enum ResponseStatus {
  Success = 'success',
  Error = 'error',
}

export interface IResponse {
  status: ResponseStatus;
}

export abstract class Response {
  public constructor(protected readonly statusCode: number) {}

  protected abstract buildPayload(): any;

  public send(res: express.Response): void {
    res.status(this.statusCode);
    res.json(this.buildPayload());
  }

  public sendFile(res: express.Response): void {
    res.sendFile(this.buildPayload());
  }
}
