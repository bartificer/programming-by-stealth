// import our custom CSS
import './index.css';

// import bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// import jQuery
import $ from 'jquery';

// import Luxon
import { DateTime } from 'luxon';

// import Mustache library & template
import Mustache from 'mustache';
import alertTpl from './templates/alert.html.mustache';

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
    const alertHTML = Mustache.render(alertTpl, alertView);
    $('.container').prepend(alertHTML);
});