var callurl = "http://www.matapi.se/foodstuff?query=";
var niagaraNumbers = [];
var labonnevieNumbers = [];
var miamariaNumbers = [];
var valfardenNumbers = [];
var lillakoketNumbers = [];
var hold = [];
var description;


function deleteUnicorn(unicorn) {
    return function() {
        $.ajax({
            method: "DELETE",
            url: 'http://localhost:8080' + unicorn
        });
    }
}

function putUnicorn(unicorn) {
    return function() {
        var data = {}; // Datan som skickas ska vara ett Javascript-objekt
        data.id = $('#existingUnicorn input[name=id]').val(); // Glöm inte id-numret!
        data.name = $('#existingUnicorn input[name=name]').val();
        data.description = $('#existingUnicorn textarea[name=description]').val();
        data.reportedBy = $('#existingUnicorn input[name=reportedBy]').val();
        data.spottedWhere = {};
        data.spottedWhere.name = $('#existingUnicorn input[name="spottedWhere.name"]').val();
        data.spottedWhere.lat = $('#existingUnicorn input[name="spottedWhere.lat"]').val();
        data.spottedWhere.lon = $('#existingUnicorn input[name="spottedWhere.lon"]').val();
        /*
         * Eftersom datumväljaren inte lägger till någon tid, får vi göra det på
         * egen hand, men bara om vi verkligen behöver det.
         */
        data.spottedWhen = $('#existingUnicorn input[name=spottedWhen]').val();
        if (data.spottedWhen.length == 10) {
            data.spottedWhen += ' 00:00:00';
        }
        data.image = $('#existingUnicorn input[name=image]').val();

        $.ajax({ // Här görs anropet till API:t.
                method: "PUT", // Vi använder PUT här, inte POST
                // Här behöver vi specificera vilken enhörning som ska uppdateras
                url: 'http://localhost:8080' + data.id,
                data: JSON.stringify(data),
                headers: {
                    "Accept": "application/json"
                }
            })
            .done(function(result) {
                /*
                 * Vi lägger till de här utskrifterna för att se vad vi skickat upp. I
                 * nästa steg tar vi bort dem igen.
                 */
                console.log('Uppdaterade till följande data:');
                console.log(JSON.stringify(data));
            });
    }
}



function postUnicorn() {
    return function() {
        var data = {}; // Datan som skickas ska vara ett Javascript-objekt
        data.name = $('#newUnicorn input[name=name]').val();
        data.description = $('#newUnicorn textarea[name=description]').val();
        data.reportedBy = $('#newUnicorn input[name=reportedBy]').val();
        data.spottedWhere = {};
        data.spottedWhere.name = $('#newUnicorn input[name="spottedWhere.name"]').val();
        data.spottedWhere.lat = $('#newUnicorn input[name="spottedWhere.lat"]').val();
        data.spottedWhere.lon = $('#newUnicorn input[name="spottedWhere.lon"]').val();
        /*
         * Eftersom datumväljaren inte lägger till någon tid, får vi göra det på
         * egen hand, men bara om vi verkligen behöver det.
         */
        data.spottedWhen = $('#existingUnicorn input[name=spottedWhen]').val();
        if (data.spottedWhen.length == 10) {
            data.spottedWhen += ' 00:00:00';
        }
        data.image = $('#newUnicorn input[name=image]').val();

        $.ajax({ // Här görs anropet till API:t.
                method: "POST",
                url: 'http://localhost:8080',
                data: JSON.stringify(data),
                headers: {
                    "Accept": "application/json"
                }
            })
            .done(function(result) {
                /*
                 * Vi lägger till de här utskrifterna för att se vad vi skickat upp. I
                 * nästa steg tar vi bort dem igen.
                 */
                console.log('Lade till följande data:');
                console.log(JSON.stringify(data));
            });
    }
}



