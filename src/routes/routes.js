import React from 'react';
import { Route } from 'react-router-dom';
import { Events, Editions } from '../components';

const Routes = () => (
    <>
        <Route exact path="/" component={Events} />
        <Route path="/events" component={Events} />
        <Route path="/editions" component={Editions} />
    </>
)

export default Routes;