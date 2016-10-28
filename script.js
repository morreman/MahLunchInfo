var callurl = "http://www.matapi.se/foodstuff?query=";
var restaurant_nutritions = [];
var description;
var colors = ["#a8dba8", "#cff09e", "#79bd9a", "#3b8686"];
var i = 0;



function deleteRecension(unicorn) {
    return function() {
        $.ajax({
            method: "DELETE",
            url: 'http://localhost:8080' + unicorn
        });
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
            // console.log(data);
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


        loopit("Välfärden", valfardenLunch, valfarden);
        loopit("Lilla Köket", lillakoketLunch, lillakoket);
        loopit("La Bonne Vie", labonnevieLunch, labonnevie);
        loopit("Mia Maria", miamariaLunch, miamaria);
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
    var recension = {};

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

                                    if (loop_counter == j) {
                                      var refined_nutrient_string = "";
                                      for (var i = 0; i < nutri_str.length; i++) {
                                          refined_nutrient_string += nutri_str[i] + " | ";
                                      }

                                        if (restaurant_name == 'Restaurang Niagara') {
                                            description.forEach(function(entry) {
                                                if (entry.restaurant == 'Restaurang Niagara') {
                                                    recension = {
                                                        description: entry.description,
                                                        grade: entry.grade,
                                                        reportedBy: entry.reportedBy
                                                    };
                                                }
                                            });
                                            buildDiv(restaurant_name, restaurant.Local.title, restaurant.Local.price, refined_nutrient_string, recension);
                                        } else if (restaurant_name == 'Mia Maria') {
                                            description.forEach(function(entry) {
                                                if (entry.restaurant == 'Mia Maria') {
                                                    recension = {
                                                        description: entry.description,
                                                        grade: entry.grade,
                                                        reportedBy: entry.reportedBy
                                                    };
                                                }
                                            });
                                            buildDiv(restaurant_name, restaurant.Kött.title, restaurant.Kött.price, refined_nutrient_string, recension);
                                        } else if (restaurant_name == 'Välfärden') {
                                            description.forEach(function(entry) {
                                              console.log(description);
                                                if (entry.restaurant == 'Välfärden') {
                                                    recension = {
                                                        description: entry.description,
                                                        grade: entry.grade,
                                                        reportedBy: entry.reportedBy
                                                    };
                                                }
                                            });
                                            buildDiv(restaurant_name, restaurant["1"].title, restaurant["1"].price, refined_nutrient_string, recension);
                                        } else if (restaurant_name == 'Lilla Köket') {
                                            description.forEach(function(entry) {
                                                if (entry.restaurant == 'Lilla Köket') {
                                                    recension = {
                                                        description: entry.description,
                                                        grade: entry.grade,
                                                        reportedBy: entry.reportedBy
                                                    };
                                                }
                                            });
                                            buildDiv(restaurant_name, restaurant["1"].title, restaurant["1"].price, refined_nutrient_string, recension);
                                        } else if (restaurant_name == 'La Bonne Vie') {
                                            description.forEach(function(entry) {
                                                if (entry.restaurant == 'La Bonne Vie') {
                                                    recension = {
                                                        description: entry.description,
                                                        grade: entry.grade,
                                                        reportedBy: entry.reportedBy
                                                    };
                                                }
                                            });
                                            buildDiv(restaurant_name, restaurant["Dagens rätt"].title, restaurant["Dagens rätt"].price, refined_nutrient_string, recension);
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
    var av5 = " av 5";
    if (price == undefined || price == "") {
        price = "0";
    }
    if (description.grade == undefined || description.grade == "" &&
        description.reportedBy == undefined || description.reportedBy == "" &&
        description.description == undefined || description.description == "") {
        av5 = "";
        description.grade = "Okänt";
        description.reportedBy = "";
        description.description = "";
    }

    html = '<div id="' + i + '" class="row restaurant_row"><div class="col-sm-6"><h2>' + restaurant + '</h2>' +
        '<div class= "row"><p class="col-sm-8">' + lunchtitle + '</p><p class="col-sm-4"><b>Pris: ' + price.replace(/\D/g, '') + 'kr</b></p>' +
        '</div></div><div class="col-sm-3"><br><h4>Näring</h4><p>I den här rätten finns det mycket:</p><p><b>' + nutrient + '</b></p>' +
        '</div><div class="col-sm-3"><br><h4>Betyg ' + description.grade + av5 + '</h4><h5>Senaste recensionen: </h5><p>' + description.description + '</p>' +
        '<p>Postat av: ' + description.reportedBy + '</div></div>';
    var index = Math.floor(Math.random() * colors.length);
    $('#spinner').hide();
    $("#restaurant_info").append(html);
    $('#' + i).css("background-color", colors[index]);
    i++;
}

$(document).ready(function() {
    $("#spinner").append("<i class='fa fa-spinner fa-spin' style='font-size:200px'></i><h5 class='text-center'>Laddar in dagens menyer...</h5> ");
    spanColors();
});

$(document).on('ready page:load', function() {
    spanColors();
});

function spanColors() {
    var span = $('.jumbotron');
    var spin = $('.fa-spinner');
    span.css('background-color', colors[0]);
    spin.css('color', colors[3]);
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
    setInterval(function() {
        spin.animate({
            "color": colors[3]
        }, 4000).animate({
            "color": colors[2]
        }, 4000).animate({
            "color": colors[1]
        }, 4000).animate({
            "color": colors[0]
        }, 4000);
    });
}
