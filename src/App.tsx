import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Editor from './pages/Editor';
import { createNote } from './note/Note';


const App: React.FC = () => {

  return (
    <Router>
      <Switch>
        <Route path="/" exact >
          <Homepage />
        </Route>
        <Route path="/new" exact >
          <Editor data={ createNote("undefined") } />
        </Route>
      </Switch>
    </Router>
  );
};


export default App;
