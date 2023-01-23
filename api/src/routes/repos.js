import express, { Router, Request, Response } from 'express';
import axios from 'axios';
// import dataRepos from '../../data/repos.json'; //only read on server start
export const repos = Router();

//I'm not sure if express.static caches content on first load
repos.use(express.static('data'));

repos.get('/', async (req, res) => {
  res.header('Cache-Control', 'no-store');

  res.status(200);

  /**
   * make call for local and remote repositories
   * combine arrays and filter
   * return as json response
   */

  // const remoteRepos = getGithubRepos();
  const localRepos = await getServerRepos();
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
async function getServerRepos() {
  const localRepos = await axios.get('http://localhost:4000/repos/repos.json');
  return localRepos.data;
}

//aggregate and filter repos
function processRepos(repoCollection) {
  return repoCollection.filter((repo) => repo.fork === false);
}
