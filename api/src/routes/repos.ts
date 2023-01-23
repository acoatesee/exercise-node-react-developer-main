import { Router, Request, Response } from 'express';
import localRepos from '../../data/repos.json'; //only read on server start

export const repos = Router();

repos.get('/', async (_: Request, res: Response) => {
  res.header('Cache-Control', 'no-store');

  res.status(200);

  /**
   * make call for local and remote repositories
   * combine arrays and filter
   * return as json response
   *
   */

  res.json([]);
});

// Access remote repositories from github api
function getGithubRepos() {
  // make call to github api
}

// Access local repositories from data
function getServerRepos() {
  return localRepos; // 🚧 This needs to be replaced with a call
}

//aggregate and filter repos
function processRepos(repoCollection) {
  //filter all forked repos
}
