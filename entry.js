import React, {Component} from 'react';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove, SortableHandle} from 'react-sortable-hoc';
import Infinite from 'react-infinite';
import _ from 'lodash';

const height = 20;
const DragHandle = SortableHandle(() => <span>===</span>);

const SortableItem = SortableElement(({height, value}) => {
    return (
        <li style={{height}}>
            <DragHandle />
            &nbsp;
            {value}
        </li>
    )
});

const SortableList = SortableContainer(({items}) => {
  return (
        <Infinite
      elementHeight={items.map(({height}) => height)}
      useWindowAsScrollContainer
    >
      {items.map(({value, height}, index) =>
        <SortableItem
            key={`item-${index}`}
            index={index}
            value={value}
            height={height}
        />)}
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
            <SortableList
                items={items}
                onSortEnd={this.onSortEnd}
                useDragHandle={true}

            />
        )
    }
}

render(<SortableComponent />, document.getElementById('root'));
