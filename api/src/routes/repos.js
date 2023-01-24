import express, { Router, Request, Response } from 'express';
import axios from 'axios';
import { AppError } from '../models/AppError';
import { debug } from 'console';
export const repos = Router();

//I'm not sure if express.static caches content on first load
repos.use(express.static('data'));

repos.get('/', async (req, res, next) => {
  res.header('Cache-Control', 'no-store');

  res.status(200);

  try {
    const remoteRepos = await getRepos(
      'http://localhost:4000/repos/repos.json' // to prevent github api abuse
    );
    const localRepos = await getRepos('http://localhost:4000/repos/repos.json');
    const filteredCollection = processRepos([...remoteRepos, ...localRepos]);

    res.json(filteredCollection);
  } catch (error) {
    next(error);
  }
});

async function getRepos(path) {
  debug(`Making request to ${path}`);
  try {
    return await (
      await axios.get(path)
    ).data;
  } catch (error) {
    throw new AppError(
      `Failed to retrieve repos from '${path}'`,
      // axios errors status path
      error?.response?.status ?? 500
    );
  }
}

/**
 *
 * @param {Array} repoCollection array of repos
 * @returns array of repos excluding forked repositories
 */
function processRepos(repoCollection) {
  return repoCollection.filter((repo) => repo.fork === false);
}
