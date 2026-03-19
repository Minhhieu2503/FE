import { Request, Response, NextFunction } from 'express';

export const validateKycSubmission = (req: Request, res: Response, next: NextFunction): void => {
  const { portfolioURLs } = req.body;

  if (portfolioURLs !== undefined) {
    let parsedUrls;
    try {
      parsedUrls = typeof portfolioURLs === 'string' ? JSON.parse(portfolioURLs) : portfolioURLs;
      if (!Array.isArray(parsedUrls)) {
        throw new Error();
      }
      req.body.portfolioURLs = parsedUrls;
    } catch {
      res.status(400).json({ message: 'portfolioURLs must be a valid JSON array of strings.' });
      return;
    }
  }

  next();
};
