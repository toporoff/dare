import React from 'react';

import './UploadForm.css';

const uploadForm = (props) => {    
    return (
        <form onSubmit={props.onCheckFormSubmit} className='upload-form p-3 mx-auto mt-4' method='POST' enctype="multipart/form-data">
            <h1 className='text-center'>DARE</h1>
            <div className='form-group row'>
                <label className='col-sm-4 col-form-label' htmlFor='osSelector'>Select OS</label>
                <div className='col-sm-8'>
                    <select name='os' className='form-control' id='osSelector'>
                        <option value=''>Select OS</option>
                        <option value='windows'>Windows</option>
                        <option value='mac'>MacOS</option>
                        <option value='linux'>Linux</option>
                    </select>
                </div>
            </div>
            <div className='form-group row'>
                <label className='col-sm-4 col-form-label' htmlFor='browserSelector'>Select Browser</label>
                <div className='col-sm-8'>
                    <select name='browser' className='form-control' id='browserSelector'>
                        <option value=''>Select Browser</option>
                        <option value='chrome'>Chrome</option>
                        <option value='forefox'>Firefox</option>
                        <option value='safari'>Safari</option>
                        <option value='opera'>Opera</option>
                        <option value='ie'>IE</option>
                        <option value='edge'>Edge</option>
                    </select>
                </div>
            </div>
            <div className='form-group row'>
                <label className='col-sm-4 col-form-label' htmlFor='file'>Select file</label>
                <div className='col-sm-8'>
                    <input name='file' type='file' className='form-control-file' id='file' />
                </div>
            </div>
            <div className='form-group row'>
                <label className='col-sm-4 col-form-label' htmlFor='key'>Private key</label>
                <div className='col-sm-8'>
                    <input name='key' className='form-control' id='key' />
                </div>
            </div>
            <button type="submit" className="btn btn-default w-100">Check</button>
        </form>
    );
};

export default uploadForm;