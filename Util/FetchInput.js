
module.exports = function(){
    
    const EventEmitter = require('events');
    
    var status = new EventEmitter();
    var path = './Input/day';
    var year = '2021';

    var Day = function(dayNumber, forceFetch=false){
        // check if it already exists
        var dayString = dayNumber.toString().padStart(2, '0');
        var fullFilePath = path + dayString + '.txt';
        var fs = require('fs');

        if (forceFetch || !fs.existsSync(fullFilePath)) {
            LoadFromSite(dayNumber, fullFilePath);
        }
        else{
            fs.readFile(fullFilePath, (err, data) => {
                status.emit('loaded', err, data);
            });
        }
    }

    var FromFile = function(filepath){
        let fs = require('fs');

        fs.readFile(filepath, (err, data) => {
            status.emit('loaded', err, data);
        });
    }

    var LoadFromSite = function(dayNumber, fullFilePath){
        var https = require('https');
        var fs = require('fs');

        const options = {
            hostname: 'adventofcode.com',
            path: `/${year}/day/${dayNumber}/input`,
            method: 'GET',
            accept: 'text/html',
            headers: {
                'cookie': `session=${process.env.AOC_SESSION_ID}`
            }
        }

        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)

            res.on('data', d =>{
                fs.writeFile(fullFilePath, d, err =>{
                    if(err){
                        console.error(err);
                        status.emit('error', err);
                    }

                    fs.readFile(fullFilePath, (err, data) => {
                        status.emit('loaded', err, data);
                    });
                });
            })
        })

        
        req.on('error', err =>{
            console.error(err);
            status.emit('error', err);
        })
        
        req.end();
    }

    return {
        day: Day,
        fromFile: FromFile,
        status: status
    }
}