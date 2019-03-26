import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import auth0Client from '../Auth';

class SubmitBid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bid: '',
    };
  }

  updateBid = (e) => {
    this.setState({
      bid: e.target.value,
    });
  }

  submit = () => {
    const highestBid = parseFloat(this.props.highestBid);
    const currentBid = parseFloat(this.state.bid);

    if (!highestBid || highestBid > currentBid) {
      this.props.submitBid(currentBid);
      this.setState({
        bid: '',
        error: ''
      });
    } else {
      let error = 'Must input a valid amount';
      if (highestBid > currentBid) {
        error = 'Must bid lower than current bid';
      }
      this.setState({
        error
      });
    }
  }

  render() {
    if (!auth0Client.isAuthenticated()) return null;
    const { error } = this.state;
    return (
      <Fragment>
        <div className="text-left">
          <label htmlFor="exampleInputEmail1">Bid:</label>
          <input
            type="number"
            min={0}
            onChange={this.updateBid}
            className="form-control"
            placeholder="Place a bid!"
            value={this.state.bid}
            style={{
              border: error ? '2px solid orangered' : null,
              marginBottom: 0
            }}
          />
        </div>
        {error ? <div style={{ color: 'orangered', marginLeft: 5 }}>{error}</div> : null}
        <button
          className="btn btn-primary"
          onClick={this.submit}
          style={{ marginTop: 10 }}
        >
          Submit
        </button>
        <hr className="my-4" />
      </Fragment>
    )
  }
}

export default withRouter(SubmitBid);
