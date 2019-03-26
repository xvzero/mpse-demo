import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { server } from '../lib/constants';
import socketIOClient from '../SocketIO';
import TimeContainer from '../TimeContainer/TimeContainer';

class ProjectList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: null,
    };
  }
  
  componentDidMount() {
    this.updateProjects()
    socketIOClient.on("UPDATE_BID", this.updateProjects)
    socketIOClient.on("CREATE_PROJECT", this.updateProjects)
    socketIOClient.on("CLOSE_PROJECT", this.updateProjects)
  }

  updateProjects = async () => {
    try {
      const projects = await axios.get(server);
      this.setState({
        projects: projects.data,
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-4 col-lg-3" style={{ minWidth: 200, minHeight: 200 }}>
            <Link to="/new-project">
              <div className="card text-white bg-secondary mb-3">
                <div className="card-header">Need help? Try searching here!</div>
                <div className="card-body">
                  <h4 className="card-title">+ New Project</h4>
                  <p className="card-text">Let the community find you!</p>
                </div>
              </div>
            </Link>
          </div>
          {this.state.projects === null && <p>Loading projects...</p>}
          {
            this.state.projects && this.state.projects.map(project => (
              <div key={project.id} className="col-sm-12 col-md-4 col-lg-3">
                <Link to={`/project/${project.id}`}>
                  <div className="card text-white bg-success mb-3">
                  <div className="card-header" style={{
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: project.current_bid.amount || project.initial_bid ? 'space-between' : 'flex-end'
                  }}>
                    {project.current_bid.amount ?
                    <div style={{ display: "flex", alignItems: 'center' }}>
                      <div style={{marginLeft: 5 }}>{`$${project.current_bid.amount} -`}</div>
                      <img style={{ height: '2em', width: 'auto', marginLeft: 10 }} src={project.current_bid.author.avatar} alt="avatar"/>
                      <div style={{ marginLeft: 5 }}>{` ${project.current_bid.author.username}`}</div>
                    </div> : <div className="text-left">{project.initial_bid ? `Initial Bid: $${project.initial_bid}` : null}</div>
                    }
                    <div className="text-right">Bids: {project.bids}</div>
                  </div>
                    
                    <div className="card-body">
                      <h4 className="card-title">{project.title}</h4>
                      <p className="card-text">{project.description}</p>
                      <TimeContainer end_date={project.end_date} />
                    </div>
                  </div>
                </Link>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

export default Projects;
