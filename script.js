var callurl = "http://www.matapi.se/foodstuff?query=";
var restaurant_nutritions = [];
var description;
var colors = ["#a8dba8", "#cff09e", "#79bd9a", "#3b8686"];
var i = 0;


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
            console.log(data);
            description = data;
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
    var comment;

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
                                    var nutri_str = [];
                                    if (restaurant_nutritions.c > 50) {
                                        nutri_str.push("Kolhydrater");
                                    }
                                    if (restaurant_nutritions.k > 75) {
                                        nutri_str.push("Kalorier");
                                    }
                                    if (restaurant_nutritions.m > 2) {
                                        nutri_str.push("Magnesium");
                                    }
                                    if (restaurant_nutritions.p > 25) {
                                        nutri_str.push("Protein");
                                    }
                                    if (restaurant_nutritions.ca > 5) {
                                        nutri_str.push("Kalcium");
                                    }
                                    if (restaurant_nutritions.f > 100) {
                                        nutri_str.push("Fett");
                                    }
                                    console.log(nutri_str);

                                    if (loop_counter == j) {
                                        if (restaurant_name == 'Restaurang Niagara') {
                                            description.forEach(function(entry) {
                                                if (entry.name == 'Restaurang Niagara') {
                                                    comment = entry.description;
                                                }
                                            });
                                            buildDiv(restaurant_name, restaurant.Local.title, restaurant.Local.price, nutri_str, comment);
                                        } else if (restaurant_name == 'Mia Maria') {
                                            description.forEach(function(entry) {
                                                if (entry.name == 'Mia Maria') {
                                                    comment = entry.description;
                                                }
                                            });
                                            buildDiv(restaurant_name, restaurant.Kött.title, restaurant.Kött.price, nutri_str, comment);
                                        } else if (restaurant_name == 'Välfärden') {
                                            description.forEach(function(entry) {
                                                if (entry.name == 'Välfärden') {
                                                    comment = entry.description;
                                                }
                                            });
                                            buildDiv(restaurant_name, restaurant["1"].title, restaurant["1"].price, nutri_str, comment);
                                        } else if (restaurant_name == 'Lilla Köket') {
                                            description.forEach(function(entry) {
                                                if (entry.name == 'Lilla Köket') {
                                                    comment = entry.description;
                                                }
                                            });
                                            buildDiv(restaurant_name, restaurant["1"].title, restaurant["1"].price, nutri_str, comment);
                                        } else if (restaurant_name == 'La Bonne Vie') {
                                            description.forEach(function(entry) {
                                                if (entry.name == 'La Bonne Vie') {
                                                    comment = entry.description;
                                                }
                                            });
                                            buildDiv(restaurant_name, restaurant["Dagens rätt"].title, restaurant["Dagens rätt"].price, nutri_str, comment);
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
    if (price == undefined || price == "") {
        price = "0";
    }
    html = '<div id="' + i + '" class="row restaurant_row"><div class="col-sm-6"><h2>' + restaurant + '</h2>' +
        '<div><p class="col-sm-8">' + lunchtitle + '</p><p class="col-sm-4">Pris: ' + price.replace(/\D/g, '') + 'kr</p>' +
        '</div></div><div class="col-sm-3"><br><h4>Näring</h4><p>I den här rätten finns det mycket:</p><p>' + nutrient + '</p>' +
        '</div><div class="col-sm-3"><br><h4>Betyg</h4><p>Nått diagram</p><p>' + description + '</p></div></div>';
    var index = Math.floor(Math.random() * colors.length);
    $("#restaurant_info").append(html);
    $('#' + i).css("background-color", colors[index]);
    i++;
}


$(document).ready(function() {
    spanColors();


});
$(document).on('ready page:load', function() {
    spanColors();
});


function spanColors() {
    var span = $('.jumbotron');
    span.css('background-color', colors[0]);
    setInterval(function() {
        span.animate({
            "background-color": colors[0]
        }, 4000).animate({
            "background-color": colors[1]
        }, 4000).animate({
            "background-color": colors[2]
        }, 4000).animate({
            "background-color": colors[3]
        }, 4000);
    });
}