function fetchAndUpdateInfo(details) {
    return function() {
        $.ajax({
                url: "http://localhost:8080",
                headers: {
                    "Accept": "application/json"
                }
            })
            .done(function(datain) {
                data = datain[0];

                date = new Date(data['spottedWhen'].date);
                sighting = 'Av: ' + data['reportedBy'] + ', ' +
                    date.toLocaleDateString() +
                    ' i ' + data['spottedWhere']['name'];

                $('#unicornName').text(data['name']);
                $('#unicornImage').html('<img src="' + data['image'] + '">');
                $('#unicornInfo').text(data['description']);
                $('#unicornSighting').text(sighting);

                $('form').hide();

                $('#existingUnicorn input[name=id]').val(data['id']);
                $('#existingUnicorn input[name=name]').val(data['name']);
                $('#existingUnicorn input[name=reportedBy]').val(data['reportedBy']);
                $('#existingUnicorn input[name="spottedWhere.name"]').val(data['spottedWhere']['name']);
                $('#existingUnicorn input[name="spottedWhere.lat"]').val(data['spottedWhere']['lat']);
                $('#existingUnicorn input[name="spottedWhere.lon"]').val(data['spottedWhere']['lon']);
                $('#existingUnicorn input[name=spottedWhen]').val(date.toLocaleString());
                $('#existingUnicorn input[name=image]').val(data['image']);
                $('#existingUnicorn [name=description]').val(data['description']);

                /*
                 * Om du har testat att klicka runt på enhörningarna i steg 11 och sedan
                 * klickat på knapparna, ser du att varje ny inladdning av en enhörning
                 * lägger till ett nytt anrop, så att det blir fler och fler anrop. Genom
                 * att släppa dem efterhand uppnår vi önskat resultat. Testa gärna.
                 */
                $('#addUnicorn').unbind('click');
                $('#updateUnicorn').unbind('click');
                $('#deleteUnicorn').unbind('click');

                $('#addUnicorn').click(hideFormsAndShowOne('#newUnicorn'));
                $('#updateUnicorn').click(hideFormsAndShowOne('#existingUnicorn'));
                $('#deleteUnicorn').click(deleteUnicorn(data['id']));
            });
    }
}

function hideFormsAndShowOne(formName) {
    return function() {
        $('form').hide();
        $(formName).show();
    }
}

