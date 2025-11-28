import { App } from './app.js';

window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.app.init();
});