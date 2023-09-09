import { writeFileSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';

const __dirname = new URL('.', import.meta.url).pathname;

function isWorkshop(talk) {
    if (!talk.track) return false;
    return talk.track.en === 'Workshop';
}

async function fetchMediaCCC() {
    let mediaCCCLink = "https://api.media.ccc.de/public/conferences/nixcon2023";
    let response = await fetch(mediaCCCLink);
    let data = await response.json();

    writeFileSync(join(__dirname, 'src/content/data/recordings.json'), JSON.stringify(data, null, 2));
}


async function fetchPretalx() {
    let pretalxUrl = 'https://talks.nixcon.org/api/events/nixcon-2023/talks/';
    let result = [];

    while(pretalxUrl) {
        let response = await fetch(pretalxUrl);
        let data = await response.json();
        pretalxUrl = data.next;
        result = result.concat(data.results);
    }

    let workshops = result.filter(talk => isWorkshop(talk));
    let talks = result.filter(talk => !isWorkshop(talk));

    writeFileSync(join(__dirname, 'src/content/schedule/talks.json'), JSON.stringify(talks, null, 2));
    writeFileSync(join(__dirname, 'src/content/schedule/workshops.json'), JSON.stringify(workshops, null, 2));
}

fetchPretalx();
fetchMediaCCC();