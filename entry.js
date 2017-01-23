import React, {Component} from 'react';
import {render} from 'react-dom';
import {
    SortableContainer,
    SortableElement,
    arrayMove,
    SortableHandle
} from 'react-sortable-hoc';
import Infinite from 'react-infinite';
import _ from 'lodash';
import 'whatwg-fetch';
import {RIEInput} from 'riek'

const ELEMENT_HEIGHT = 100;

const insert = (arr, item, index) => {
    let _arr = _.cloneDeep(arr);
    _arr.splice(index, 0, item);
    return _arr;
}

const joinNames = (info) => {
    return _.join(_.map(info, (item) => {
        return item.name;
    }), ', ')
}

const DragHandle = SortableHandle(
    () => <span className={'handle'}>&#8801;</span>
);

class ShelfHeader extends Component {

    handleOnEdit = ({title}) => {
        this.props.onEdit(title);
    }

    render() {
        const {
            info: {title, editable}
        } = this.props;

        return (
            <div className='shelf_title_container'>
                {
                    editable
                    ? (
                        <RIEInput
                            value={title}
                            change={this.handleOnEdit}
                            propName="title"
                            className='shelf_title'
                        />
                    )
                    :(<div className='shelf_title'>{title}</div>)
                }
            </div>
        );
    };
}

class Record extends Component {
    render() {
        const {
            info: {
                basic_information: {title, artists, formats, labels, year}
            }
        } = this.props;

        return (
            <div className={'record_info'}>
                <div>{title}</div>
                <div>{joinNames(artists)}</div>
                <div>
                    {joinNames(labels)}
                    &nbsp;&mdash;&nbsp;
                    {joinNames(formats)}
                    &nbsp;&mdash;&nbsp;
                    {year}
                </div>
                <DragHandle/>
            </div>
        );
    };
}


const SortableItem = SortableElement(({height, value, kind, onEditShelfName}) => {
    return (
        <li style={{height}} className={kind}>
            {
                kind === 'record'
                ? (<Record info={value}/>)
                : (
                    <ShelfHeader
                        info={value}
                        onEdit={onEditShelfName}
                    />
                )

            }
        </li>
    )
});

const SortableList = SortableContainer(({items, onEditShelfName}) => {
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
                        onEditShelfName={_.partial(onEditShelfName, index)}
                    />
                )}
        </Infinite>
    );
});


class App extends Component {
    constructor(props) {
        super(props);
        const {records} = this.props;
        const items = _.map(records, (record) => {
            return {
                kind: 'record',
                value: record,
                height: ELEMENT_HEIGHT
            }
        })

        const unShelfHeader = {
            kind: 'shelf',
            value: {
                editable: false,
                title: 'Unshelved Records',
            },
            height: ELEMENT_HEIGHT
        };

        this.state = {
            items: insert(items, unShelfHeader, 0)
        }
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        if (newIndex === 0) {
            // don't allow any records to be above the top shelf
            newIndex = 1;
        }

        const {items} = this.state;
        this.setState({
            items: arrayMove(items, oldIndex, newIndex)
        });
    }

    onEditShelfName = (index, new_title) => {
        const _items = _.cloneDeep(this.state.items);
        _items[index].value.title = new_title;
        this.setState({items: _items});
    }

    onNewShelf = () => {
        const {items} = this.state;

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
                    onEditShelfName={this.onEditShelfName}
                    useDragHandle={true}
                />
            </div>
        )
    };
}

const initializeApp = () => {
    let records = [];
    fetch('/test_data/page_1.json')
        .then((response) => {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +  response.status);
                return;
            }

            response.json().then((data) => {
                records = _.concat(records, data.releases);
                render(
                    <App records={records}/>,
                    document.getElementById('root')
                );
            })
        })
        .catch((err) => {
            console.log('Fetch Error :-S', err);
        })
}

initializeApp();
