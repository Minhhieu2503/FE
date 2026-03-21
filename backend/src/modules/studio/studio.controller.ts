import { Request, Response } from 'express';
import * as studioService from './studio.service';

export const getExploreStudios = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';

    const results = await studioService.searchStudiosService(page, limit, search);
    res.status(200).json(results);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error occurred while exploring studios' });
  }
};

export const getStudioDetailsAuthFree = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const details = await studioService.getStudioProfileData(id as string);
    res.status(200).json(details);
  } catch (error: any) {
    res.status(404).json({ message: error.message || 'Studio profile details could not be retrieved' });
  }
};
