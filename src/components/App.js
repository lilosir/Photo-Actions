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
    };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(files) {
    this.setState({
      photoURL: files[0]
    });
  }

  applyStyles(properties) {
    // console.log("props: ", properties)
    let photoStyle = {};
    
    for(let key in properties){
      if(properties[key]) {
        if(key === "Rotate") {
          if(photoStyle.transform){
            photoStyle.transform += ' rotate(45deg)';
          } else {
            Object.assign(photoStyle,
            {
              transform: 'rotate(45deg)'
            });
          }
        }
        if(key === "Opacity") {
          Object.assign(photoStyle,
          {
            opacity: '0.5'
          });
        }
        if(key === "Scale") {
          if(photoStyle.transform){
            photoStyle.transform += ' scale(0.5)';
          } else {
            Object.assign(photoStyle,
            {
              transform: 'scale(0.5)'
            });
          }
        }
        if(key === "Translate") {
          if(photoStyle.transform){
            photoStyle.transform += ' translateX(-40px)';
          } else {
            Object.assign(photoStyle,
            {
              transform: 'translateX(-40px)'
            });
          }
        }
      }
    }
    return photoStyle;
  }

  getLists(availabledActions, appliedActions) {

    let applied = [];
    let available = [];
    let availableCount = 0;

    for(let key in availabledActions){
      if(availabledActions[key] === true){
        availableCount++;
     
        available = update(available, {
          $push: [{id: availableCount, text: key}]
        })
      }
    }

    for(let key in appliedActions){
      if(appliedActions[key] === true){
        availableCount++;
        applied = update(applied, {
          $push: [{id: availableCount, text: key}]
        })
      }
    }
    return {applied, available}
  }

  render() {
    
    let photoStyle = this.applyStyles(this.props.properties.appliedActions);
    let appliedList = this.getLists(this.props.properties.availabledActions,this.props.properties.appliedActions).applied;
    let availableList = this.getLists(this.props.properties.availabledActions,this.props.properties.appliedActions).available;

    let PhotoArea = null;
    PhotoArea =  this.state.photoURL !== null ? 
      <img src={this.state.photoURL.preview} width="200" height="200" style={photoStyle}/> : 
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
            </div>
          </div>
          <div className="col-md-4">
            <div className="col-centered">
              <h1>Available Actions</h1>
              <ActionBox ref='availabledActions' id={'availabledActions'} actionList={availableList}/>
            </div>
          </div>
          <div className="col-md-4">
            <div className="col-centered">
              <h1>Applied Actions</h1>
              <ActionBox id={"appliedActions"} actionList={appliedList}/>
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
  mapDispatchToProps
)(App);

function mapStateToProps(state) {
  return {
    properties: state
  }
}

function mapDispatchToProps(dispatch) {
  return {
    reset: ()=> {
      dispatch({type:'reset'})
    },
  }
}
