const FPS = 60;
const SCHEDULE_URL = "https://talks.nixcon.org/nixcon-2023/schedule/export/schedule.json";
const SPONSORS = {
  gold: [
    { image: "cachix.png", alt: "Cachix", url: "https://cachix.org" },
    {
      image: "flox.png",
      alt: "Flox",
      url: "https://floxdev.com",
      extraClasses: "px-10",
    },
    { image: "numtide.png", alt: "Numtide", url: "https://numtide.com" },
    {
      image: "flyingcircus.png",
      alt: "Flying Circus",
      url: "https://flyingcircus.io/",
    },
    { image: "tweag.png", alt: "Tweag", url: "https://tweag.io/" },
    { image: "anduril.png", alt: "Anduril", url: "https://www.anduril.com/" },
    {
      image: "detsys.svg",
      alt: "Determinate Systems",
      url: "https://determinate-systems.com/",
    },
  ],
  silver: [
    {
      image: "helsinki-systems.png",
      alt: "Helsinki Systems",
      url: "https://helsinki-systems.de/",
    },
    {
      image: "meetwise.png",
      alt: "meetwise",
      url: "https://meetwise.com/",
      extraClasses: "py-5",
    },
    { image: "google-os.png", alt: "Google", url: "https://google.com/" },
    {
      image: "wdz.png",
      alt: "WDZ",
      url: "https://wdz.de/",
      extraClasses: "px-5",
    },
    {
      image: "pdt-partners.jpg",
      alt: "PDT Partners",
      url: "https://pdtpartners.com/",
      extraClasses: "py-5",
    },
    {
      image: "worldquant.png",
      alt: "WorldQuant",
      url: "https://worldquant.com/",
      extraClasses: "py-5",
    },
    {
      image: "hercules-ci.png",
      alt: "Hercules CI",
      url: "https://hercules-ci.com/",
      extraClasses: "py-5",
    },
    {
      image: "garnix.png",
      alt: "garnix",
      url: "https://garnix.io",
    },
  ],
  bronze: [
    {
      image: "oin.jpg",
      alt: "Open Invention Network",
      url: "https://openinventionnetwork.com/",
    },
  ],
};

async function loadSchedule() {
	const response = await fetch(SCHEDULE_URL, {method:"GET"});
	const data = await response.json();

	const talks = data.schedule.conference.days.map((day) =>
		Object.keys(day.rooms).map((name) => {
			const room = day.rooms[name];
			return room
		})
	);

	const op = (a, b) => a.concat(b);
	
	return talks.reduce(op, []).reduce(op, []);
}


class Animator {
	constructor(canvas, video, width, height, animation) {
		this.canvas = canvas;
		this.video = video;
		this.width = width;
		this.height = height;
		this.animation = animation;
		this.stream = canvas.captureStream(0);
		this.recorder = new MediaRecorder(this.stream, {
		//	mimeType: 'video/mp4',
			audioBitsPerSecond: 0,
			videoBitsPerSecond: 1024 * 1024 * 5,
		});
		this.chunks = [];

		this.recorder.onstop = () => {
			console.log('recording stopped');
			var blob = new Blob(this.chunks, {'type': this.chunks[0].type});
			const size = this.chunks.reduce((a, blob) => a + blob.size, 0);
			console.log('Total size', size);
			this.chunks = [];
			var url = URL.createObjectURL(blob);
			this.video.src = url;
		};
		this.recorder.ondataavailable = (e)  => {
			console.log('recording data available', e.data.size, this.recorder.state)
			this.chunks.push(e.data);
		};
		this.recorder.error = (e) => {
			console.log('Recorder errored', e);
		};

		this.frameNumber = 0;
		this.resolvePromise = () => {};
	}

	run() {
		const t = this;
		return t.animation.prepare().then(() => {
			t.frameNumber = 0
			return new Promise((resolve, reject) => {
				t.resolvePromise = resolve;
				t.recorder.start(1000);
				t._run();
			});
		});
	}

	_run() {
		var remaining = 0;
		var result = false;
			const start = performance.now();

			result = this.draw();

			const end = performance.now();
			const elapsed = end - start;
			remaining = (1000 / FPS) - elapsed;

			if (result)
				return;
			if (remaining < 0) {
				console.log('Slow frame rate', elapsed);
			}

		setTimeout(() => { this._run() }, remaining);
	}

	draw() {
		this.frameNumber += 1;
		this._draw();

		if (this.stream.requestFrame)
			this.stream.requestFrame();
		else
			this.stream.getTracks().forEach((stream) => {
				if (stream.requestFrame) stream.requestFrame();
				else console.log('No requestFrame for stream', stream);
		});

		if (this.frameNumber > this.animation.duration * FPS) {
			console.log('Stopping recording');
			this.recorder.stop();
			this.resolvePromise();
			return true;
		}
		return false;
	}

