import React, { Component } from 'react';
import axios from 'axios';

import Layout from './hoc/Layout/Layout';
import UploadForm from './components/UI/UploadForm/UploadForm';

class App extends Component {
    onCheckFormSubmit = (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        axios.post('/api/add-storage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    };

    render() {
        return (
            <Layout>
                <UploadForm onCheckFormSubmit={this.onCheckFormSubmit} />
            </Layout>
        );
    }
}

export default App;
