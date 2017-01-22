import React, {Component} from 'react';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove, SortableHandle} from 'react-sortable-hoc';
import Infinite from 'react-infinite';
import _ from 'lodash';

const ELEMENT_HEIGHT = 40;
const DragHandle = SortableHandle(() => <span>===</span>);

const SortableItem = SortableElement(({height, value}) => {
    return (
        <li style={{height}}>
            {
                value % 10 === 0
                ? null
                : (<DragHandle />)
            }
            &nbsp;
            {value}
        </li>
    )
});

const SortableList = SortableContainer(({items}) => {
    return (
        <Infinite
            elementHeight={ELEMENT_HEIGHT}
            useWindowAsScrollContainer>
                {items.map(({value, height}, index) =>
                    <SortableItem
                        key={`item-${index}`}
                        index={index}
                        value={value}
                        height={height}
                    />
                )}
        </Infinite>
    );
});


class App extends Component {
    state = {
        items: _.times(3300, (index) => {
            return {value: index, height: ELEMENT_HEIGHT}
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

render(<App/>, document.getElementById('root'));
