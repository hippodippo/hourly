import React, { Component } from 'react';
import '../../normalize.css';
import './App.css';
import Nav from '../Nav/Nav';
import routes from '../../routes';
// import Footer from '../Footer/Footer';
import Wrapper from '../Wrapper/Wrapper';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Nav />
        <Wrapper>
          { routes }
        </Wrapper>
      </div>
    );
  }
}

export default App;