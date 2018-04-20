import React from 'react';

import './Layout.css';
import Aux from '../../hoc/Auxilenary/Auxilenary';

const layout = (props) => {
    return (
        <Aux>
            <main className='d-flex w-100 h-100'>
                {props.children}
            </main>
        </Aux>
    );
};

export default layout;