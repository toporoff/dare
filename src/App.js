import React, { Component } from 'react';

import Layout from './hoc/Layout/Layout';
import UploadForm from './components/UploadForm/UploadForm';

class App extends Component {
    render() {
        return (
            <Layout>
                <UploadForm />
            </Layout>
        );
    }
}

export default App;
