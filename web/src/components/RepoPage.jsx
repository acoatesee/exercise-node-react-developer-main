import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function RepoPage({ repo }) {
  const [lastCommit, setLastCommit] = useState({});
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setReadme('');
    setLastCommit({});
    async function getReadme() {
      setLoading(true);
      setError('');
      try {
        const path = `https://raw.githubusercontent.com/${repo.full_name}/master/README.md`;
        const response = await axios.get(path);
        setReadme(response.data);
      } catch (err) {
        setError(() => `Failed to fetch ${repo.id} README.md`);
      }
      setLoading(false);
    }

    async function getLastCommit() {
      setLoading(true);
      setError('');
      try {
        const path = `https://api.github.com/repos/${repo.full_name}/commits`;
        const response = await axios.get(path);
        const commit = response.data[0]?.commit ?? {};
        setLastCommit({
          date: commit?.author?.date ?? 'unknown date',
          user: commit?.author?.name ?? 'unknown user',
          message: commit?.message ?? 'unknown message',
        });
      } catch (err) {
        setError(() => `Failed to fetch last commit`);
      }
      setLoading(false);
    }

    getReadme();
    getLastCommit();
  }, [repo]);

  return (
    <div>
      RepoPage <br />
      {loading && 'loading'}
      {error}
      <>
        <div>
          <strong>Last commit</strong>
          <p>{lastCommit.date}</p>
          <p>{lastCommit.user}</p>
          <p>{lastCommit.message}</p>
        </div>
      </>
      <br />
      <div>{readme}</div>
    </div>
  );
}
