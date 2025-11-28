# Demonio del Software

> **Tu entrenador personal para sobrevivir al Diseño del Software.**
> Una aplicación web diseñada para practicar refactorización de código y memorización de patrones de diseño UML.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-green?style=for-the-badge&logo=github)](https://davidcg-27.github.io/demonio-del-software/)

---

## Sobre el Proyecto

**Demonio del Software** es una herramienta de estudio interactiva creada específicamente para asignaturas de **Ingeniería del Software** (como Diseño del Software). Su objetivo es facilitar el aprendizaje mediante la práctica activa en dos áreas clave:

1.  **Detección de "Code Smells" y Refactorización:** Practica identificando problemas en el código y comparando tu solución con la oficial.
2.  **Patrones de Diseño (GoF):** Memoriza la estructura UML de los patrones más importantes (Strategy, Observer, Factory, etc.) mediante un sistema de flashcards.

## Características Principales

### -> Modo Práctica de Código
* **Carga Flexible:** Arrastra y suelta carpetas enteras con tus ejercicios.
* **Cronómetro:** Mide cuánto tardas en refactorizar un problema.
* **Comparación Lado a Lado:** Visualiza el código original (problemático) y la solución ideal simultáneamente.
* **Validación Automática:** El sistema detecta si faltan archivos de solución antes de empezar.

### -> Modo Diagramas UML
* **Generación Dinámica:** Diagramas renderizados en tiempo real usando **Mermaid.js**.
* **Flashcards:** Te reta a dibujar el diagrama de un patrón aleatorio antes de mostrarte la solución.
* **Librería Incluida:** Contiene definiciones precisas de patrones como *Strategy*, *Observer*, *Factory Method*, *Abstract Factory*, *Composite*, *State*, *Decorator*, entre otros.

## Cómo Usar

### 1. Acceder a la Aplicación
No necesitas instalar nada. La aplicación se ejecuta directamente en el navegador a través de GitHub Pages:
🔗 **[Abrir Demonio del Software](https://davidcg-27.github.io/demonio-del-software/)**

### 2. Cargar Ejercicios (Modo Código)
Para practicar refactorización, necesitas archivos de texto plano (`.txt`). Puedes usar los ejemplos incluidos en este repositorio o crear los tuyos propios.

**Estructura de archivos requerida:**
Los archivos deben ir en pares y seguir esta nomenclatura:
* `ejX.txt`: El archivo con el código mal diseñado (Problema).
* `ejX_sol.txt`: El archivo con el código refactorizado (Solución).

*(Donde `X` es el número del ejercicio, ej: `ej01.txt` y `ej01_sol.txt`).*

**Pasos:**
1.  Ve a la sección "Ejercicios".
2.  Arrastra la carpeta `examples` de este repositorio (o tu propia carpeta) al área de carga.
3.  Pulsa "Comenzar Práctica".

## Estructura del Proyecto

El proyecto está construido con tecnologías web estándar (HTML5, JS ES6, CSS3) y no requiere procesos de compilación complejos (tranquilos, no usa Webpack ni Vite).

```text
/
├── index.html          # Punto de entrada y estructura DOM
├── css/
│   └── styles.css      # Estilos personalizados y animaciones
├── js/
│   ├── main.js         # Inicialización de la aplicación
│   ├── app.js          # Lógica principal (Navegación, Gestión de estado)
│   ├── data.js         # Definiciones de los Patrones UML (Mermaid strings)
│   └── utils.js        # Utilidades (Lectura de archivos, Timer)
└── examples/           # Carpeta con ejercicios de muestra (.txt)
```
## Tecnologías

* **HTML5 / CSS3 / JavaScript (ES Modules)**

* [**Tailwind CSS**](https://tailwindcss.com/)**:** Para el diseño y la interfaz responsiva.

* [**Mermaid.js**](https://mermaid.js.org/)**:** Para la renderización de diagramas UML.

* [**Lucide Icons**](https://lucide.dev/)**:** Iconografía moderna y ligera.

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

Hecho con 👻 por [DavidCG-27](https://github.com/DavidCG-27)
