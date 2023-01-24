import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import RepoPage from './RepoPage';

// on load get repos from backend then display content
export default function Home() {
  const [repos, setRepos] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [failCount, setFailCount] = useState(0);

  const [activeRepo, setActiveRepo] = useState();
  // const [languages, setLanuages] = useState();

  const maxFailures = 5;

  useEffect(() => {
    async function loadRepos() {
      setError(failCount > 0 ? `Error, Retrying...${failCount}` : '');
      setLoading(true);
      try {
        const response = await (
          await axios.get('http://localhost:4000/repos/')
        ).data;
        setRepos(() => response);
        setError('');
      } catch (err) {
        setFailCount((count) => count + 1);
        setError(() => err.message);
      }
      setLoading(false);
    }

    if (failCount < maxFailures) {
      loadRepos();
    }
  }, [failCount]);

  return (
    <div>
      <strong>Repositories for silverorange</strong>
      <br />
      {loading && 'loading'}
      {error}
      <br />
      {maxFailures === 3 && (
        <button onClick={() => setFailCount(0)}>Try Again</button>
      )}
      {repos && (
        <>
          {repos.map((repo) => {
            return (
              <div key={repo.id} style={{ display: 'block' }}>
                <button
                  onClick={() => setActiveRepo(repo)}
                >{`${repo.name} | ${repo.description} | ${repo.language} | ${repo.forks}`}</button>
              </div>
            );
          })}
        </>
      )}
      {activeRepo && <RepoPage repo={activeRepo} />}
    </div>
  );
}
