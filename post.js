var niagara_grade = 0;
var valfarden_grade = 0;
var miamaria_grade = 0;
var lillakoket_grade = 0;
var labonnevie_grade = 0;



function postUnicorn() {
    var e = document.getElementById("restaurant");
    var data = {};
    data.grade = $('#submit_form input[name=grade]').val();
    data.restaurant = e.options[e.selectedIndex].value;
    data.description = $('#submit_form textarea[name=description]').val();
    data.reportedBy = $('#submit_form input[name=reportedBy]').val();
    avarageGrade(data);
    console.log(JSON.stringify(data));
    $.ajax({
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

function goBack(){
  window.history.back();
}


function avarageGrade(data){
  if(data.restaurant == 'Restaurang Niagara'){
    niagara_grade += data.grade;
    return niagara_grade;
  } else if (data.restaurant == 'Lilla Köket') {
    lillakoket_grade += data.grade;
    return lillakoket_grade;
  }
}
