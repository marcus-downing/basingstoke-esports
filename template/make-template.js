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

		var message = _.has(data, "message") ? data.message : null;
		
		var showings = _(data.showings).filter(function (showing) {
			var include = _.has(showing, "include") ? showing.include : true;
			return include;
		}).map(function (showing) {
			showing.game = data.games[showing.game];
			showing.venue = data.venues[showing.venue];
			showing.dateVeryShort = dateformat(showing.date, "dS mmm");
			showing.dateShort = dateformat(showing.date, "ddd dS mmm yyyy");
			showing.dateLong = dateformat(showing.date, "dddd dS mmmm yyyy");
			showing.time = dateformat(showing.date, "h:MMtt").replace(":00", "");
			showing.isNext = false;
			return showing;
		}).sortBy("date").value();

		// split into future and past
		var currentDate = dateformat("", "yyyy-mm-dd hh:MM");
		var showingsPartitioned = _.partition(showings, function (showing) {
			console.log("Comparing date: "+showing.date+" > "+ currentDate);
			return showing.date > currentDate;
		});
		var futureShowings = showingsPartitioned[0];
		var pastShowings = _.reverse(showingsPartitioned[1]).slice(0,9);

		var showSurvey = _.has(data, "showSurvey") ? data.showSurvey : false;

		var nextShowing = ((futureShowings.length == 0) ? null : futureShowings[0]);
		nextShowing.isNext = true;
		var templateData = {
			"message": message,
			"nextShowing": nextShowing,
			"showings": futureShowings,
			"pastShowings": pastShowings,
			"games": data.games,
			"showSurvey": showSurvey,
			"discord": data.discord,
			"nextVenue": nextShowing.venue,
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

		// write the RSS feed

		fs.readFile('rss-template.xml', 'utf-8', function (err, rssTemplateSource) {
			var rssTemplate = Handlebars.compile(rssTemplateSource);
			var rssResult = rssTemplate(templateData);
			fs.writeFile("../htdocs/feed.rss", rssResult, function (err) {
				if (err) {
		        return console.log(err);
				}
				console.log("RSS feed written");
			});
		});
	});
});
