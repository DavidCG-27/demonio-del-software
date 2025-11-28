// js/app.js
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
        
        // Almacén único para ejercicios subidos por el usuario
        this.customExercises = {}; 

        this.timer = new Timer('timer-display');
        
        // Binds - Aseguramos que 'this' siempre refiera a la clase
        this.navigate = this.navigate.bind(this);
        this.handleFiles = this.handleFiles.bind(this);
        this.startCodeSession = this.startCodeSession.bind(this);
        this.nextCodeExercise = this.nextCodeExercise.bind(this);
        this.showCodeSolution = this.showCodeSolution.bind(this);
        this.revealDiagram = this.revealDiagram.bind(this);
        this.nextDiagram = this.nextDiagram.bind(this);
    }

    init() {
        // Inicializar librerías externas
        mermaid.initialize({ startOnLoad: false, theme: 'default' });
        lucide.createIcons();
        
        this.setupEventListeners();
        this.navigate('home');
    }

    setupEventListeners() {
        // Navegación general (botones del header y otros)
        document.querySelectorAll('[data-nav]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Obtenemos el target desde el atributo o subimos en el DOM si el click fue en un hijo (icono)
                const target = e.currentTarget.getAttribute('data-nav');
                this.navigate(target);
            });
        });

        // Input de archivos (carpeta o archivos sueltos)
        const fileInput = document.getElementById('file-input');
        if(fileInput) fileInput.addEventListener('change', (e) => this.handleFiles(e.target.files));

        // Botones de la sesión de código
        document.getElementById('btn-start-code')?.addEventListener('click', this.startCodeSession);
        document.getElementById('btn-show-sol')?.addEventListener('click', this.showCodeSolution);
        document.getElementById('btn-next-ex')?.addEventListener('click', this.nextCodeExercise);
        
        // Botones de la sesión de diagramas
        document.getElementById('btn-reveal-diagram')?.addEventListener('click', this.revealDiagram);
        document.getElementById('btn-next-diagram')?.addEventListener('click', this.nextDiagram);

        // Zona de Drag & Drop
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
                if (e.dataTransfer.files.length) this.handleFiles(e.dataTransfer.files);
            });
        }
    }

    navigate(viewId) {
        // Lista de todas las vistas posibles
        const views = ['view-home', 'view-upload', 'view-practice', 'view-diagrams', 'view-finished', 'view-help', 'view-about'];
        
        // Ocultar todas
        views.forEach(id => {
            const el = document.getElementById(id);
            if(el) el.classList.add('hidden');
        });
        
        // Mostrar la solicitada
        const target = document.getElementById(`view-${viewId}`);
        if(target) target.classList.remove('hidden');
        
        // Acciones específicas al entrar/salir de ciertas vistas
        if(viewId === 'home') this.timer.stop();
        if(viewId === 'diagrams') this.startDiagramSession();
        
        // Re-inicializar iconos por si hay contenido dinámico nuevo
        lucide.createIcons();
    }

    // --- LOGICA DE CARGA DE ARCHIVOS Y EJERCICIOS ---

    async handleFiles(fileList) {
        const statusDiv = document.getElementById('upload-status');
        statusDiv.classList.remove('hidden');
        statusDiv.innerHTML = '<div class="text-blue-600 flex items-center justify-center gap-2"><i data-lucide="loader-2" class="animate-spin"></i> Procesando archivos locales...</div>';
        lucide.createIcons();

        const tempStore = {};
        const errors = [];
        
        // Procesar archivos subidos
        for (let file of fileList) {
            if (file.name.endsWith('.txt')) {
                // Regex para capturar ejXX.txt y ejXX_sol.txt
                const match = file.name.match(/ej(\d+)(_sol)?\.txt$/i);
                if (match) {
                    const id = parseInt(match[1]).toString(); // Normaliza '01' a '1'
                    const isSol = !!match[2];
                    
                    if (!tempStore[id]) tempStore[id] = { id: id, problem: null, solution: null };
                    
                    try {
                        const content = await readFile(file);
                        if (isSol) tempStore[id].solution = content;
                        else tempStore[id].problem = content;
                    } catch (err) {
                        console.error("Error leyendo archivo", file.name);
                    }
                }
            }
        }

        // Validar pares completos
        this.customExercises = {}; 
        Object.keys(tempStore).forEach(id => {
            const item = tempStore[id];
            if (item.problem && item.solution) {
                this.customExercises[id] = item;
            } else {
                if (!item.problem) errors.push(`Falta problema para el ejercicio ${id}`);
                if (!item.solution) errors.push(`Falta solución para el ejercicio ${id}`);
            }
        });

        this.lastUploadErrors = errors;
        this.updateCombinedExercises();
    }

    updateCombinedExercises() {
        const statusDiv = document.getElementById('upload-status');
        const btnStart = document.getElementById('btn-start-code');
        
        // 1. Usar solo ejercicios custom (eliminada lógica de baseExercises)
        this.state.exercises = { ...this.customExercises };

        const totalCount = Object.keys(this.state.exercises).length;
        
        // 2. Actualizar UI con el estado
        let html = '';

        if (this.lastUploadErrors && this.lastUploadErrors.length > 0) {
             html += `<div class="bg-red-50 text-red-700 p-4 rounded-lg mb-4 text-left text-sm max-h-32 overflow-auto border border-red-200"><p class="font-bold mb-1">Errores en tus archivos:</p><ul class="list-disc pl-4">${this.lastUploadErrors.map(e => `<li>${e}</li>`).join('')}</ul></div>`;
        }

        if (totalCount > 0) {
            html += `<div class="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 mb-4">
                <div class="flex items-center gap-2 mb-2">
                    <i data-lucide="check-circle" class="w-5 h-5"></i>
                    <span class="font-bold">Todo listo para empezar.</span>
                </div>
                <div class="text-sm ml-7">
                    <p>Total ejercicios disponibles: <strong>${totalCount}</strong></p>
                </div>
            </div>`;
            
            // Habilitar botón con estilos activos
            btnStart.disabled = false;
            btnStart.classList.remove('bg-gray-200', 'text-gray-700', 'cursor-not-allowed', 'border-gray-400');
            btnStart.classList.add('bg-oviedo-DEFAULT', 'text-white', 'hover:bg-oviedo-dark', 'shadow-md', 'border-transparent');
        } else {
            html += `<p class="text-gray-600 font-medium">No hay ejercicios seleccionados.</p>
                     <p class="text-sm text-gray-400 mt-1">Sube tus archivos .txt o una carpeta para empezar.</p>`;
            
            // Deshabilitar botón
            btnStart.disabled = true;
            btnStart.classList.add('bg-gray-200', 'text-gray-700', 'cursor-not-allowed', 'border-gray-400');
            btnStart.classList.remove('bg-oviedo-DEFAULT', 'text-white', 'hover:bg-oviedo-dark', 'shadow-md', 'border-transparent');
        }

        statusDiv.innerHTML = html;
        statusDiv.classList.remove('hidden');
        lucide.createIcons();
    }

    // --- LOGICA DE SESIÓN DE CÓDIGO ---

    startCodeSession() {
        // Mezclar orden de ejercicios
        this.state.exerciseKeys = Object.keys(this.state.exercises).sort(() => Math.random() - 0.5);
        this.state.currentExIndex = 0;
        
        if (this.state.exerciseKeys.length === 0) return;

        this.navigate('practice');
        this.loadCodeExercise();
    }

    loadCodeExercise() {
        const id = this.state.exerciseKeys[this.state.currentExIndex];
        const exercise = this.state.exercises[id];

        // Actualizar UI
        document.getElementById('current-ex-name').textContent = exercise.id || id;
        document.getElementById('progress-indicator').textContent = `${this.state.currentExIndex + 1}/${this.state.exerciseKeys.length}`;
        
        // Resetear paneles
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
        
        // Mostrar solución
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

    // --- LOGICA DE DIAGRAMAS UML ---

    startDiagramSession() {
        this.state.diagramIndex = 0;
        // Mezclar patrones
        this.state.shuffledPatterns = [...STANDARD_PATTERNS].sort(() => Math.random() - 0.5);
        this.loadDiagramCard();
    }

    loadDiagramCard() {
        if (this.state.diagramIndex >= this.state.shuffledPatterns.length) {
            this.navigate('finished');
            return;
        }

        const pattern = this.state.shuffledPatterns[this.state.diagramIndex];
        
        // Resetear vista de tarjeta
        document.getElementById('diagram-question').classList.remove('opacity-0', 'pointer-events-none');
        document.getElementById('diagram-solution').classList.add('opacity-0', 'pointer-events-none');
        
        document.getElementById('pattern-name').textContent = pattern.name;
        document.getElementById('sol-pattern-name').textContent = pattern.name;
        document.getElementById('mermaid-container').innerHTML = ''; // Limpiar previo
    }

    async revealDiagram() {
        const pattern = this.state.shuffledPatterns[this.state.diagramIndex];
        
        // Transición visual
        document.getElementById('diagram-question').classList.add('opacity-0', 'pointer-events-none');
        document.getElementById('diagram-solution').classList.remove('opacity-0', 'pointer-events-none');
        
        // Renderizar Mermaid
        const container = document.getElementById('mermaid-container');
        try {
            // Generamos ID único para evitar conflictos de cache de mermaid
            const { svg } = await mermaid.render(`graphDiv${this.state.diagramIndex}-${Date.now()}`, pattern.def);
            container.innerHTML = svg;
        } catch (e) {
            container.innerHTML = `<div class="text-red-500">Error renderizando diagrama.</div>`;
            console.error(e);
        }
    }

    nextDiagram() {
        this.state.diagramIndex++;
        this.loadDiagramCard();
    }
}