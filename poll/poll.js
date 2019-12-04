const fs = require('fs');

const moment = require('moment');

// App
const express = require('express');
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
// app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname+'/../htdocs'));


// Poll mailer
// const nodemailer = require('nodemailer');
// var mailer = nodemailer.createTransport('direct:?name=hostname');


app.post('/poll', (req, res) => {
	console.log("Poll");

    // Modes
    var modes = [];
    var m = {
    	'physical': 'Meet-ups in Basingstoke',
		'virtual': 'Virtual meetups and online events',
		'competitive': 'Competitive events and team challenges'
    };
    for (var code in m) {
	    if (!m.hasOwnProperty(code)) continue;
	    var mode = m[code];
    	if (req.body['mode-'+code]) {
    		modes.push(mode);
    	}
	}

    // Games
    var games = [];
    var g = {
    	'overwatch': "Overwatch League",
    	'fortnite': "Fortnite",
    	'leagueoflegends': "League of Legends",
    	'pubg': "PlayerUnknown's Battlegrounds",
    	'csgo': "Counter-Strike: GO",
    	'codblops': "Call of Duty: Black Ops",
    	'heroesofthestorm': "Heroes of the Storm",
    	'dota2': "DOTA 2",
    	'starcraft2': "Starcraft II",
    	'mtga': "Magic: The Gathering Arena",
    	'hearthstone': "Hearthstone",
    	'dnd': "Dungeons & Dragons"
    };

    for (var code in g) {
	    if (!g.hasOwnProperty(code)) continue;
	    var game = g[code];
    	if (req.body['game-'+code]) {
    		games.push(game);
    	}
	}
    var other = req.body['game-other'];
    if (other != "") {
    	games.push(other);
    }

    // Contact
    var contact = "No.";
    var email = req.body['contact-email'];
    if (email != "") {
    	contact = email;
    }


    var message = `
MODES
${modes.join("\n")}

GAMES
${games.join("\n")}

CONTACT
${contact}
`;

	// console.log(message);
    var date = moment().format('YYYY-MM-DD_HH-mm-ss');
    var mailfile = "mail/"+date+'.msg';
    fs.writeFile(mailfile, message, 'utf8', () => {
    	console.log("File", mailfile, "written.");
  		res.send('Result saved.');

    });
});


// Run
app.listen(3031, () => console.log(`[server] Listening on port 3031`));
