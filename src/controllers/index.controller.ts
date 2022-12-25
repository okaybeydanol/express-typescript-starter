import { NextFunction, Request, Response } from 'express';

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({});
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const IndexController = {
  index,
};

export default IndexController;
