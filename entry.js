import React, {Component} from 'react';
import {render} from 'react-dom';
import {SortableContainer, SortableElement, arrayMove, SortableHandle} from 'react-sortable-hoc';
import Infinite from 'react-infinite';
import _ from 'lodash';
import 'whatwg-fetch';

const ELEMENT_HEIGHT = 100;

const insert = (arr, item, index) => {
    let _arr = _.cloneDeep(arr);
    _arr.splice(index, 0, item);
    return _arr;
}


const DragHandle = SortableHandle(() => <span className={'handle'}>&#8801;</span>);

class ShelfHeader extends Component {
    render() {
        const {info} = this.props;
        return (
            <div>{info.title}</div>
        );
    };
}

class Release extends Component {
    render() {
        const {info} = this.props;
        return (
            <div>
                <span>{info.basic_information.title}</span>
                <DragHandle/>
            </div>
        );
    };
}


const SortableItem = SortableElement(({height, value, kind}) => {
    return (
        <li style={{height}} className={kind === 'release' ? 'release' : 'shelf_header'}>
            {
                kind === 'release'
                ? (<Release info={value}/>)
                : (<ShelfHeader info={value}/>)

            }
        </li>
    )
});

const SortableList = SortableContainer(({items}) => {
    return (
        <Infinite
            elementHeight={ELEMENT_HEIGHT}
            useWindowAsScrollContainer>
                {items.map(({value, height, kind}, index) =>
                    <SortableItem
                        key={`item-${index}`}
                        index={index}
                        kind={kind}
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
        const {releases} = this.props;
        this.state = {
            items: _.map(releases, (release) => {
                return {
                    kind: 'release',
                    value: release,
                    height: ELEMENT_HEIGHT
                }
            })
        }
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        let {items} = this.state;

        this.setState({
            items: arrayMove(items, oldIndex, newIndex)
        });
    }

    onNewShelf = () => {
        let {items} = this.state;
        const newShelf = {
            kind: 'shelf',
            value: {
                editable: true,
                title: 'untitled shelf',
            },
            height: ELEMENT_HEIGHT
        };
        this.setState({
            items: insert(items, newShelf, 0)
        });

    }

    render() {
        let {items} = this.state;

        return (
            <div>
                <div className={'new_shelf_container'}>
                    <div className={'new_shelf'}
                         onClick={this.onNewShelf}>
                        Add New Shelf
                    </div>
                </div>
                <SortableList
                    items={items}
                    onSortEnd={this.onSortEnd}
                    useDragHandle={true}
                />
            </div>
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