$(document).ready(function() {

    $.ajax({
            url: "http://localhost:8080",
            headers: {
                "Accept": "application/json"
            }
        })
        .done(function(data) {
            list = $('.restaurant_row');
            for (i = 0; i < data.length; i++) {
                console.log(data[i]['description']);
                $('#review_info').append(data[i]['description'])
                description = data[i]['description'];
                    //  $('#restaurant_' + i).click(fetchAndUpdateInfo(data[i]['details']));
            }
        });

    $.ajax({
        url: "http://mahlunch.antontibblin.se/today",
        headers: {
            "Accept": "application/json"
        }
    }).done(function(data) {
        $.ajaxPrefilter(function(options) {
            if (options.crossDomain && jQuery.support.cors) {
                var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
                options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
            }
        });

        niagara = data["Restaurang Niagara"];
        niagaraLunch = niagara.Local.title.replace(/[^a-öA-Ö ]/gi, "").split(' ');
        niagaraLunch = short(niagaraLunch);

        miamaria = data["Mia Maria"];
        miamariaLunch = miamaria.Kött.title.replace(/[^a-öA-Ö ]/gi, "").split(' ');
        miamariaLunch = short(miamariaLunch);

        valfarden = data["Välfärden"];
        valfardenLunch = valfarden['1'].title.replace(/[^a-öA-Ö ]/gi, "").split(' ');
        valfardenLunch = short(valfardenLunch);

        lillakoket = data["Lilla Köket"];
        lillakoketLunch = lillakoket['1'].title.replace(/[^a-öA-Ö ]/gi, "").split(' ');
        lillakoketLunch = short(lillakoketLunch);

        labonnevie = data["La Bonne Vie"];
        labonnevieLunch = labonnevie['Dagens rätt'].title.replace(/[^a-öA-Ö ]/gi, "").split(' ');
        labonnevieLunch = short(labonnevieLunch);

        // Har ingen mat för tillfället.
        mhmatsalar = data["MH Matsalar"];

        var restaurants = [];
        var counter = 0;

        Array.prototype.push.apply(restaurants, [niagaraLunch, miamariaLunch, valfardenLunch, lillakoketLunch, labonnevieLunch]);

        for (var i = 0; i < restaurants.length; i++) {
            for (var j = 0; j < restaurants[i].length; j++) {
                if (restaurants[i][j] != undefined) {
                    if (restaurants[i][j].length > 3) {
                        console.log(restaurants[i][j]);
                        $.getJSON(
                            callurl + restaurants[i][j],
                            function(ingridient) {
                                if (ingridient[0] != undefined) {
                                    $.get(
                                        'http://www.matapi.se/foodstuff/' + ingridient[0].number,
                                        function(nutrition) {
                                            counter++;
                                            if (counter == 1) {
                                                console.log(nutrition);
                                                buildDiv("Restaurang Niagara", niagara.Local.title, niagara.Local.price, nutrition.nutrientValues.carbohydrates, description);
                                            } else if (counter == 2) {
                                                buildDiv("Mia Maria", miamaria.Kött.title, miamaria.Kött.price. nutrition.nutrientValues.carbohydrates);
                                                console.log(nutrition);
                                            } else if (counter == 3) {
                                                buildDiv("Välfärden", valfarden["1"].title, valfarden["1"].price, nutrition.nutrientValues.carbohydrates);
                                                console.log(nutrition);
                                            } else if (counter == 4) {
                                                buildDiv("Lilla Köket", lillakoket["1"].title, lillakoket["1"].price, nutrition.nutrientValues.carbohydrates);
                                                console.log(nutrition);
                                            } else if (counter == 5) {
                                                buildDiv("La Bonne Vie", labonnevie["Dagens rätt"].title, labonnevie["Dagens rätt"].price, nutrition.nutrientValues.carbohydrates);
                                                console.log(nutrition);
                                            } else if (counter == 6) {
                                                buildDiv("MH Matsalar", "Just nu serverar inte MH Matsalar någon mat.", 0);
                                            }
                                        });
                                    //foodItems.push(response[0].number);
                                }
                            });
                    }
                }
            }
        }
    });
});


// function loop_restaurant(restaurant_ingridients) {
//     var foodItems = [];
//     var food_obj = {};
//
//     $.ajaxPrefilter(function(options) {
//         if (options.crossDomain && jQuery.support.cors) {
//             var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
//             options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
//         }
//     });
//
//     for (var i = 0; i < restaurant_ingridients.length; i++) {
//         if (restaurant_ingridients[i] != undefined) {
//             if (restaurant_ingridients[i].length > 3) {
//                 $.getJSON(
//                     callurl + restaurant_ingridients[i],
//                     function(ingridient) {
//                         if (ingridient[0] != undefined) {
//                             $.get(
//                                 'http://www.matapi.se/foodstuff/' + ingridient[0].number,
//                                 function(nutrition) {
//                                     food_obj = nutrition;
//                                     return food_obj;
//                                 });
//                             //foodItems.push(response[0].number);
//                         }
//                     });
//             }
//         }
//     }
//     //return foodItems;
// }

function short(words) {
    var longwords = [];
    for (var i = 0; i < words.length; i++) {
        if (words[i].length > 3) {
            longwords.push(words[i]);
        }
    }
    return longwords;
}


function buildDiv(restaurant, lunchtitle, price, nutrient, description) {
    html = '<div class="row"><div class="col-sm-6"><h2>' + restaurant + '</h2>' +
        '<div><p class="col-sm-8">' + lunchtitle + '</p><p class="col-sm-4">' + price + ' Carbs -' + nutrient + ' Comment-' + description + '</p>' +
        '</div></div><div class="col-sm-3"><p>Järn 100%</p><p>Kalcium 20%</p><p>Magnesium >0%</p>' +
        '</div><div class="col-sm-3"><p>Nått diagram</p><p>Senast jag åt här var det gott!</p></div></div>';
    $("#restaurant_info").append(html);
}
