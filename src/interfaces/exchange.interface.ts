import { Request, Response } from 'express';
import { Query, Send } from 'express-serve-static-core';

export interface TypedRequestBody<T> extends Request {
  body: T;
}

export interface TypedRequestQuery<T extends Query> extends Request {
  query: T;
}

export interface TypedRequest<T extends Query, U> extends Request {
  body: U;
  query: T;
}

export interface TypedResponse<T> extends Response {
  json: Send<{ data: T; message: string }, this>;
}
