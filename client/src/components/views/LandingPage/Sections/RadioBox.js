import React from 'react';
import { Collapse, Radio } from 'antd';

const { Panel } = Collapse;

const price = [
    {
        "_id": 0,
        "name": "Any",
        "array": []
    },
    {
        "_id": 1,
        "name": "$0 to $499",
        "array": [0, 499]
    },
    {
        "_id": 2,
        "name": "$400 to $599",
        "array": [499, 599]
    },
    {
        "_id": 3,
        "name": "$600 to $699",
        "array": [600, 699]
    },
    {
        "_id": 4,
        "name": "$700 to $799",
        "array": [700, 799]
    },
    {
        "_id": 5,
        "name": "More than $800",
        "array": [800, 150000]
    },
]

const renderRadioBox = () => {
    price.map((value) => (
        <Radio key={value._id} value={`${value._id}`} >{value.name}</Radio>
    ))
}

function RadioBox() {
    return (
        <div>
            <Collapse defaultActiveKey={['0']} >
                <Panel header="price" key="1">
                    <Radio.Group onChange value>
                        
                        {renderRadioBox}

                    </Radio.Group>
                </Panel>
            </Collapse>
        </div>
    )
}

export default RadioBox
