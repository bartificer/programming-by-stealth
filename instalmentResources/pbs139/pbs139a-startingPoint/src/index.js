// import our custom CSS
import './index.css';

// import bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// import jQuery
import $ from 'jquery';

// import Luxon
import { DateTime } from 'luxon'

// a jQuery document ready handler
$(()=>{
    // update the greeting to show jQuery ran
    $('#world-modifier').text('jQuery');

    // build and add an alert with the loaded time
    const $alert = $('<p>').addClass('alert alert-info alert-dismissible');
    $alert.text(`Page loaded at ${DateTime.now().toLocaleString()}`);
    $('.container').append($alert);
});