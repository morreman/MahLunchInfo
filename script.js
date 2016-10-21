var callurl = "http://www.matapi.se/foodstuff?query=";
var restaurant_nutritions = [];
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

        loopit("Mia Maria", miamariaLunch, miamaria);
        loopit("Välfärden", valfardenLunch, valfarden);
        loopit("Lilla Köket", lillakoketLunch, lillakoket);
        loopit("La Bonne Vie", labonnevieLunch, labonnevie);
        loopit("Restaurang Niagara", niagaraLunch, niagara);
    });
});


function loopit(restaurant_name, ingridients, restaurant) {
    var hold = [];
    var carbs = 0;
    var kcal = 0;
    var magnesium = 0;
    var protein = 0;
    var calcium = 0;
    var fat = 0;
    var counter = 0;
    var loop_counter = 0;

    for (var i = 0; i < ingridients.length; i++) {
        if (ingridients[i] != undefined) {
            $.get(
                callurl + ingridients[i],
                function(ingridient) {
                    counter++;
                    if (ingridient[0] != undefined) {
                        hold.push(ingridient[0].number);
                    }
                    if (counter == i) {
                        for (var j = 0; j < hold.length; j++) {
                            $.get(
                                'http://www.matapi.se/foodstuff/' + hold[j],
                                function(nutritions) {
                                    loop_counter++;

                                    carbs += nutritions.nutrientValues.carbohydrates;
                                    console.log(restaurant_name + " carbs just nu:" + carbs);
                                    kcal += nutritions.nutrientValues.vitaminC;
                                    magnesium += nutritions.nutrientValues.magnesium;
                                    protein += nutritions.nutrientValues.protein;
                                    calcium += nutritions.nutrientValues.calcium;
                                    fat += nutritions.nutrientValues.fat;

                                    restaurant_nutritions = {
                                        c: carbs,
                                        k: kcal,
                                        m: magnesium,
                                        p: protein,
                                        ca: calcium,
                                        f: fat
                                    }

                                    if (loop_counter == j) {
                                        if (restaurant_name == 'Restaurang Niagara') {
                                            buildDiv(restaurant_name, restaurant.Local.title, restaurant.Local.price, restaurant_nutritions.c, description);
                                        } else if (restaurant_name == 'Mia Maria') {
                                            buildDiv(restaurant_name, restaurant.Kött.title, restaurant.Kött.price, restaurant_nutritions.c, description);
                                        } else if (restaurant_name == 'Välfärden' || restaurant_name == 'Lilla Köket') {
                                            buildDiv(restaurant_name, restaurant["1"].title, restaurant["1"].price, restaurant_nutritions.c, description);
                                        } else if (restaurant_name == 'La Bonne Vie') {
                                            buildDiv(restaurant_name, restaurant["Dagens rätt"].title, restaurant["Dagens rätt"].price, restaurant_nutritions.c, description);
                                        }
                                    }
                                }
                            )
                        }
                    }
                });
        }
    }
}

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
