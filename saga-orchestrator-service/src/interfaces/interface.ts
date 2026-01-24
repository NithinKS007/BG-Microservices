export interface IBaseController {
  handle(request: Request, response: Response): Promise<void>;
}

