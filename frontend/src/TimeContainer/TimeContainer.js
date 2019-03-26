import React, {Component} from 'react'
import Countdown from 'react-countdown-now'

class TimeContainer extends Component {
  constructor(props) {
    super(props)
    let d = new Date(props.end_date)
      this.state = {
        day: d.getDay(),
        month: d.getMonth(),
        date: d.getDate(),
        year: d.getFullYear(),
        time: d.toLocaleTimeString()
      }
  }

  render() {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"]
    // const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return (
      <div>
        <p className='card-text' style={{ margin: 0 }}>
          {`End Date: ${this.props.showDay ? `${this.state.day},` : ''} ${months[this.state.month]} ${this.state.date}, ${this.state.year} ${this.props.showTime ? this.state.time : ''}`}
        </p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="card-text" style={{ marginRight: 10, wordBreak: 'keep-all' }}>Time Left: </div>
          <Countdown date={this.props.end_date}>
            <div className="card-text" style={{ fontWeight: 600, color: 'crimson' }}>{'Bidding is closed!'}</div>
          </Countdown>
        </div>
      </div>
    )
  }
}
export default TimeContainer