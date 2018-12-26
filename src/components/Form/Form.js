import React from 'react';
import './Form.css';

class Form extends React.Component {
  render() {
    return (
      <form className="Form">
        <div className="Form__hours">
          <header style={{fontWeight: 700, fontSize: '1.5em', color: '#455358'}}>Hours</header>
          <input value={this.props.hours.startTime} onChange={(e) => this.props.handleStartTimeChange(e)} placeholder="Start Time"/>
          <input value={this.props.hours.endTime} onChange={(e) => this.props.handleEndTimeChange(e)} placeholder="End Time"/>
          <input value={this.props.hours.lunch} onChange={(e) => this.props.handleLunchChange(e)} placeholder="Lunch"/>
        </div>

        <div className="Form__items">
          <header style={{fontWeight: 700, fontSize: '1.5em', color: '#455358'}}>Items</header>
          { this.props.items }
        </div>

        <button onClick={this.props.handleSubmit} type="submit">Submit</button>
      </form>
    );
  }
}

export default Form;