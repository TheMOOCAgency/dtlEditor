import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GridUser from './GridUser';
import * as serviceWorker from './serviceWorker';


    ReactDOM.render(
        <div id='wrapper'>
            <GridUser 
                cultureDigital={window.props.usersinfo}
                dtl={window.props.dtlinfo}
                struct_org={window.props.structinfos} />
        </div>
        , document.getElementById('root'));

serviceWorker.unregister();
