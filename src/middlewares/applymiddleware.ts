import { Request, Response, NextFunction } from 'express';

// Async error handler middleware function
export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next); // Catch any errors and pass to Express's error handler
  };
};
