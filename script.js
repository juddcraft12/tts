let phonetics = ['aʊ','aɪ','b','d','dʒ','e','eɪ','f','g','h','i','j','k','l','m','n','o','oʊ','p','s','t','tʃ','u','v','w','z','æ','ð','ŋ','ɔ','ɔr','ɔɪ','ə','ɛ','ɛr','ʃ','ʊ','ʊr','ʒ','ʌ','ɚ','ɝ','ɪ','ɪr','ɹ','ɾ','θ','ɫ','ɑ','ɑr'];
let files = {};
let audio = [];

let overlap = 0.6;
let offset = 0;

let timeouts = [];

$(document).ready(function () {
	TextToIPA.loadDict('IPA.txt');
	getFiles();

	$('#run').on('click', function () {
		parse($('#input').val());
		play(audio);
	});

	$('#stop').on('click', function () {
		stop();
	});
});

function parse(str) {
	str = str.toLowerCase().replace(/[\-_]+/g, ' ').match(/[\w\s]/g).join('').replace(/\s+/g, ' ').split(' ').map(el => lookup(el)).join(' ');
	console.log(str);
	x = str;

	audio = [];
	for (let i in str) {
		if (str[i] === ' ') {
			audio.push(' ');
		} else if (i < str.length - 1 && file(str[i] + str[i + 1])) {
			audio.push(file(str[i] + str[i + 1]));
		} else if (file(str[i])) {
			audio.push(file(str[i]));
		}
	}
}

function play(arr) {
	let time = 0;
	timeouts = [];
	for (let i in arr) {
		if (arr[i].data) {
			timeouts.push(setTimeout(function () {
				arr[i].data.currentTime = 0;
				arr[i].data.play();
			}, time));
			// time += arr[i].duration*1000 - 180;
			time += arr[i].duration*1000*overlap - offset;
		} else {
			time += 400;
		}
	}
}

function stop() {
	for (let item of timeouts) {
		clearTimeout(item);
	}
	timeouts = [];
}

function lookup(str) {
	return TextToIPA._IPADict[str] || str;
}

function getFiles() {
	for (let item of phonetics) {
		files[item] = {data: new Audio(`audio/${item}.mp3`)};
		$(files[item].data).one('loadeddata', function () {
			let duration = $(this)[0].duration;
			files[item].duration = duration;
		})
	}
}

function file(str) {
	return files[str];
}