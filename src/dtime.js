
class DeltaTime {

	startTime;

	constructor() {
   	}

	start() {
		this.startTime = new Date().getTime();
	}

	stop() {
		return new Date().getTime() - this.startTime;
	}
}

module.exports = { DeltaTime }