import express, { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { AppError } from '../models/AppError';
import { debug } from 'console';
export const repos = Router();

//I'm not sure if express.static caches content on first load
repos.use(express.static('data'));

repos.get('/', async (req: Request, res: Response, next: NextFunction) => {
  res.header('Cache-Control', 'no-store');

  res.status(200);
  try {
    const remoteRepos: [] = await getRepos(
      'https://api.github.com/users/silverorange/repos'
    );
    const localRepos: [] = await getRepos(
      'http://localhost:4000/repos/repos.json'
    );
    const filteredCollection = processRepos([...remoteRepos, ...localRepos]);

    res.json(filteredCollection);
  } catch (error: any) {
    next(error);
  }
});

async function getRepos(path: string) {
  debug(`Making request to ${path}`);
  try {
    return await (
      await axios.get(path)
    ).data;
  } catch (error: any) {
    throw new AppError(
      `Failed to retrieve repos from '${path}'`,
      error?.response?.status ?? 500
    );
  }
}

/**
 *
 * @param {Array} repoCollection array of repos
 * @returns array of repos excluding forked repositories
 */
function processRepos(repoCollection: []) {
  return repoCollection.filter(
    (repo: { fork: boolean }) => repo.fork === false
  );
}
