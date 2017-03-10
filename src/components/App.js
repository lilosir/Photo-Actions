import React, { Component } from 'react';
import logo from '../images/logo.svg';
import '../styles/App.css';
import ActionBox from './ActionBox.js'
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';
import Dropzone from 'react-dropzone';
import update from 'react/lib/update';
import {connect} from 'react-redux';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      photoURL: null,
      appliedActions: [
        { id: 4, text: 'Scale'}
      ],
      availabledActions: [
        { id: 1, text: 'Rotate'},
        { id: 2, text: 'Translate'}, 
        { id: 3, text: 'Opacity'}
      ]
    };
    this.onDrop = this.onDrop.bind(this)
    this.onActionApplied = this.onActionApplied.bind(this)
    this.onActionAvailable = this.onActionAvailable.bind(this)
  }

  onDrop(files) {
    this.setState({
      photoURL: files[0]
    });
  }

  componentDidMount() {
    console.log("redux: ", this.props.properties)
  }

  onActionApplied(newState) {
    // console.log("onActionApplied", newState.cards)
  //   this.setState({
  //     availabledActions: newState.cards
  //   })
    this.setState(update(this.state, {
      appliedActions: {
        $set: newState.cards
      }
    }))
  }

  onActionAvailable(newState) {
    // console.log("onActionAvailable",newState.cards);
    // this.setState({
    //   availabledActions: newState.cards
    // })
    this.setState(update(this.state, {
      availabledActions: {
        $set: newState.cards
      }
    }))
  }

  checkState() {
    console.log(this.state.appliedActions)
  }

  render() {
    let photoStyle = this.state.appliedActions.reduce((acc, item)=> {
      // console.log("transform_str:",transform_str)
      if(item.text === "Rotate"){
        if(acc.transform){
          acc.transform += ' rotate(45deg)';
        } else {
          Object.assign(acc,
          {
            msTransform: 'rotate(45deg)', /* IE 9 */
            WebkitTransform: 'rotate(45deg)', /* Chrome, Safari, Opera */
            transform: 'rotate(45deg)'
          });
        }
      }
      if(item.text === "Opacity"){
        Object.assign(acc,
        {
          opacity: '0.5'
        });
      }
      if(item.text === "Scale"){
        if(acc.transform){
          acc.transform += ' scale(0.5)';
        } else {
          Object.assign(acc,
          {
            transform: 'scale(0.5)'
          });
        }
      }
      if(item.text === "Translate"){
        if(acc.transform){
          acc.transform += ' translateX(-40px)';
        } else {
          Object.assign(acc,
          {
            transform: 'translateX(-40px)'
          });
        }
      }

      return acc;
    }, {})

    // console.log("123",photoStyle)

    let PhotoArea = null;
    PhotoArea =  this.state.photoURL !== null ? 
      <img src={this.state.photoURL.preview} width="200" height="200" style={photoStyle} onChange={(e)=>this.handleImageChange(e).bind(this)}/> : 
      <h1> Select a photo </h1>
    return (
      <div className="container">
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
        </div>

        <div className="contents">
          <div className="col-md-4">
            <div className="photo">
              {PhotoArea}
            </div>
            <div className="select-photo">
              <Dropzone className="dropzone" ref="dropzone" onDrop={this.onDrop} >
                <a>Choose a image</a>
              </Dropzone>
              {/*<button className="btn btn-default" onClick={this.checkState.bind(this)}></button>*/}
            </div>
          </div>
          <div className="col-md-4">
            <div className="col-centered">
              <h1>Available Actions</h1>
              <ActionBox applyCallback={this.onActionAvailable} id={1} actionList={this.state.availabledActions}/>
            </div>
          </div>
          <div className="col-md-4">
            <div className="col-centered">
              <h1>Applied Actions</h1>
              <ActionBox applyCallback={this.onActionApplied} id={2} actionList={this.state.appliedActions}/>
            </div>
          </div>
        </div>
      </div>      
    );
  }
}

App = DragDropContext(HTML5Backend)(App);
export default connect(
  mapStateToProps,
  null
)(App);

function mapStateToProps(state) {
  return {
    properties: state
  }
}
