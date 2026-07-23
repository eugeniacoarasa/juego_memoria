# 🧠 Juego de Memoria PWA (v2.6.0)

[![Version](https://img.shields.io/badge/version-2.6.0-brightgreen.svg)](https://github.com/eugeniacoarasa/juego_memoria)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue.svg)](#-instalación-pwa)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Un juego de memoria interactivo, moderno y estilizado desarrollado como una **Progressive Web App (PWA)**. Diseñado con una estética neón, el juego ofrece una experiencia fluida, responsiva y adaptable a múltiples dispositivos (PC, iPad, smartphones).

---

## 🚀 Características Principales

* **🎨 Diseño e Interfaz Neón:** Estética moderna con alto contraste, animaciones fluidas y soporte totalmente responsivo.
* **🏆 Sistema de Ranking Local:** Guarda y gestiona automáticamente las mejores puntuaciones usando `localStorage`.
* **📱 Progressive Web App (PWA):**
  * Instalable en pantallas de inicio como aplicación nativa en **iOS, Android y PC**.
  * Ejecución a pantalla completa (Standalone) sin barras de navegación.
  * Soporte offline a través de Service Worker.
* **⚡ Rendimiento y Caché:** Estrategias de actualización eficientes para asegurar la ejecución rápida en cualquier dispositivo.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica y optimizada.
* **CSS3:** Estilos avanzados, variables CSS, Flexbox/Grid y efectos de iluminación neón.
* **JavaScript (ES6+):** Lógica del juego, manejo de estado y persistencia de datos.
* **Service Worker & Manifest.json:** Infraestructura para el soporte de PWA.

---

## 📲 Instalación (PWA)

Puedes jugar directamente desde tu navegador o instalarlo en tu dispositivo:

🌐 **Demo en vivo:** [https://eugeniacoarasa.github.io/juego_memoria/](https://eugeniacoarasa.github.io/juego_memoria/)

### 📱 Android (Samsung / Chrome / Edge)
1. Abre el enlace en tu navegador.
2. Despliega el menú del navegador (`⋮` o `☰`).
3. Selecciona **Instalar aplicación** o **Agregar a la pantalla de inicio**.

### 🍎 iOS / iPadOS (Safari)
1. Abre el enlace en Safari.
2. Toca el botón **Compartir** (icono con la flecha hacia arriba).
3. Selecciona **Agregar a la pantalla de inicio**.

---

## 📂 Estructura del Proyecto

```text
juego_memoria/
├── index.html        # Estructura principal de la app
├── styles.css        # Estilos y diseño neón
├── app.js            # Lógica del juego y gestión de ranking
├── sw.js             # Service Worker para funcionamiento offline
├── manifest.json     # Configuración PWA
└── assets/           # Iconos e imágenes del juego
```
---

### 📝 Registro de Cambios (v2.6.0)
[x] Implementación y refinamiento del sistema de ranking.

[x] Correcciones de contraste en tarjetas y pulido visual neón.

[x] Configuración y validación del Service Worker para soporte PWA multiplataforma.

[x] Optimización y despliegue final en GitHub Pages.

Desarrollado con ❤️ por Eugenia Coarasa.
