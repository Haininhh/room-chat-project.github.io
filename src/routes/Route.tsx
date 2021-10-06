import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "../features/dashboard/Dashboard";
import ForgotPassword from "../features/forgotPassword/ForgotPassword";
import Login from "../features/login/Login";
import Signup from "../features/signup/Signup";
import SignupSuccess from "../features/signup/SignupSuccess";

const routes = (
  <div className="App">
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/forgot-psrd" component={ForgotPassword} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/signup-success" component={SignupSuccess} />
      </Switch>
    </Router>
  </div>
);

export default routes;