	_draw(){
		const ctx = this.canvas.getContext('2d');
		ctx.globalCompositionOperation = "source-out";
		ctx.fillStyle = 'white';
		ctx.globalAlpha = 1;
		ctx.clearRect(0,0, this.width, this.height);

		this.animation.draw(ctx, this.frameNumber, this.width, this.height);
	}
}

class Animation {
	constructor(imagePath) {
		this.image = new Image();
		this.imagePath = imagePath;
		this.duration = 7;
		this.maxFrames = FPS * this.duration;
	}

	prepare() {
		var promise = new Promise((resolve, reject) => {
			this.image.onload = () => {
				resolve();
			};
			this.image.src = this.imagePath;
		})
		return promise;
	}

	draw(ctx, frameNumber, width, height) {
		const fadeProgressPct = frameNumber / (FPS * 3.5);
		const progressPct = frameNumber / this.maxFrames;
		
		ctx.fillStyle = 'white';
		ctx.globalAlpha = 1;
		ctx.fillRect(0, 0, width, height);

		ctx.globalAlpha = fadeProgressPct < 1 ? fadeProgressPct : 1;
		ctx.drawImage(this.image, 0, 0, width, height);
	}
}


class OutroAnimation {
	constructor(imagePath, licenseImagePath) {
		this.image = new Image();
		this.licenseImage = new Image();
		this.imagePath = imagePath;
		this.licenseImagePath = licenseImagePath;
		this.duration = 7;
		this.maxFrames = FPS * this.duration;
	}

	prepare() {
		var p1 = new Promise((resolve, reject) => {
			this.image.onload = () => {
				resolve();
			};
			this.image.src = this.imagePath;
		})
		var p2 = new Promise((resolve, reject) => {
			this.licenseImage.onload = () => {
				resolve();
			};
			this.licenseImage.src = this.licenseImagePath;
		});
		return Promise.all([p1, p2]);
	}

	draw(ctx, frameNumber, width, height) {
		const timeElapsed = frameNumber / FPS;
		const fadeDuration = 3.5;
		const fadeProgressPct = frameNumber / (FPS * fadeDuration);
		const licenseFadeProgress = fadeProgressPct < 1 ? 0 : (frameNumber - (fadeDuration * FPS)) / (0.5 * FPS);
		
		ctx.fillStyle = 'white';
		ctx.globalAlpha = 1;
		ctx.fillRect(0, 0, width, height);

		ctx.globalAlpha = fadeProgressPct < 1 ? fadeProgressPct : 1;
		ctx.drawImage(this.image, 0, 0, width, height);
		if (fadeProgressPct >= 1) {
		const padding = 15;
     		ctx.globalAlpha = licenseFadeProgress; 
			ctx.drawImage(this.licenseImage,
						  width - this.licenseImage.width - padding,
						  height - this.licenseImage.height - padding,
						  this.licenseImage.width,
						  this.licenseImage.height);
		}

		if (false) {
			ctx.fillStyle = 'red';
			ctx.globalAlpha = 1;
			ctx.font = '48px serif'
			ctx.fillText(timeElapsed + " " + frameNumber, 50, 50);
		}
	}
}

class IntroAnimation {
	constructor(imagePath, title, person) {
		this.image = new Image();
		this.imagePath = imagePath;
		this.title = title;
		this.person = person;
		this.duration = 7;
		this.maxFrames = FPS * this.duration;
	}

	prepare() {
		var promise = new Promise((resolve, reject) => {
			this.image.onload = () => {
				resolve();
			};
			this.image.src = this.imagePath;
		})
		return promise;
	}

	draw(ctx, frameNumber, width, height) {
		const elapsedTime = frameNumber / FPS;
		const fadeProgressPct = frameNumber / (FPS * 3.5);
		const progressPct = frameNumber / this.maxFrames;
		
		ctx.fillStyle = 'white';
		ctx.globalAlpha = 1;
		ctx.fillRect(0, 0, width, height);

		//ctx.globalAlpha = fadeProgressPct < 1 ? fadeProgressPct : 1;
		// center the image
		const padding = 15;
		const desiredWidth = 840;
		const scaledHeight = (desiredWidth / this.image.width) * this.image.height;
		const imageX = (width - desiredWidth) / 2;
		const imageY = height - scaledHeight - padding;
		ctx.drawImage(this.image, imageX, imageY, desiredWidth, scaledHeight);

		// change the luminosity over time
		ctx.globalAlpha = easeInOutSine(frameNumber, this.maxFrames * 0.8);
		//ctx.globalCompositeOperation = "saturation";
		////ctx.fillStyle = "hsl(100%, 100%, " + fadeProgressPct * 100 + "%)";
		//ctx.fillStyle = "#000";
		//ctx.fillRect(imageX, imageY, desiredWidth, scaledHeight);

		//ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = "hue";
		ctx.fillStyle = "#000";
		ctx.fillRect(imageX, imageY, desiredWidth, scaledHeight);
		//ctx.globalCompositeOperation = "saturation";
		//ctx.fillStyle = "#fff";
		//ctx.fillRect(imageX, imageY, desiredWidth, scaledHeight);

		
		ctx.globalCompositeOperation = "source-over";
		

		if (elapsedTime >= this.duration * 0) {
			ctx.fillStyle = 'black';
			ctx.globalAlpha = 1;
			ctx.font = '100px Behrensschirft'
			ctx.textAlign  = 'center';

			// center the text above the image
			const textLineSpacing = 50;
			const textX = imageX + (desiredWidth / 2);
			const textY = height * 0.35;
			ctx.fillText(this.title, textX, textY);

			ctx.font = '82px Behrensschirft'
			ctx.fillText(this.person, textX, textY + (4* textLineSpacing));
		}
	}
}

