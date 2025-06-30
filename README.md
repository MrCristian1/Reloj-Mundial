# 🌍 Reloj Mundial

Una aplicación web moderna y minimalista que muestra las zonas horarias globales en tiempo real. Desarrollada con React, TypeScript y Tailwind CSS.

## ✨ Características

### 🕐 Funcionalidades Principales
- **Tiempo Real**: Actualización automática cada segundo
- **32+ Ciudades Globales**: Cobertura mundial completa
- **Dos Vistas Interactivas**:
  - 📊 **Vista de Cuadrícula**: Tarjetas detalladas con información completa
  - 🌐 **Vista de Globo**: Representación visual interactiva con efectos de palpitación

### 🎨 Diseño y Experiencia
- **Diseño Minimalista**: Interfaz limpia y moderna
- **Modo Oscuro/Claro**: Cambio automático según la hora o manual
- **Responsive**: Optimizado para todos los dispositivos
- **Animaciones Suaves**: Transiciones y efectos visuales elegantes

### 🔍 Funciones Avanzadas
- **Búsqueda Inteligente**: Por ciudad, país o código de país
- **Filtros de Tiempo**: Ver solo ciudades en día o noche
- **Distribución Aleatoria**: Mezcla las ciudades mostradas
- **Información Detallada**: Período del día, progreso solar, zona horaria

### 🌐 Vista de Globo Especial
- **Efectos de Palpitación**: Los puntos palpitan con colores únicos
- **Modales Contextuales**: 
  - Ciudades de día: Modal a la izquierda
  - Ciudades de noche: Modal a la derecha
- **Rotación Automática**: Con controles de pausa/reproducción
- **Interactividad**: Hover y click en los puntos

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint + TypeScript ESLint

## 📦 Instalación y Uso

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd reloj-mundial

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Vista previa de la build
npm run lint     # Ejecutar linter
```

## 🌍 Ciudades Incluidas

### América del Norte
- 🇨🇦 **Canadá**: Toronto, Vancouver
- 🇺🇸 **Estados Unidos**: Nueva York, Los Ángeles, Chicago
- 🇲🇽 **México**: Ciudad de México

### América del Sur
- 🇨🇴 **Colombia**: Bogotá
- 🇵🇪 **Perú**: Lima
- 🇦🇷 **Argentina**: Buenos Aires
- 🇧🇷 **Brasil**: São Paulo
- 🇨🇱 **Chile**: Santiago

### Europa
- 🇬🇧 **Reino Unido**: Londres
- 🇫🇷 **Francia**: París
- 🇪🇸 **España**: Madrid
- 🇮🇹 **Italia**: Roma
- 🇩🇪 **Alemania**: Berlín
- 🇷🇺 **Rusia**: Moscú
- 🇸🇪 **Suecia**: Estocolmo

### Asia
- 🇯🇵 **Japón**: Tokio
- 🇨🇳 **China**: Pekín
- 🇮🇳 **India**: Bombay
- 🇦🇪 **Emiratos Árabes Unidos**: Dubái
- 🇰🇷 **Corea del Sur**: Seúl
- 🇸🇬 **Singapur**: Singapur
- 🇹🇭 **Tailandia**: Bangkok

### África
- 🇪🇬 **Egipto**: El Cairo
- 🇳🇬 **Nigeria**: Lagos
- 🇿🇦 **Sudáfrica**: Ciudad del Cabo
- 🇲🇦 **Marruecos**: Casablanca

### Oceanía
- 🇦🇺 **Australia**: Sídney, Melbourne
- 🇳🇿 **Nueva Zelanda**: Auckland
- 🇫🇯 **Fiyi**: Suva

## 🎯 Características Técnicas

### Arquitectura
- **Componentes Modulares**: Separación clara de responsabilidades
- **Hooks Personalizados**: `useWorldTime` para gestión de estado
- **Servicios**: Capa de abstracción para APIs externas
- **TypeScript**: Tipado fuerte para mejor mantenibilidad

### Rendimiento
- **Optimización de Re-renders**: Uso de `useMemo` y `useCallback`
- **Lazy Loading**: Carga eficiente de componentes
- **Animaciones CSS**: Transiciones suaves sin JavaScript

### Accesibilidad
- **Contraste de Colores**: Cumple estándares WCAG
- **Navegación por Teclado**: Soporte completo
- **Lectores de Pantalla**: Etiquetas semánticas

## 🔧 Configuración

### API de Zona Horaria (Opcional)
La aplicación funciona con datos simulados, pero puedes configurar una API real:

1. Obtén una API key de [TimeZoneDB](https://timezonedb.com/register)
2. Reemplaza la clave en `src/services/timezones.ts`
3. Descomenta el código de la API en el mismo archivo

### Personalización
- **Colores**: Modifica las variables CSS en `src/index.css`
- **Ciudades**: Agrega/quita ciudades en `src/services/timezones.ts`
- **Temas**: Personaliza los temas en `src/components/ThemeToggle.tsx`

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: 
  - `sm`: 640px+
  - `md`: 768px+
  - `lg`: 1024px+
  - `xl`: 1280px+

## 🎨 Sistema de Diseño

### Colores
- **Primario**: Texto principal y fondos
- **Secundario**: Texto secundario y elementos de apoyo
- **Accent**: Color de énfasis (azul)
- **Modo Oscuro**: Paleta adaptada automáticamente

### Tipografía
- **Fuente**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700
- **Mono**: Para horarios y datos técnicos

## 🚀 Despliegue

### Netlify (Recomendado)
```bash
npm run build
# Subir carpeta 'dist' a Netlify
```

### Vercel
```bash
npm run build
vercel --prod
```

### GitHub Pages
```bash
npm run build
# Configurar GitHub Actions para despliegue automático
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Lucide React** por los iconos
- **Tailwind CSS** por el sistema de estilos
- **TimeZoneDB** por la API de zonas horarias
- **Google Fonts** por la tipografía Inter

## 📞 Contacto

Si tienes preguntas o sugerencias, no dudes en abrir un issue en el repositorio.

---

**Desarrollado con ❤️ usando React + TypeScript + Tailwind CSS**