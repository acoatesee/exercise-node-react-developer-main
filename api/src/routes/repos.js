import express, { Router, Request, Response } from 'express';
import axios from 'axios';
// import dataRepos from '../../data/repos.json'; //only read on server start
export const repos = Router();

//I'm not sure if express.static caches content on first load
repos.use(express.static('data'));

repos.get('/', async (req, res) => {
  res.header('Cache-Control', 'no-store');

  res.status(200);

  const remoteRepos = await getGithubRepos();
  const localRepos = await getServerRepos();

  if (remoteRepos.status !== 200) {
    res.status(remoteRepos.status);
    res.json({ message: remoteRepos.message });
  }
  if (localRepos.status !== 200) {
    res.status(localRepos.status);
    res.json({ message: localRepos.message });
  }

  const filteredCollection = processRepos([
    ...remoteRepos.data,
    ...localRepos.data,
  ]);

  res.json(filteredCollection);
});

/**
 * Access remote repositories from github api
 * @returns {status: "code", data: "request data", message: "response context"}
 */
async function getGithubRepos() {
  try {
    const remoteRepos = await axios(
      'https://api.github.com/users/silverorange/repos'
    );
    return {
      status: 200,
      data: remoteRepos.data,
      message: `Successfully retrieved github repos`,
    };
  } catch (error) {
    return {
      status: error.status,
      data: error.data,
      message: `Failed to retrieve repos from github`,
    };
  }
}

/**
 * Access local repositories from data
 * @returns {status: "code", data: "request data", message: "response context"}
 *
 */
async function getServerRepos() {
  try {
    const localRepos = await axios.get(
      'http://localhost:4000/repos/repos.json'
    );
    return {
      status: 200,
      data: localRepos.data,
      message: 'Successfully retrieved local repos',
    };
  } catch (error) {
    return {
      status: error.status,
      data: error.data,
      message: `Failed to retrieve repos from local server data`,
    };
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