function easeInOutSine(min, max) {
	const x = 1 - (min / max);
	return -(Math.cos(Math.PI * x) - 1) / 2;
}


class PauseAnimation {
	constructor(imagePath) {
		this.image = new Image();
		this.imagePath = imagePath;
		this.introDuration = 5;
		this.durationPerSponsor = 7;
		this.rawSponsors = SPONSORS;
		this.sponsorImages = [];
		this.sponsors = [];
	}

	get duration() {
		return this.introDuration + (this.durationPerSponsor * this.sponsorImages.length);
	}
	get maxFrames() {
		return FPS * this.duration;
	}

	prepare() {
		var i = new Promise((resolve, reject) => {
			this.image.onload = () => {
				resolve();
			};
			this.image.src = this.imagePath;
		})

		var promises = [i];

		const f = (img, src) => ((resolve, reject) => {
			img.crossOrigin = "anonymous";
			img.onload = () => resolve();
			img.src = src;
		});
		this.sponsors = [];
		for (let tier of Object.keys(this.rawSponsors)) {
			for (let sponsor of this.rawSponsors[tier]) {
				this.sponsors.push(sponsor);
			}
		}

		this.sponsors = this.sponsors.map(value => ({ value, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ value }) => value);

		for (let sponsor of this.sponsors) {
			const url = "https://2023.nixcon.org/sponsors/" + sponsor.image;
			const img = new Image();
			const p = new Promise(f(img, url));
			promises.push(p);
			this.sponsorImages.push(img);
		}

		return Promise.all(promises);
	}

	draw(ctx, frameNumber, width, height) {
		const elapsedTime = frameNumber / FPS;
		const sponsorIndex = Math.floor((elapsedTime - this.introDuration) / this.durationPerSponsor) % this.sponsorImages.length;

		if (elapsedTime < this.introDuration) {
			ctx.fillStyle = 'white';
			ctx.globalAlpha = 1;
			ctx.fillRect(0, 0, width, height);
			ctx.drawImage(this.image, 0, 0, width, height);
		} else if (sponsorIndex < this.sponsorImages.length) {
			ctx.fillStyle = '#ddd';
			ctx.globalAlpha = 1;
			ctx.fillRect(0, 0, width, height);

			// center the image and ensure we don't go too large
			const img = this.sponsorImages[sponsorIndex];
			const centerX = width / 2;
			const centerY = height / 2;
			const padding = 280;
			const s = scaleToBounds(img.height, img.width, height - padding, width - (2* padding));
			ctx.drawImage(img, centerX - (s.width/2), centerY - (s.height / 2), s.width, s.height);

			ctx.font = '60px Behrensschrift'
			ctx.fillStyle = 'black';
			ctx.globalAlpha = 1;
			ctx.textAlign  = 'center';

			ctx.fillText(this.sponsors[sponsorIndex].url, width/2, height - 60);
			ctx.fillText("We thank our sponsor", width/2, 60);
		} else {
			ctx.fillStyle = 'white';
			ctx.globalAlpha = 1;
			ctx.fillRect(0, 0, width, height);
			ctx.drawImage(this.image, 0, 0, width, height);
		}
	}
}


function scaleToBounds(height, width, boundHeight, boundWidth) {
	if (height > boundHeight) {
		const ratio = width/height;
		height = boundHeight;
		width = height * ratio;
	}

	if (width > boundWidth) {
		const ratio = height/width;
		width = boundWidth;
		height = width * ratio;
	}

	if (height < boundHeight && width < boundWidth) {
		if (height > width) {
			const ratio = width/height;
			height = boundHeight;
			width = height * ratio;
		} else if (width >= height) {
			const ratio = height/width;
			width = boundWidth;
			height = width * ratio;
		}
	}

	return {
		'height': height,
		'width': width,
	}
}
