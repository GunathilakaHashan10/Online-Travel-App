import React, { useState } from 'react';
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const continents = [
    { key: 1, value: "Africa" },
    { key: 2, value: "Europe" },
    { key: 3, value: "Asia" },
    { key: 4, value: "North America" },
    { key: 5, value: "South America" },
    { key: 6, value: "Australia" },
    { key: 7, value: "Antarctica" },
]

function UploadProductPage(props) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [continentValue, setContinentValue] = useState(1);

    const [Images, setImages] = useState([]);

    const onTitleChange = (event) => {
        setTitle(event.currentTarget.value);
    }

    const onDescriptionChange = (event) => {
        setDescription(event.currentTarget.value);
    }

    const onPriceChange = (event) => {
        setPrice(event.currentTarget.value);
    }

    const continentsSelectChange = (event) => {
        setContinentValue(event.currentTarget.value);
    }

    const updateImages = (newImages) => {
        setImages(newImages);
    }

    const onSubmit = (event) => {
        event.preventDefault();

        if(!title || !description || !price || !Images || !continentValue) {
            return alert('Fill all the fields!');
        }

        const variables = {
            writer: props.user.userData._id,
            title: title,
            description: description,
            price: price,
            images: Images,
            continents: continentValue
        }

        Axios.post('/api/product/uploadProduct', variables)
            .then(response => {
                if(response.data.success) {
                    alert('Product Successfully Uploaded.');
                    props.history.push('/');
                } else {
                    alert('Failed to upload Product.')
                }
            })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title level={2}>Upload Travel Product</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <FileUpload refreshFunction={updateImages}/>
                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={title}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={description}
                />
                <br />
                <br />
                <label>Price($)</label>
                <Input
                    onChange={onPriceChange}
                    value={price}
                    type="number"
                />
                <select onChange={continentsSelectChange}>
                    {continents.map(item => (
                        <option key={item.key} value={item.key}>{item.value}</option>
                    ))}
                </select>
                <br />
                <br />

                <Button
                    onClick={onSubmit}
                >
                    Submit
                </Button>

            </Form>

        </div>
    )
}

export default UploadProductPage;
