import React, { Component } from 'react';

import './Layout.css';
import Aux from '../../hoc/Auxilenary/Auxilenary';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({ showSideDrawer: false });
    }

    sideDrawerToggleHandler = () => {
        this.setState((prevState) => {
            return { showSideDrawer: !prevState.showSideDrawer }
        });
    }

    render() {
        return (
            <Aux>
                <main className='d-flex w-100 h-100'>
                    {this.props.children}
                </main>
            </Aux>
        );
    }
};

export default Layout;