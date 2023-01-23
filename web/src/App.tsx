import React from 'react';
import { Routes, Route } from 'react-router';
import './App.css';
import Home from './components/Home';
import RepoPage from './components/RepoPage';

// Display a list of repositories.
//Include the repository name, description, language, and forks count in the list.

export function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/repo" element={<RepoPage />} />
      </Routes>
    </div>
  );
}
