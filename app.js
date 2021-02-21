const fetch = require('node-fetch');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res){
  //do stuff here

  async function calcWinrate(username) {
    const response = await fetch('https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + username, {  
      headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36 Edg/88.0.705.68",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com",
            "X-Riot-Token": "RGAPI-5cbec32e-c3e3-42ea-9589-4df05c267de1"
        }
    })
    let x = await response.json().then(async function func(data) {
        const responseTwo = await fetch('https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/' + data.accountId + '?queue=420&queue=430&season=13&endIndex=20', {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36 Edg/88.0.705.68",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                "Origin": "https://developer.riotgames.com",
                "X-Riot-Token": "RGAPI-5cbec32e-c3e3-42ea-9589-4df05c267de1"
                // "encryptedAccountId" : data.accountId,
                // "queue" : [420, 430],
                // "season" : [13],
                // "endIndex" : 20
            }
        })
        let z = await responseTwo.json().then(async function func(data){
          var winCount = 0;
          var lossCount = 0;
          var winrate = 0;
          var times = 0;
          async function getMatch(matchId, championId) {
            const responseThree = await fetch('https://na1.api.riotgames.com/lol/match/v4/matches/' + matchId, {
              headers: {
                  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36 Edg/88.0.705.68",
                  "Accept-Language": "en-US,en;q=0.9",
                  "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
                  "Origin": "https://developer.riotgames.com",
                  "X-Riot-Token": "RGAPI-5cbec32e-c3e3-42ea-9589-4df05c267de1"
              }
            })
            let y = await responseThree.json().then(data => {
              //res.send(data);
              // Iterate through match participants, find the participant playing the given champion
              for (participantDto in data.participants) {
                if (participantDto.championId == championId) {
                  if (participantDto.timeline.csDiffPerMinDeltas['10-20']
                    + participantDto.timeline.csDiffPerMinDeltas['0-10'] > 0) {
                      // Won
                      winCount++;
                  }
                  else {
                    lossCount++;
                  }
                }
              }
            });
          }
          function sleep(milliseconds) {
            const date = Date.now();
            let currentDate = null;
            do {
              currentDate = Date.now();
            } while (currentDate - date < milliseconds);
          }
          for (match in data.matches) {
            sleep(500);
            res.send(match);
            getMatch(match.gameId, match.champion);
          }
          winrate = winCount / (winCount + lossCount);
          //res.send(winCount + ", " + lossCount + ", " + winrate + ', ' + times);
        })
      });
    }
  calcWinrate('ChungMoney12');

  //res.send('hello world');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});


module.exports = app;
