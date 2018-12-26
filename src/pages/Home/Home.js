import React, { Component } from 'react';
import './Home.css';
import axios from 'axios';
import Form from '../../components/Form/Form';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      userID: '',
      hours: {
        lunch: '',
        startTime: '',
        endTime: '',
      },
      items: [{ item: '', price: '' }],
    }

    this.handleItemChange = this.handleItemChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.handleLunchChange = this.handleLunchChange.bind(this);
    this.handleStartTimeChange = this.handleStartTimeChange.bind(this)
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
  }

  componentDidMount() {
    axios.get('/auth/me')
    .then(res => {
      this.setState({
        userName: res.data.user_name,
        userID: res.data.id,
      });
    });
  }

  handleLunchChange(e) {
    let newHours = this.state.hours;
    newHours.lunch = e.target.value

    this.setState({
      hours: newHours
    });
  }

  handleStartTimeChange(e) {
    let newHours = this.state.hours;
    newHours.startTime = e.target.value

    this.setState({
      hours: newHours
    });
  }

  handleEndTimeChange(e) {
    let newHours = this.state.hours;
    newHours.endTime = e.target.value

    this.setState({
      hours: newHours
    });
  }

  handleItemChange(e) {
    let newItems = this.state.items;

    newItems[e.target.id]["item"] = e.target.value;
    this.setState({
      items: newItems
    });
  }

  handlePriceChange(e) {
    let newItems = this.state.items;

    newItems[e.target.id]["price"] = e.target.value;
    this.setState({
      items: newItems
    });
  }

  addItem() {
    let newItems = this.state.items;
    newItems.push({ item: '', price: '' });

    this.setState({
      items: newItems
    });
  }

  removeItem() {
    let newItems = this.state.items;
    newItems.pop();

    this.setState({
      items: newItems
    });
  }

  handleSubmit() {
    let { userID, userName, hours, items } = this.state,
        { startTime, endTime, lunch } = hours;

    axios.post('/api/createHours', { userID: userID, userName: userName, start_time: startTime, end_time: endTime, lunch: lunch, items: items });
    axios.post('/api/createItems', { userID: userID, userName: userName, items: items });

    this.setState({
      hours: {
        date: '',
        startTime: '',
        endTime: '',
      },
      items: [{ item: '', price: '' }],
    });
  }

  render() {
    let { userName } = this.state;

    var theItems = this.state.items.map((el, index, arr) =>
        <div key={index} className="Form__items__item">
          <input id={index} value={arr[index]["item"]} onChange={(e) => this.handleItemChange(e)} placeholder="Item" />
          <input id={index} value={arr[index]["price"]} onChange={(e) => this.handlePriceChange(e)} placeholder="Price" />
        </div>);

    return (
      <div className="Home">
        <h1>Howdy { userName ? userName : "Stranger" }</h1>
        <div style={{ marginRight: '60px' }}>
        <Form
         handleItemChange={this.handleItemChange}
         handlePriceChange={this.handlePriceChange}
         handleSubmit={this.handleSubmit}
         addItem={this.addItem}
         hours={this.state.hours}
         items={theItems}
         handleLunchChange={this.handleLunchChange}
         handleStartTimeChange={this.handleStartTimeChange}
         handleEndTimeChange={this.handleEndTimeChange}
        />
        </div>
        <button className="Home__NewItemBtn" onClick={this.addItem}>Add Item</button>
        <button className="Home__NewItemBtn" onClick={this.removeItem}>Remove Item</button>
      </div>
    );
  }
}

export default Home;