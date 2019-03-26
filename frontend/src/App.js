import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import auth0Client from './Auth';
import NavBar from './NavBar/NavBar';
import Project from './Project/Project';
import Projects from './Projects/Projects';
import NewProject from './NewProject/NewProject';
import SecuredRoute from './SecuredRoute/SecuredRoute';
import Callback from './Callback';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkingSession: true
    }
  }

  async componentDidMount() {
    if (this.props.location.pathname === '/callback') {
      this.setState({ checkingSession: false });
      return;
    }
    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== 'login_required') console.log(err.error);
    }
    this.setState({ checkingSession: false });
  }

  render() {
    return (
      <div>
        <NavBar/>
        <Route exact path='/' component={Projects}/>
        <Route exact path='/project/:projectId' component={Project}/>
        <Route exact path='/callback' component={Callback}/>
        <SecuredRoute path='/new-project'
                      component={NewProject}
                      checkingSession={this.state.checkingSession} />
      </div>
    );
  }
}

export default withRouter(App);
