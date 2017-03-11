import React, { Component } from 'react';
import update from 'react/lib/update';
import { DropTarget } from 'react-dnd';
import Card from './Card';
import {connect} from 'react-redux';

// const style = {
//   textAlign: 'center',
//   width: 300,
// };

class ActionBox extends Component {
  constructor(props) {
    super( props );
    this.removeCard = this.removeCard.bind(this);
    this.pushCard = this.pushCard.bind(this);
    this.moveCard = this.moveCard.bind(this);
    this.state = { cards: props.actionList };
  }

  pushCard(card) {
    this.setState(update(this.state, {
      cards: {
        $push: [ card ]
      }
    }));
    this.props.pushCard(this.props.id, card.text);
  }
 
  removeCard(index) {
    this.setState(update(this.state, {
      cards: {
        $splice: [
          [index, 1]
        ]
      }
    }));
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];

    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      },
    }));
  }

  render() {
    const cards = this.state.cards;
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;
    const style = {
      width: "300px",
      height: "300px",
      border: '1px dashed gray'
    };
    const backgroundColor = isActive ? '#ff3333' : null;

    return connectDropTarget(
      <div style={{...style, backgroundColor}}>
        {cards.map((card, i) => (
          <Card
            key={card.id}
            index={i}
            id={card.id}
            card={card}
            listId={this.props.id}
            moveCard={this.moveCard}
            removeCard={this.removeCard}
            pushCard={this.pushCard}
          />
        ))}
      </div>
    );
  }
}

const cardTarget = {
  drop(props, monitor, component ) {
    const { id } = props;
    const sourceObj = monitor.getItem();    
    if ( id !== sourceObj.listId ) component.pushCard(sourceObj.card);
    return {
      listId: id
    };
  }
}

ActionBox = DropTarget("CARD", cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(ActionBox);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActionBox);

function mapStateToProps(state) {
  return {
    properties: state
  }
}

function mapDispatchToProps(dispatch) {
  return {
    pushCard: (id, text)=> {
      dispatch({type:'push', id: id, property: text})
    },
  }
}
