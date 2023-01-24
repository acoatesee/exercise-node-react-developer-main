import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// on load get repos from backend then display content
export default function Home() {
  const [repos, setRepos] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadRepos() {
    setError('');
    setLoading(true);
    try {
      const response = await (
        await axios.get('http://localhost:4000/repos/')
      ).data;
      setRepos(() => response);
    } catch (err) {
      setError(() => err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadRepos();
  }, []);
  return (
    <div>
      <strong>Repositories for silverorange</strong>
      <br />
      {loading && 'loading'}
      {error}
      <br />
      {repos && (
        <>
          {repos.map((repo) => {
            return (
              <div key={repo.id} style={{ display: 'block' }}>
                <Link
                  to={`/${repo.id}`}
                >{`${repo.name} | ${repo.description} | ${repo.language} | ${repo.forks}`}</Link>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
