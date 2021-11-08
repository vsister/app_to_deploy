export enum ResponseStatus {
  OK = 200,
  BadRequest = 400,
  NotFound = 404,
  Unauthorized = 401,
  Forbidden = 403,
  ServerError = 500,
}

export enum RequestMethod {
  Post = 'POST',
  Get = 'GET',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
}

export abstract class Response {
  public constructor(public readonly status: ResponseStatus) {}
}

export class SuccessResponse extends Response {
  public constructor(public readonly status: ResponseStatus, public readonly data: any) {
    super(status);
  }
}

export class ErrorResponse extends Response {
  public constructor(public readonly status: ResponseStatus, public readonly error: any) {
    super(status);
  }
}

interface RequestParams {
  url: string;
  headers?: Headers;
  token?: string;
}

interface RequestWithBodyParams extends RequestParams {
  body: any;
  isJSON?: boolean;
}

export abstract class Service {
  protected baseUrl: string;
  protected defaultParams: any;

  public constructor() {
    this.baseUrl = `http://localhost:3000`;
  }

  private methodRequiresBody(method: RequestMethod): boolean {
    return method === RequestMethod.Post || method === RequestMethod.Put || method === RequestMethod.Patch;
  }

  private getHeaders(params: RequestParams, method: RequestMethod): Headers {
    const { headers: headersFromParams, token } = params;
    const headers = new Headers(headersFromParams);

    if (token) {
      headers.append('authorization', `Bearer ${token}`);
    }

    if (this.methodRequiresBody(method)) {
      if ((params as RequestWithBodyParams).isJSON) {
        headers.set('Content-Type', 'application/json');
      }
    }

    return headers;
  }

  private getBody(params: RequestWithBodyParams): any {
    const { body, isJSON } = params;

    if (isJSON) {
      return JSON.stringify(body);
    }

    return body;
  }

  private getRequestInit(params: RequestParams, method: RequestMethod): RequestInit {
    const requestInit: RequestInit = {};

    requestInit.headers = this.getHeaders(params, method);
    requestInit.method = method;
    requestInit.cache = 'default';

    if (this.methodRequiresBody(method)) {
      requestInit.body = this.getBody(params as RequestWithBodyParams);
    }

    return requestInit;
  }

  private handleRequest(params: RequestParams, method: RequestMethod): Promise<Response> {
    const requestParams: RequestParams = Object.assign({}, this.defaultParams, params);
    const { url } = requestParams;

    return new Promise((resolve, _) => {
      fetch(`${this.baseUrl}/${url}`, this.getRequestInit(requestParams, method))
        .then(_response => {
          _response
            .json()
            .then(body => {
              let response: Response;

              if (_response.ok) {
                response = new SuccessResponse(_response.status, body.data);
              } else {
                response = new ErrorResponse(_response.status, body.error);
              }

              resolve(response);
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  protected get(params: RequestParams): Promise<Response> {
    return this.handleRequest(params, RequestMethod.Get);
  }

  protected post(params: RequestWithBodyParams): Promise<Response> {
    return this.handleRequest(params, RequestMethod.Post);
  }

  protected patch(params: RequestWithBodyParams): Promise<Response> {
    return this.handleRequest(params, RequestMethod.Patch);
  }

  protected put(params: RequestWithBodyParams): Promise<Response> {
    return this.handleRequest(params, RequestMethod.Put);
  }

  protected delete(params: RequestParams): Promise<Response> {
    return this.handleRequest(params, RequestMethod.Delete);
  }
}
