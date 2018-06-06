const Handlebars = require('handlebars');
const fs = require('fs');
const _ = require('lodash');
const dateformat = require('dateformat');

fs.readFile('template.html', 'utf-8', function(err, templateSource) {
    if(err) {
        return console.log(err);
    }

	fs.readFile('data.json', 'utf-8', function(err, dataSource) {
	    if(err) {
	        return console.log(err);
	    }

	    // process the data to make it easier to format
		var data = JSON.parse(dataSource);
		// console.log(JSON.stringify(data, null, 4));
		_(data.games).each(function (game, code) { game.code = code; });
		_(data.venues).each(function (venue, code) { venue.code = code; });
		var showings = _(data.showings).map(function (showing) {
			showing.game = data.games[showing.game];
			showing.venue = data.venues[showing.venue];
			showing.dateVeryShort = dateformat(showing.date, "dS mmm");
			showing.dateShort = dateformat(showing.date, "dS mmmm yyyy");
			showing.dateLong = dateformat(showing.date, "dddd dS mmmm yyyy");
			showing.time = dateformat(showing.date, "h:MMtt").replace(":00", "");
			return showing;
		}).sortBy("date").value();

		var nextShowing = ((showings.length == 0) ? null : showings[0]);
		var templateData = {
			"nextShowing": nextShowing,
			"showings": showings,
			"games": data.games,
			"discord": data.discord,
		};
		// console.log(JSON.stringify(templateData, null, 4));

		// add some helper functions
		Handlebars.registerHelper("ifOverwatch", function(options) {
			if ((nextShowing === null && data.defaultGame == "overwatch") || nextShowing.game.code == "overwatch") {
				return options.fn(this);
			} else {
				return "";
			}
		});
		Handlebars.registerHelper("ifMultiple", function(options) {
			if (showings.length > 1) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		});

		// write the template
		var template = Handlebars.compile(templateSource);
		var result = template(templateData);

		fs.writeFile("../htdocs/index.html", result, function(err) {
		    if(err) {
		        return console.log(err);
		    }
			console.log("OK");
		});
	});
});
