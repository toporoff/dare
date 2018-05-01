import React from 'react';

import './UploadForm.css';

const uploadForm = (props) => {    
    return (
        <form onSubmit={props.onCheckFormSubmit} className='upload-form p-3 mx-auto mt-4' method='POST' encType="multipart/form-data">
            <h1 className='text-center'>DARE</h1>
            <div className='form-group row'>
                <label className='col-sm-4 col-form-label' htmlFor='key'>Private key</label>
                <div className='col-sm-8'>
                    <input name='key' className='form-control' id='key' />
                </div>
            </div>
            <div className='form-group row'>
                <label className='col-sm-4 col-form-label' htmlFor='file'>Select file</label>
                <div className='col-sm-8'>
                    <input name='file' type='file' className='form-control-file' id='file' />
                </div>
            </div>
            <button type="submit" className="btn btn-default w-100">Check</button>
        </form>
    );
};

export default uploadForm;