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
  		res.send(`<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="fonts/Exo2-family.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/overwatch.css">
    <link rel="alternate" type="application/rss+xml" href="/feed.rss" />

    <title>Basingstoke Esports</title>
  </head>
  <body>

    <!-- main header -->
    <header id='header'>
        <div class='container'>
            <nav class="navbar">
                <div class='navbar-brand'>
                    <span class='d-block d-sm-inline'><b>&nbsp; BASINGSTOKE ESPORTS</b></span>
                </div>
            </nav>
        </div>
    </header>

    <main>
    <section id='about'>
        <div class='container'>
            <div class='box'>
                <h2>Results Saved</h2>
                <p>Your survey results have been saved. Thank you.</p>

                <a class="btn btn-primary btn-lg" href="/" role="button">Go back</a>
            </div>
        </div>
    </section>

    </main>

    <!-- main footer -->
    <footer id='footer'>
        <figure class="faded overlay-picture">
            <picture>
                <img src='images/overwatch/banner/ana-3840x1200.jpg' class='img-fluid'>
            </picture>
            <div class="overlay d-flex">

                <div class='container align-self-center'>
                    <div class='box'>
                        <h4 class='text-center d-none d-sm-block'>
                            BASINGSTOKE ESPORTS
                        </h4>
                        <p class='text-center'>
                            Organised by <a href='https://www.basingstokeanimesociety.com/' class="text-nowrap">Basingstoke Anime Society</a>
                        </p>
                    </div>
                </div>
            </div>
        </figure>
    </footer>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-117436530-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'UA-117436530-1');
    </script>

  </body>
</html>

            `);

    });
});


// Run
app.listen(3031, () => console.log(`[server] Listening on port 3031`));
