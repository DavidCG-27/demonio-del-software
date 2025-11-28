export function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
    });
}

export class Timer {
    constructor(displayElementId) {
        this.displayElement = document.getElementById(displayElementId);
        this.interval = null;
        this.startTime = null;
    }

    start() {
        this.stop();
        this.startTime = Date.now();
        this.updateDisplay("00:00");
        
        this.interval = setInterval(() => {
            const delta = Math.floor((Date.now() - this.startTime) / 1000);
            const m = Math.floor(delta / 60).toString().padStart(2, '0');
            const s = (delta % 60).toString().padStart(2, '0');
            this.updateDisplay(`${m}:${s}`);
        }, 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    getTimeString() {
        return this.displayElement ? this.displayElement.textContent : "00:00";
    }

    updateDisplay(text) {
        if (this.displayElement) {
            this.displayElement.textContent = text;
        }
    }
}