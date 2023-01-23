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

  const remoteRepos = await getGithubRepos();
  const localRepos = await getServerRepos();
  const filteredCollection = processRepos([...remoteRepos, ...localRepos]);

  res.json(filteredCollection);
});

/**
 * Access remote repositories from github api
 * @returns array of repos
 */
async function getGithubRepos() {
  const remoteRepos = await axios(
    'https://api.github.com/users/silverorange/repos'
  );
  return remoteRepos.data;
}

/**
 * Access local repositories from data
 * @returns array of repos
 */
async function getServerRepos() {
  const localRepos = await axios.get('http://localhost:4000/repos/repos.json');
  return localRepos.data;
}

/**
 *
 * @param {Array} repoCollection array of repos
 * @returns array of repos excluding forked repositories
 */
function processRepos(repoCollection) {
  return repoCollection.filter((repo) => repo.fork === false);
}
