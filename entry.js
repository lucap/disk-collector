import React, {Component} from 'react';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import Infinite from 'react-infinite';
import _ from 'lodash';

const height = 20;

const SortableItem = SortableElement(({height, value}) => {
    return (
        <li style={{height}}>
            {value}
        </li>
    )
});

const SortableList = SortableContainer(({items}) => {
  return (
        <Infinite
      containerHeight={600}
      elementHeight={items.map(({height}) => height)}
    >
      {items.map(({value, height}, index) => <SortableItem key={`item-${index}`} index={index} value={value} height={height}/>)}
    </Infinite>
  );
});


class SortableComponent extends Component {
    state = {
        items: _.times(3300, (index) => {
            return {value: index, height: height}
        })
    }
    onSortEnd = ({oldIndex, newIndex}) => {
        let {items} = this.state;

        this.setState({
            items: arrayMove(items, oldIndex, newIndex)
        });
    };
    render() {
        let {items} = this.state;

        return (
            <SortableList items={items} onSortEnd={this.onSortEnd} />
        )
    }
}

render(<SortableComponent />, document.getElementById('root'));
