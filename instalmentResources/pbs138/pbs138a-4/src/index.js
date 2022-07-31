// import our custom CSS
import './index.css';

// import bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// import jQuery
import $ from 'jquery';

// import Luxon
import { DateTime } from 'luxon'

// import Bootstrap's Alert plugin
import { Alert } from 'bootstrap'

// a jQuery document ready handler
$(()=>{
    // update the greeting to show jQuery ran
    $('#world-modifier').text('jQuery');

    // build and add an alert with the loaded time
    const $alert = $('<p>').addClass('alert alert-info alert-dismissible');
    $alert.text(`Page loaded at ${DateTime.now().toLocaleString()}`);
    $alert.append($('<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>'));
    new Alert($alert[0]);
    $('.container').append($alert);
});