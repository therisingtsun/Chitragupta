export default class Timer {
	constructor(callback, duration = 500) {
		this.callback = callback;
		this.duration = duration;
		this.remaining = duration;
		this.resume();
	};

	resume() {
		this.start = Date.now();
		this.timerId = setTimeout(this.callback, this.remaining);
		return this;
	};
	
	pause() {
		if (this.timerId) {
			clearTimeout(this.timerId);
			delete this.timerId;
		}
		this.remaining -= Date.now() - this.start;
		return this;
	};
	
	reset() {
		this.pause();
		this.remaining = this.duration;
		return this;
	};
}