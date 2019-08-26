import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GridUser from './GridUser';
import * as serviceWorker from './serviceWorker';
import Papa from 'papaparse';

let truc;
let temporaryFetching = async function() {

    return await fetch('/data/culture_digital_export_masquee.csv')
        .then((response) => {
            return response.text()
        })
}
let getCsvData = async function () {

    let csvData = await temporaryFetching();
    Papa.parse(csvData, {
        complete: (result)=>{
            truc = result
        }
    });
}
getCsvData().then(()=>{
    ReactDOM.render(
        <div id='wrapper'>
            <GridUser cultureDigital={truc} />
        </div>
        , document.getElementById('root'));
})



serviceWorker.unregister();
