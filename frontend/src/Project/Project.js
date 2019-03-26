import React, {Component} from 'react';
import axios from 'axios';
import SubmitBid from './SubmitBid';
import auth0Client from '../Auth';
import { server } from '../lib/constants';
import socketIOClient from '../SocketIO';
import TimeContainer from '../TimeContainer/TimeContainer';

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: null,
    };

    this.submitBid = this.submitBid.bind(this);
  }

  componentDidMount() {
    this.refreshProject();
    socketIOClient.on("UPDATE_BID", this.refreshProject)
  }

  refreshProject = async () => {
    try {
      const { match: { params } } = this.props;
      const project = await axios.get(`${server}/${params.projectId}`);
      this.setState({
        project: project.data
      });
    } catch (err) {
      console.log(err)
    }
  }

  submitBid = async (amount) => {
    try {
      await axios.post(`${server}/bid/${this.state.project.id}`, {
        amount
      }, {
        headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }
      });
      socketIOClient.emit("UPDATE_BID");
      await this.refreshProject();
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { project } = this.state;
    if (project === null) return <p>Loading ...</p>;
    return (
      <div className="container">
        <div className="row">
          <div className="jumbotron col-12">
            <h1 className="display-7">{project.title}</h1>
            <p className="lead"><strong>Description: </strong>{project.description}</p>
            <p className="lead">
              <strong>Current Bid: </strong>
              {project.current_bid ? `$${project.current_bid}` : 'Seller did not put a starting price!'}
            </p>
            <TimeContainer showDay showTime end_date={project.end_date} />
            <hr className="my-4" />
            <SubmitBid projectId={project.id} highestBid={project.current_bid} submitBid={this.submitBid} />
            <p className="lead">Previous Bids:</p>
            {
              project.bids.sort((a, b) => a.amount - b.amount).map((bid, idx) => {
                const { amount, author: { username, avatar } } = bid;
                let highestBidHighlight = {};
                if (idx === 0) {
                  highestBidHighlight = { backgroundColor: 'lightgreen' };
                }
                return (
                  <div key={idx} style={{ display: "flex", alignItems: 'center', marginBottom: 10, ...highestBidHighlight }}>
                    <div style={{marginLeft: 5 }}>{`$${amount} -`}</div>
                    <img style={{ height: '2em', width: 'auto', marginLeft: 10 }} src={avatar} alt="avatar"/>
                    <div style={{ marginLeft: 5 }}>{` ${username}`}</div>
                    <div style={{ marginLeft: 10 }}>{idx === 0 ? '<- Current Bid!' : null}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Project;
