import { Router, Request, Response } from 'express';
import dataRepos from '../../data/repos.json'; //only read on server start
export const repos = Router();

//I've never used Typescript before and couldn't get it to work quickly

repos.get('/', async (req, res) => {
  res.header('Cache-Control', 'no-store');

  res.status(200);

  /**
   * make call for local and remote repositories
   * combine arrays and filter
   * return as json response
   */

  // const remoteRepos = getGithubRepos();
  const localRepos = getServerRepos();
  console.log(localRepos);
  const filteredCollection = processRepos(localRepos);

  res.json(filteredCollection);
});

// Access remote repositories from github api
function getGithubRepos() {
  // make call to github api
  return [];
}

// Access local repositories from data
function getServerRepos() {
  return dataRepos; // 🚧 This needs to be replaced with a call
}

//aggregate and filter repos
function processRepos(repoCollection) {
  return repoCollection.filter((repo) => repo.fork === false);
}
