import { STANDARD_PATTERNS } from './data.js';
import { readFile, Timer } from './utils.js';

export class App {
    constructor() {
        this.state = {
            exercises: {}, 
            exerciseKeys: [],
            currentExIndex: 0,
            diagramIndex: 0,
            shuffledPatterns: []
        };
        
        this.timer = new Timer('timer-display');
        
        // Bind methods to preserve 'this' context
        this.navigate = this.navigate.bind(this);
        this.handleFiles = this.handleFiles.bind(this);
        this.startCodeSession = this.startCodeSession.bind(this);
        this.nextCodeExercise = this.nextCodeExercise.bind(this);
        this.showCodeSolution = this.showCodeSolution.bind(this);
        this.revealDiagram = this.revealDiagram.bind(this);
        this.nextDiagram = this.nextDiagram.bind(this);
    }

    init() {
        // Initialize libraries
        mermaid.initialize({ startOnLoad: false, theme: 'default' });
        lucide.createIcons();
        this.setupEventListeners();
        this.navigate('home');
    }

    setupEventListeners() {
        // Navigation events
        document.querySelectorAll('[data-nav]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget.getAttribute('data-nav');
                this.navigate(target);
            });
        });

        // Specific buttons
        const fileInput = document.getElementById('file-input');
        if(fileInput) fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        document.getElementById('btn-start-code')?.addEventListener('click', this.startCodeSession);
        document.getElementById('btn-show-sol')?.addEventListener('click', this.showCodeSolution);
        document.getElementById('btn-next-ex')?.addEventListener('click', this.nextCodeExercise);
        
        document.getElementById('btn-reveal-diagram')?.addEventListener('click', this.revealDiagram);
        document.getElementById('btn-next-diagram')?.addEventListener('click', this.nextDiagram);

        // Drag and Drop
        const dropZone = document.getElementById('drop-zone');
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('bg-blue-50', 'border-blue-400');
            });
            dropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropZone.classList.remove('bg-blue-50', 'border-blue-400');
            });
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('bg-blue-50', 'border-blue-400');
                if (e.dataTransfer.files.length) {
                    this.handleFiles(e.dataTransfer.files);
                }
            });
        }
    }

    navigate(viewId) {
        ['view-home', 'view-upload', 'view-practice', 'view-diagrams', 'view-finished'].forEach(id => {
            document.getElementById(id).classList.add('hidden');
        });
        
        const target = document.getElementById(`view-${viewId}`);
        if(target) target.classList.remove('hidden');
        
        if(viewId === 'home') this.timer.stop();
        if(viewId === 'diagrams') this.startDiagramSession();
    }

    // --- CODE LOGIC ---
    async handleFiles(fileList) {
        const statusDiv = document.getElementById('upload-status');
        const btnStart = document.getElementById('btn-start-code');
        
        statusDiv.classList.remove('hidden');
        statusDiv.innerHTML = '<div class="text-blue-600 flex items-center justify-center gap-2"><i data-lucide="loader-2" class="animate-spin"></i> Procesando archivos...</div>';
        lucide.createIcons();

        const tempStore = {};
        
        for (let file of fileList) {
            if (file.name.endsWith('.txt')) {
                const match = file.name.match(/ej(\d+)(_sol)?\.txt$/i);
                if (match) {
                    const id = parseInt(match[1]).toString();
                    const isSol = !!match[2];
                    
                    if (!tempStore[id]) tempStore[id] = { id: id, problem: null, solution: null };
                    
                    try {
                        const content = await readFile(file);
                        if (isSol) tempStore[id].solution = content;
                        else tempStore[id].problem = content;
                    } catch (err) {
                        console.error("Error reading file", file.name);
                    }
                }
            }
        }

        const validExercises = {};
        const errors = [];
        
        Object.keys(tempStore).forEach(id => {
            const item = tempStore[id];
            if (item.problem && item.solution) {
                validExercises[id] = item;
            } else {
                if (!item.problem) errors.push(`Falta problema para el ejercicio ${id}`);
                if (!item.solution) errors.push(`Falta solución para el ejercicio ${id}`);
            }
        });

        const validCount = Object.keys(validExercises).length;
        let html = '';
        
        if (errors.length > 0) {
            html += `<div class="bg-red-50 text-red-700 p-4 rounded-lg mb-4 text-left text-sm max-h-32 overflow-auto border border-red-200"><p class="font-bold mb-1">Errores encontrados:</p><ul class="list-disc pl-4">${errors.map(e => `<li>${e}</li>`).join('')}</ul></div>`;
        }

        if (validCount > 0) {
            html += `<div class="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200"><div class="flex items-center gap-2"><i data-lucide="check-circle" class="w-5 h-5"></i><span class="font-bold">${validCount} ejercicios listos para practicar.</span></div></div>`;
            this.state.exercises = validExercises;
            btnStart.disabled = false;
            btnStart.classList.remove('bg-gray-200', 'text-gray-700', 'cursor-not-allowed', 'border-gray-400');
            btnStart.classList.add('bg-oviedo-DEFAULT', 'text-white', 'hover:bg-oviedo-dark', 'shadow-md', 'border-transparent');
        } else {
            html += `<p class="text-gray-600 font-medium">No se encontraron pares de archivos válidos.</p>`;
            btnStart.disabled = true;
            btnStart.classList.add('bg-gray-200', 'text-gray-700', 'cursor-not-allowed', 'border-gray-400');
            btnStart.classList.remove('bg-oviedo-DEFAULT', 'text-white', 'hover:bg-oviedo-dark', 'shadow-md', 'border-transparent');
        }

        statusDiv.innerHTML = html;
        lucide.createIcons();
    }

    startCodeSession() {
        this.state.exerciseKeys = Object.keys(this.state.exercises).sort(() => Math.random() - 0.5);
        this.state.currentExIndex = 0;
        if (this.state.exerciseKeys.length === 0) return;
        this.navigate('practice');
        this.loadCodeExercise();
    }

    loadCodeExercise() {
        const id = this.state.exerciseKeys[this.state.currentExIndex];
        const exercise = this.state.exercises[id];

        document.getElementById('current-ex-name').textContent = id;
        document.getElementById('progress-indicator').textContent = `${this.state.currentExIndex + 1}/${this.state.exerciseKeys.length}`;
        
        document.getElementById('user-editor').value = '';
        document.getElementById('problem-content').textContent = exercise.problem;
        document.getElementById('problem-content').classList.remove('hidden');
        document.getElementById('solution-content').textContent = exercise.solution;
        document.getElementById('solution-content').classList.add('hidden');
        
        document.getElementById('right-panel-title').textContent = "Código Original (Mal Olor)";
        document.getElementById('right-panel-title').className = "text-xs font-bold text-gray-500 uppercase tracking-wider";
        
        document.getElementById('btn-show-sol').classList.remove('hidden');
        document.getElementById('btn-next-ex').classList.add('hidden');
        
        this.timer.start();
    }

    showCodeSolution() {
        this.timer.stop();
        const timeStr = this.timer.getTimeString();
        
        document.getElementById('problem-content').classList.add('hidden');
        document.getElementById('solution-content').classList.remove('hidden');
        
        document.getElementById('right-panel-title').textContent = `Solución Oficial (Tiempo: ${timeStr})`;
        document.getElementById('right-panel-title').className = "text-xs font-bold text-green-600 uppercase tracking-wider";

        document.getElementById('btn-show-sol').classList.add('hidden');
        document.getElementById('btn-next-ex').classList.remove('hidden');
    }

    nextCodeExercise() {
        this.state.currentExIndex++;
        if (this.state.currentExIndex >= this.state.exerciseKeys.length) {
            this.navigate('finished');
        } else {
            this.loadCodeExercise();
        }
    }

    // --- DIAGRAM LOGIC ---
    startDiagramSession() {
        this.state.diagramIndex = 0;
        this.state.shuffledPatterns = [...STANDARD_PATTERNS].sort(() => Math.random() - 0.5);
        this.loadDiagramCard();
    }

    loadDiagramCard() {
        if (this.state.diagramIndex >= this.state.shuffledPatterns.length) {
            this.navigate('finished');
            return;
        }

        const pattern = this.state.shuffledPatterns[this.state.diagramIndex];
        
        document.getElementById('diagram-question').classList.remove('opacity-0', 'pointer-events-none');
        document.getElementById('diagram-solution').classList.add('opacity-0', 'pointer-events-none');
        
        document.getElementById('pattern-name').textContent = pattern.name;
        document.getElementById('sol-pattern-name').textContent = pattern.name;
        document.getElementById('mermaid-container').innerHTML = '';
    }

    async revealDiagram() {
        const pattern = this.state.shuffledPatterns[this.state.diagramIndex];
        
        document.getElementById('diagram-question').classList.add('opacity-0', 'pointer-events-none');
        document.getElementById('diagram-solution').classList.remove('opacity-0', 'pointer-events-none');
        
        const container = document.getElementById('mermaid-container');
        try {
            const { svg } = await mermaid.render(`graphDiv${this.state.diagramIndex}`, pattern.def);
            container.innerHTML = svg;
        } catch (e) {
            container.textContent = "Error renderizando diagrama.";
            console.error(e);
        }
    }

    nextDiagram() {
        this.state.diagramIndex++;
        this.loadDiagramCard();
    }
}