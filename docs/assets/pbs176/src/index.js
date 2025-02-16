// import our custom CSS
import './index.css';

// import bootstrap CSS & icon font
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// import specific Bootstrap JavaScript Modules (just Alert)
import { Alert } from 'bootstrap';

// import jQuery
import $ from 'jquery';

// import Luxon
import { DateTime } from 'luxon';

// import Mustache library & template
import Mustache from 'mustache';
import alertTpl from './templates/alert.html.mustache';

// import a nice handwriting web font
import "@fontsource/architects-daughter"

// a jQuery document ready handler
$(()=>{
    // update the greeting to show jQuery ran
    $('#world-modifier').text('jQuery');

    // build and add an alert with the loaded time
    const now = DateTime.now();
    const alertView = {
        localTime: now.toLocaleString(DateTime.TIME_SIMPLE),
        localDate: now.toLocaleString(DateTime.DATE_FULL)
    };
    const alertHTML = Mustache.render(alertTpl, alertView); // generate the alert HTML
    const $alert = $(alertHTML); // build a JQuery object from the HTML string
    const alertDOM = $alert[0]; // extract the underlying native DOM object from the jQuery object
    new Alert(alertDOM); // Apply the Bootstrap 5 Alert functionality to the DOM object
    $('.container').prepend($alert); // inject the alert into the top of the container
});