const fs = require('fs');
const { exec } = require('child_process');
const Intl = require('C:/Users/USERNAME/AppData/Roaming/npm/node_modules/intl');

var o1 = {
	
	weekday: 'long',
	day: 'numeric',
	month: 'long',
	year: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	second: 'numeric'
}

n = 1

count = 0

restart = 0

remove_tracker = 0

tracker_delete = 0

stop = 0

end = 0

exec(`transmission-remote -a test${n}.torrent`, (err, stdout, stderr) => {})

var refreshId = setInterval(function(){

	exec('transmission-remote -l', (err, stdout, stderr) => {

		id      = parseInt(stdout.split("\n")[1].split(/\s+/)[1])
		percent = stdout.split("\n")[1].split(/\s+/)[2]
		d1      = stdout.split("\n")[1].split(/\s+/)[3]
		unit    = stdout.split("\n")[1].split(/\s+/)[4]
		d2      = stdout.split("\n")[1].split(/\s+/)[5]
		d3      = stdout.split("\n")[1].split(/\s+/)[6]
		status  = stdout.split("\n")[1].split(/\s+/)[10]

		if( end != 1 )
		console.log(stdout.split("\n")[1].split(/\s+/).splice(1,8).join(" | "),count)

		if( percent == "100%" && d2 == "Done" ){

			console.log("end! ...........")

			restart = 0

			remove_tracker = 0

			end = 1

			exec(`transmission-remote -t${id} --remove`, (err, stdout, stderr) => {})

			n++

			// exec(`transmission-remote -a test${n}.torrent`, (err, stdout, stderr) => {})

			clearInterval(refreshId)

		}

		if( d1 != "None" && tracker_delete == 0  && stop == 0 ) {

			console.log("stop! ...........")

			restart = count + 10

			stop = 1

			exec(`transmission-remote -t${id} --stop`, (err, stdout, stderr) => {})

		}

		if( restart == count && tracker_delete == 0 && stop == 1 ) {

			console.log("restart! ...........")

			remove_tracker = 1

			exec(`transmission-remote -t${id} --start`, (err, stdout, stderr) => {})
		
		}

		if( remove_tracker == 1 && d2 != "Unknown" && tracker_delete == 0 ) {

			console.log("remove! ...........")

			exec(`transmission-remote -t${id} --tracker-remove http://tracker.yggtracker.cc:8080`, (err, stdout, stderr) => {})

			remove_tracker = 0

			tracker_delete == 1
		}

	})

	count++

}, 500)
