import React from "react";
import LanguageSelector from "../components/LanguageSelector";
import UserSignupPage from '../pages/UserSignupPage';
import UserLoginPage from "../pages/UserLoginPage";
import HomePage from "../pages/HomePage";
import UserPage from '../pages/UserPage';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import TopBar from "../components/TopBar";
import { useSelector } from "react-redux";

const App = () => {
  const { isLoggedIn } = useSelector((store) => ({ isLoggedIn: store.isLoggedIn }))

  return (
    <div >
      <Router>
        <TopBar />
        <Switch>
          <Route exact path="/" component={HomePage} />
          {!isLoggedIn && <Route path="/login" component={UserLoginPage} />}
          <Route path="/signup" component={UserSignupPage} />
          <Route path="/user/:username" component={UserPage} />
          <Redirect to="/" />
        </Switch>
      </Router>
      <LanguageSelector />
    </div>
  );
}
export default App
