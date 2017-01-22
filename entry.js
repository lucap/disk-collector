import React, {Component} from 'react';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove, SortableHandle} from 'react-sortable-hoc';
import Infinite from 'react-infinite';
import _ from 'lodash';
import 'whatwg-fetch';

const ELEMENT_HEIGHT = 100;

const DragHandle = SortableHandle(() => <span className={'handle'}>&#8801;</span>);

const SortableItem = SortableElement(({height, value}) => {
    return (
        <li style={{height}}>
            {value.basic_information.title}
            {
                value === false
                ? null
                : (<DragHandle />)
            }
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

    constructor(props) {
        super(props);
        console.log(props);
        const {releases} = this.props;
        this.state = {
            items: _.map(releases, (release) => {
                return {value: release, height: ELEMENT_HEIGHT}
            })
        }

    }

    onSortEnd = ({oldIndex, newIndex}) => {
        let {items} = this.state;

        this.setState({
            items: arrayMove(items, oldIndex, newIndex)
        });
    }

    render() {
        let {items} = this.state;

        return (
            <SortableList
                items={items}
                onSortEnd={this.onSortEnd}
                useDragHandle={true}
            />
        )
    };
}

const initializeApp = () => {
    let releases = [];
    fetch('/test_data/page_1.json')
        .then((response) => {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +  response.status);
                return;
            }

            response.json().then((data) => {
                console.log(data);
                releases = _.concat(releases, data.releases);
                render(
                    <App releases={releases}/>,
                    document.getElementById('root')
                );
            })
        })
        .catch((err) => {
            console.log('Fetch Error :-S', err);
        })
}

initializeApp();
