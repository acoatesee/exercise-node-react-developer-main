import React from 'react';
// import { Routes, Route } from 'react-router';
import './App.css';
import Home from './components/Home';

// Display a list of repositories.
//Include the repository name, description, language, and forks count in the list.
// low on time not using routers
export function App() {
  return (
    <div className="App">
      <strong>Repository Explorer</strong>
      <Home />
      {/* <Routes> //
        <Route path="/" element={<Home />} />
        <Route path="/:repoID" element={<RepoPage />} />
      </Routes> */}
    </div>
  );
}
