import React, { useState, useMemo } from 'react';
import { Clock, Globe, Grid, Loader, AlertCircle, Search, Filter, MapPin, Users, Shuffle, Sun, Moon } from 'lucide-react';
import { useWorldTime } from '../hooks/useWorldTime';
import { CityCard } from './CityCard';
import { GlobeView } from './GlobeView';
import { ThemeToggle } from './ThemeToggle';

type ViewMode = 'grid' | 'globe';
type TimeFilter = 'all' | 'day' | 'night';

export const WorldClock: React.FC = () => {
  const { worldTimes, loading, error } = useWorldTime();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [randomSeed, setRandomSeed] = useState(0);

  // Función para mezclar array de forma determinística
  const shuffleArray = <T,>(array: T[], seed: number): T[] => {
    const shuffled = [...array];
    let currentIndex = shuffled.length;
    let randomIndex;
    
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    while (currentIndex !== 0) {
      randomIndex = Math.floor(random() * currentIndex);
      currentIndex--;
      [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
    }

    return shuffled;
  };

  const filteredWorldTimes = useMemo(() => {
    let filtered = worldTimes.filter(worldTime => {
      const matchesSearch = worldTime.timezone.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           worldTime.timezone.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           worldTime.timezone.countryCode.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = timeFilter === 'all' || 
                           (timeFilter === 'day' && worldTime.isDaytime) ||
                           (timeFilter === 'night' && !worldTime.isDaytime);
      
      return matchesSearch && matchesFilter;
    });

    if (searchTerm.trim()) {
      return filtered;
    }

    if (viewMode === 'grid') {
      const shuffled = shuffleArray(filtered, randomSeed);
      return shuffled.slice(0, 12);
    }

    return filtered;
  }, [worldTimes, searchTerm, timeFilter, viewMode, randomSeed]);

  const popularSearches = [
    'Canadá', 'Estados Unidos', 'España', 'Francia', 'Japón', 'Australia', 
    'Brasil', 'Reino Unido', 'Alemania', 'China', 'India', 'México'
  ];

  const handleSearchSuggestion = (suggestion: string) => {
    setSearchTerm(suggestion);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const shuffleCities = () => {
    setRandomSeed(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-minimal-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-minimal-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-medium text-minimal-primary mb-2">Cargando Reloj Mundial</h2>
          <p className="text-minimal-secondary">Sincronizando zonas horarias globales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-minimal-secondary flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-minimal-primary mb-2">Error de Conexión</h2>
          <p className="text-minimal-secondary mb-4">{error}</p>
          <p className="text-sm text-minimal-secondary">
            Por favor verifica tu API key de TimeZoneDB en src/services/timezones.ts
          </p>
        </div>
      </div>
    );
  }

  const totalCities = worldTimes.length;
  const maxDisplayed = viewMode === 'globe' ? 10 : 12;
  const isLimited = !searchTerm.trim() && totalCities > maxDisplayed;

  return (
    <div className="min-h-screen bg-minimal-secondary">
      {/* Header */}
      <header className="bg-minimal-primary border-b border-minimal">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-minimal-accent rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-minimal-primary">Reloj Mundial</h1>
                <p className="text-minimal-secondary">Zonas horarias globales en tiempo real</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              <div className="flex bg-minimal-secondary rounded-lg p-1 border border-minimal">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-minimal-primary text-minimal-primary shadow-sm'
                      : 'text-minimal-secondary hover:text-minimal-primary'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">Cuadrícula</span>
                </button>
                <button
                  onClick={() => setViewMode('globe')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    viewMode === 'globe'
                      ? 'bg-minimal-primary text-minimal-primary shadow-sm'
                      : 'text-minimal-secondary hover:text-minimal-primary'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">Globo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-minimal-secondary" />
                <input
                  type="text"
                  placeholder="Buscar ciudades, países o códigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-minimal-primary border border-minimal rounded-lg text-minimal-primary placeholder-minimal-secondary focus:outline-none focus:ring-2 focus:ring-minimal-accent focus:border-transparent transition-all duration-200"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-minimal-secondary hover:text-minimal-primary transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-minimal-secondary" />
                <div className="flex bg-minimal-secondary rounded-lg p-1 border border-minimal">
                  {(['all', 'day', 'night'] as TimeFilter[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTimeFilter(filter)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                        timeFilter === filter
                          ? 'bg-minimal-primary text-minimal-primary'
                          : 'text-minimal-secondary hover:text-minimal-primary'
                      }`}
                    >
                      {filter === 'day' && <Sun className="w-3 h-3" />}
                      {filter === 'night' && <Moon className="w-3 h-3" />}
                      {filter === 'all' ? 'Todas' : filter === 'day' ? 'Día' : 'Noche'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Suggestions */}
            {!searchTerm && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-minimal-secondary">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Búsquedas populares:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSearchSuggestion(suggestion)}
                      className="px-3 py-1 bg-minimal-primary border border-minimal rounded-full text-minimal-secondary hover:text-minimal-primary hover:border-minimal-accent text-sm transition-all duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                
                {viewMode === 'grid' && (
                  <button
                    onClick={shuffleCities}
                    className="flex items-center gap-2 px-4 py-2 bg-minimal-primary border border-minimal rounded-lg text-minimal-secondary hover:text-minimal-primary hover:border-minimal-accent transition-all duration-200"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span className="text-sm font-medium">Mezclar Cuadrícula</span>
                  </button>
                )}
              </div>
            )}

            {/* Search Results Info */}
            {searchTerm && (
              <div className="flex items-center justify-between text-minimal-secondary text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>
                    {filteredWorldTimes.length === 0 
                      ? `No se encontraron ciudades para "${searchTerm}"`
                      : `${filteredWorldTimes.length} ciudad${filteredWorldTimes.length !== 1 ? 'es' : ''} encontrada${filteredWorldTimes.length !== 1 ? 's' : ''} para "${searchTerm}"`
                    }
                  </span>
                </div>
                {filteredWorldTimes.length > 0 && (
                  <button
                    onClick={clearSearch}
                    className="text-minimal-accent hover:underline"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}

            {/* Limitation Info */}
            {isLimited && viewMode === 'grid' && (
              <div className="flex items-center justify-between bg-minimal-primary border border-minimal rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-minimal-accent/10 rounded-full flex items-center justify-center">
                    <Shuffle className="w-4 h-4 text-minimal-accent" />
                  </div>
                  <div>
                    <p className="text-minimal-primary font-medium">
                      Mostrando {maxDisplayed} de {totalCities} ciudades disponibles
                    </p>
                    <p className="text-minimal-secondary text-sm">
                      Máximo 12 ciudades en vista de cuadrícula • Usa la búsqueda para encontrar ciudades específicas
                    </p>
                  </div>
                </div>
                <button
                  onClick={shuffleCities}
                  className="flex items-center gap-2 px-4 py-2 bg-minimal-accent text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  <Shuffle className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">Mezclar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="bg-minimal-primary border-b border-minimal">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-semibold text-minimal-primary mb-1">
                {viewMode === 'grid' ? filteredWorldTimes.length : '10 máx'}
              </div>
              <div className="text-minimal-secondary text-sm">
                {searchTerm ? 'Resultados' : viewMode === 'grid' ? 'Ciudades Mostradas' : 'Ciudades en Globo'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-minimal-primary mb-1">
                {viewMode === 'grid' 
                  ? filteredWorldTimes.filter(wt => wt.isDaytime).length
                  : '~5'
                }
              </div>
              <div className="text-minimal-secondary text-sm">En Día</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-minimal-primary mb-1">
                {viewMode === 'grid' 
                  ? filteredWorldTimes.filter(wt => !wt.isDaytime).length
                  : '~5'
                }
              </div>
              <div className="text-minimal-secondary text-sm">En Noche</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-minimal-primary mb-1">
                {totalCities}
              </div>
              <div className="text-minimal-secondary text-sm">Total Disponibles</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {filteredWorldTimes.length === 0 && searchTerm ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-minimal-secondary mx-auto mb-6" />
            <h3 className="text-xl font-medium text-minimal-primary mb-2">No se encontraron resultados</h3>
            <p className="text-minimal-secondary mb-6">
              No pudimos encontrar ciudades que coincidan con "{searchTerm}"
            </p>
            <div className="space-y-4">
              <p className="text-minimal-secondary text-sm">Intenta buscar por:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Nombre de ciudad', 'País', 'Código de país'].map((tip) => (
                  <span key={tip} className="px-3 py-1 bg-minimal-primary border border-minimal rounded-full text-minimal-secondary text-sm">
                    {tip}
                  </span>
                ))}
              </div>
              <button
                onClick={clearSearch}
                className="mt-4 px-6 py-3 bg-minimal-accent text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Ver todas las ciudades
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredWorldTimes.map((worldTime, index) => (
              <CityCard
                key={worldTime.timezone.id}
                worldTime={worldTime}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center">
            <GlobeView 
              worldTimes={worldTimes} 
              onCitySelect={setSelectedCity}
              searchTerm={searchTerm}
              timeFilter={timeFilter}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-minimal-primary border-t border-minimal">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center">
          <p className="text-minimal-secondary text-sm">
            🌍 {totalCities} ciudades globales • Sincronización en tiempo real
          </p>
        </div>
      </footer>
    </div>
  );
};