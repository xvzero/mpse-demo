import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import auth0Client from '../Auth';
import axios from 'axios';
import { server } from '../lib/constants';
import socketIOClient from '../SocketIO';

class NewProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      title: '',
      description: '',
      initial_bid: '',
      end_date: null
    };
  }

  updateValue = (field) => (e) => {
    this.setState({
      [field]: e.target.value,
    });
  }

  submit = async () => {
    this.setState({
      disabled: true,
    });

    try {
      let defaultEndDate = new Date();
      defaultEndDate.setDate(defaultEndDate.getDate() + 1);

      await axios.post(server, {
        title: this.state.title,
        description: this.state.description,
        initial_bid: this.state.initial_bid,
        end_date: this.state.end_date || defaultEndDate
      }, {
        headers: { 'Authorization': `Bearer ${auth0Client.getIdToken()}` }
      });
      
      this.props.history.push('/');
      socketIOClient.emit("CREATE_PROJECT")
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
        <div className="jumbotron col-12">
            <div className="card border-primary">
              <div className="card-header">New Project</div>
              <div className="card-body text-left">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Title:</label>
                  <input
                    disabled={this.state.disabled}
                    type="text"
                    onBlur={this.updateValue('title')}
                    className="form-control"
                    placeholder="Give your project a title."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Description:</label>
                  <input
                    disabled={this.state.disabled}
                    type="text"
                    onBlur={this.updateValue('description')}
                    className="form-control"
                    placeholder="Give more context to your project."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">End Date:</label>
                  <input
                    disabled={this.state.disabled}
                    type="datetime-local"
                    onChange={this.updateValue('end_date')}
                    className="form-control"
                    placeholder="Enter the date when bidding ends"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Starting Bid:</label>
                  <input
                    disabled={this.state.disabled}
                    type="number"
                    onBlur={this.updateValue('initial_bid')}
                    className="form-control"
                  />
                </div>
                <button
                  disabled={this.state.disabled}
                  className="btn btn-primary"
                  onClick={() => {this.submit()}}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(NewProject);
