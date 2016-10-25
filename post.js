function postUnicorn() {

    var data = {}; // Datan som skickas ska vara ett Javascript-objekt
    data.grade = $('#submit_form input[name=grade]').val();
    data.restaurant = $('#submit_form input[name=restaurant]').val();
    data.description = $('#submit_form textarea[name=description]').val();
    data.reportedBy = $('#submit_form input[name=reportedBy]').val();
    console.log(JSON.stringify(data));
    $.ajax({ // Här görs anropet till API:t.
        url: 'http://localhost:8080/',
        method: "POST",
        data: JSON.stringify(data),
        headers: {
            "Accept": "application/json"
        }
    }).done(function(result) {
        console.log('Lade till följande data:');
        console.log(JSON.stringify(data));
        $("#form_div").empty().append("<h1 class='text-center'>Tack för din medverkan.</h1>"
        + "<br><a href='index.html'><button class='button btn-warning backbutton center-block'>Tillbaka till lunchsidan</button></a>" );
    });
}
