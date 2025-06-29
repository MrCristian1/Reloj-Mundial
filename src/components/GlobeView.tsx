import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Globe, Play, Pause, Sun, Moon, MapPin, Clock, Sunrise, Sunset } from 'lucide-react';
import { WorldTime } from '../types/timezone';

interface GlobeViewProps {
  worldTimes: WorldTime[];
  onCitySelect?: (cityId: string) => void;
  searchTerm?: string;
  timeFilter?: 'all' | 'day' | 'night';
}

export const GlobeView: React.FC<GlobeViewProps> = ({ 
  worldTimes, 
  onCitySelect, 
  searchTerm = '', 
  timeFilter = 'all' 
}) => {
  const [rotation, setRotation] = useState(0);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [globeSeed, setGlobeSeed] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAutoRotating) return;
    
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.3) % 360);
    }, 100);

    return () => clearInterval(interval);
  }, [isAutoRotating]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedCity(null);
      }
    };

    if (selectedCity) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedCity]);

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

  const globeCities = useMemo(() => {
    let availableCities = worldTimes;

    if (searchTerm.trim()) {
      availableCities = worldTimes.filter(worldTime => {
        const matchesSearch = worldTime.timezone.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             worldTime.timezone.country.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = timeFilter === 'all' || 
                             (timeFilter === 'day' && worldTime.isDaytime) ||
                             (timeFilter === 'night' && !worldTime.isDaytime);
        
        return matchesSearch && matchesFilter;
      });
      
      return availableCities;
    }

    const shuffled = shuffleArray(availableCities, globeSeed + 1000);
    const selected = shuffled.slice(0, 10);

    return selected;
  }, [worldTimes, searchTerm, timeFilter, globeSeed]);

  const { dayCities, nightCities } = useMemo(() => {
    const shuffledForDivision = shuffleArray(globeCities, globeSeed + 2000);
    const midPoint = Math.ceil(shuffledForDivision.length / 2);
    
    return {
      dayCities: shuffledForDivision.slice(0, midPoint),
      nightCities: shuffledForDivision.slice(midPoint)
    };
  }, [globeCities, globeSeed]);

  const handleCityClick = (cityId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedCity(selectedCity === cityId ? null : cityId);
    setIsAutoRotating(false);
    onCitySelect?.(cityId);
    
    setTimeout(() => setIsAutoRotating(true), 8000);
  };

  const getOrganizedPosition = (worldTime: WorldTime, index: number, isDay: boolean) => {
    const totalCities = isDay ? dayCities.length : nightCities.length;
    const baseY = isDay ? 25 : 75;
    
    const spacing = 60 / Math.max(totalCities - 1, 1);
    const startX = 20;
    const x = startX + (index * spacing);
    
    const yVariation = (index % 2) * 6 - 3;
    const y = baseY + yVariation;
    
    return {
      x: Math.min(80, Math.max(20, x)),
      y: Math.min(80, Math.max(20, y))
    };
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 relative">
      {/* Globe Container */}
      <div className="relative">
        <div className="relative aspect-square max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-full border-2 border-minimal shadow-lg overflow-visible">
          
          {/* Globe background with rotation */}
          <div 
            className="absolute inset-0 opacity-10 transition-transform duration-100 overflow-hidden rounded-full"
            style={{ transform: `rotate(${rotation * 0.2}deg)` }}
          >
            {[...Array(6)].map((_, i) => (
              <div
                key={`lat-${i}`}
                className="absolute w-full h-px bg-minimal-secondary"
                style={{ top: `${16.67 * i}%` }}
              />
            ))}
            {[...Array(8)].map((_, i) => (
              <div
                key={`lng-${i}`}
                className="absolute h-full w-px bg-minimal-secondary"
                style={{ left: `${12.5 * i}%` }}
              />
            ))}
          </div>

          {/* Day/Night divider */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
            <div className="w-full h-px bg-minimal-secondary" />
            <div className="absolute left-1/2 transform -translate-x-1/2 bg-minimal-primary border border-minimal rounded-full px-3 py-1">
              <span className="text-minimal-secondary text-xs font-medium">ECUADOR</span>
            </div>
          </div>

          {/* Day Zone */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-yellow-50/50 to-transparent dark:from-yellow-900/20 rounded-t-full overflow-hidden">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-2 bg-minimal-primary border border-minimal rounded-full px-4 py-2">
                <Sun className="w-4 h-4 text-yellow-500" />
                <span className="text-minimal-primary font-medium text-sm">ZONA DE DÍA</span>
              </div>
            </div>
          </div>

          {/* Night Zone */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-50/50 to-transparent dark:from-blue-900/20 rounded-b-full overflow-hidden">
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-2 bg-minimal-primary border border-minimal rounded-full px-4 py-2">
                <Moon className="w-4 h-4 text-blue-500" />
                <span className="text-minimal-primary font-medium text-sm">ZONA DE NOCHE</span>
              </div>
            </div>
          </div>

          {/* Day Cities */}
          <div className="absolute inset-0">
            {dayCities.map((worldTime, index) => {
              const position = getOrganizedPosition(worldTime, index, true);
              const isSelected = selectedCity === worldTime.timezone.id;
              const isHovered = hoveredCity === worldTime.timezone.id;
              
              return (
                <div key={`day-${worldTime.timezone.id}`}>
                  <button
                    onClick={(e) => handleCityClick(worldTime.timezone.id, e)}
                    onMouseEnter={() => setHoveredCity(worldTime.timezone.id)}
                    onMouseLeave={() => setHoveredCity(null)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 ${
                      isSelected ? 'scale-110 z-50' : 'scale-100 z-40'
                    }`}
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`
                    }}
                  >
                    {/* Efecto de palpitación para día */}
                    <div className="relative">
                      {/* Anillo de palpitación exterior */}
                      <div className="absolute inset-0 w-10 h-10 rounded-full bg-yellow-400/30 animate-ping" 
                           style={{ animationDuration: '2s', animationDelay: `${index * 0.3}s` }} />
                      
                      {/* Anillo de palpitación medio */}
                      <div className="absolute inset-1 w-8 h-8 rounded-full bg-orange-400/40 animate-ping" 
                           style={{ animationDuration: '1.5s', animationDelay: `${index * 0.2}s` }} />
                      
                      {/* Punto principal */}
                      <div className={`relative w-10 h-10 rounded-full border-2 border-white shadow-lg bg-gradient-to-br from-yellow-400 to-orange-500 ${
                        isSelected ? 'ring-2 ring-yellow-400' : ''
                      }`}>
                        {/* Brillo interno palpitante */}
                        <div className="absolute inset-1 rounded-full bg-yellow-300/50 animate-pulse" 
                             style={{ animationDuration: '1s' }} />
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sun className="w-5 h-5 text-white drop-shadow-sm" />
                        </div>
                        
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <div className="bg-minimal-primary border border-minimal rounded-lg px-2 py-1 shadow-sm">
                            <span className="text-minimal-primary text-xs font-medium">{worldTime.timezone.city}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Night Cities */}
          <div className="absolute inset-0">
            {nightCities.map((worldTime, index) => {
              const position = getOrganizedPosition(worldTime, index, false);
              const isSelected = selectedCity === worldTime.timezone.id;
              const isHovered = hoveredCity === worldTime.timezone.id;
              
              return (
                <div key={`night-${worldTime.timezone.id}`}>
                  <button
                    onClick={(e) => handleCityClick(worldTime.timezone.id, e)}
                    onMouseEnter={() => setHoveredCity(worldTime.timezone.id)}
                    onMouseLeave={() => setHoveredCity(null)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 ${
                      isSelected ? 'scale-110 z-50' : 'scale-100 z-40'
                    }`}
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`
                    }}
                  >
                    {/* Efecto de palpitación para noche */}
                    <div className="relative">
                      {/* Anillo de palpitación exterior */}
                      <div className="absolute inset-0 w-10 h-10 rounded-full bg-blue-400/30 animate-ping" 
                           style={{ animationDuration: '2.5s', animationDelay: `${index * 0.4}s` }} />
                      
                      {/* Anillo de palpitación medio */}
                      <div className="absolute inset-1 w-8 h-8 rounded-full bg-purple-400/40 animate-ping" 
                           style={{ animationDuration: '2s', animationDelay: `${index * 0.3}s` }} />
                      
                      {/* Punto principal */}
                      <div className={`relative w-10 h-10 rounded-full border-2 border-white shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 ${
                        isSelected ? 'ring-2 ring-blue-400' : ''
                      }`}>
                        {/* Brillo interno palpitante */}
                        <div className="absolute inset-1 rounded-full bg-blue-300/40 animate-pulse" 
                             style={{ animationDuration: '1.2s' }} />
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Moon className="w-5 h-5 text-white drop-shadow-sm" />
                        </div>
                        
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <div className="bg-minimal-primary border border-minimal rounded-lg px-2 py-1 shadow-sm">
                            <span className="text-minimal-primary text-xs font-medium">{worldTime.timezone.city}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className="flex items-center gap-2 px-4 py-2 bg-minimal-primary border border-minimal rounded-lg text-minimal-secondary hover:text-minimal-primary transition-all duration-200 shadow-sm"
          >
            {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="text-sm font-medium">{isAutoRotating ? 'Pausar' : 'Rotar'}</span>
          </button>
        </div>
      </div>

      {/* Modales laterales para puntos de día (izquierda) */}
      {hoveredCity && !selectedCity && dayCities.some(city => city.timezone.id === hoveredCity) && (
        <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-[200] pointer-events-none animate-fade-in">
          {(() => {
            const cityData = dayCities.find(city => city.timezone.id === hoveredCity);
            if (!cityData) return null;
            
            return (
              <div className="bg-minimal-primary dark:bg-gray-800 border border-minimal dark:border-gray-600 rounded-xl p-4 min-w-64 shadow-xl">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 border-b border-minimal dark:border-gray-600 pb-2">
                    <div className="w-4 h-4 rounded-full bg-yellow-400 animate-pulse" />
                    <div>
                      <h4 className="font-medium text-minimal-primary dark:text-white">{cityData.timezone.city}</h4>
                      <p className="text-minimal-secondary dark:text-gray-300 text-sm">{cityData.timezone.country}</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-mono font-semibold text-minimal-primary dark:text-white mb-1">
                      {cityData.localTime}
                    </div>
                    <div className="text-xs text-minimal-secondary dark:text-gray-400">
                      {cityData.currentTime.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Sunrise className="w-3 h-3 text-yellow-500" />
                      <span className="text-minimal-secondary dark:text-gray-300">Zona Día</span>
                    </div>
                    <div className="text-xs text-minimal-secondary dark:text-gray-400">
                      UTC{cityData.timezone.utcOffset >= 0 ? '+' : ''}{cityData.timezone.utcOffset}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Modales laterales para puntos de noche (derecha) */}
      {hoveredCity && !selectedCity && nightCities.some(city => city.timezone.id === hoveredCity) && (
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-[200] pointer-events-none animate-fade-in">
          {(() => {
            const cityData = nightCities.find(city => city.timezone.id === hoveredCity);
            if (!cityData) return null;
            
            return (
              <div className="bg-minimal-primary dark:bg-gray-800 border border-minimal dark:border-gray-600 rounded-xl p-4 min-w-64 shadow-xl">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 border-b border-minimal dark:border-gray-600 pb-2">
                    <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse" />
                    <div>
                      <h4 className="font-medium text-minimal-primary dark:text-white">{cityData.timezone.city}</h4>
                      <p className="text-minimal-secondary dark:text-gray-300 text-sm">{cityData.timezone.country}</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-mono font-semibold text-minimal-primary dark:text-white mb-1">
                      {cityData.localTime}
                    </div>
                    <div className="text-xs text-minimal-secondary dark:text-gray-400">
                      {cityData.currentTime.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Sunset className="w-3 h-3 text-blue-500" />
                      <span className="text-minimal-secondary dark:text-gray-300">Zona Noche</span>
                    </div>
                    <div className="text-xs text-minimal-secondary dark:text-gray-400">
                      UTC{cityData.timezone.utcOffset >= 0 ? '+' : ''}{cityData.timezone.utcOffset}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div className="minimal-card dark:bg-gray-800 dark:border-gray-600 rounded-xl p-6">
        <div className="flex items-center gap-4 text-minimal-primary dark:text-white mb-4">
          <Globe className="w-5 h-5 text-minimal-accent" />
          <h3 className="font-semibold text-lg">Distribución Aleatoria en el Globo</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-yellow-300/50 animate-pulse" />
              <Sun className="w-5 h-5 text-white relative z-10" />
            </div>
            <div>
              <h4 className="font-medium text-minimal-primary dark:text-white">Zona de Día</h4>
              <p className="text-minimal-secondary dark:text-gray-300 text-sm">Palpitación dorada • Modal a la izquierda</p>
              <p className="text-yellow-600 dark:text-yellow-400 text-xs font-mono">{dayCities.length} ciudades en zona día</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-blue-300/40 animate-pulse" />
              <Moon className="w-5 h-5 text-white relative z-10" />
            </div>
            <div>
              <h4 className="font-medium text-minimal-primary dark:text-white">Zona de Noche</h4>
              <p className="text-minimal-secondary dark:text-gray-300 text-sm">Palpitación azul • Modal a la derecha</p>
              <p className="text-blue-600 dark:text-blue-400 text-xs font-mono">{nightCities.length} ciudades en zona noche</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-minimal-secondary dark:text-gray-400 text-sm">
            ✨ Los puntos palpitan con colores únicos según su zona horaria asignada
          </p>
        </div>
      </div>

      {/* Selected City Modal */}
      {selectedCity && (
        <div 
          ref={modalRef}
          className="minimal-card dark:bg-gray-800 dark:border-gray-600 rounded-xl p-6 animate-slide-up border-2 border-minimal-accent"
        >
          {(() => {
            const cityData = globeCities.find(wt => wt.timezone.id === selectedCity);
            if (!cityData) return null;
            
            const isInDayZone = dayCities.some(city => city.timezone.id === selectedCity);
            
            return (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                      isInDayZone 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                        : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }`}>
                      {isInDayZone ? 
                        <Sun className="w-6 h-6 text-white" /> : 
                        <Moon className="w-6 h-6 text-white" />
                      }
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-minimal-primary dark:text-white">{cityData.timezone.city}</h3>
                      <p className="text-minimal-secondary dark:text-gray-300 text-lg">{cityData.timezone.country}</p>
                      <p className="text-minimal-secondary dark:text-gray-400 text-sm">
                        {isInDayZone ? '☀️ Zona de Día (Globo)' : '🌙 Zona de Noche (Globo)'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCity(null)}
                    className="text-minimal-secondary dark:text-gray-400 hover:text-minimal-primary dark:hover:text-white transition-colors text-xl font-bold hover:scale-110 transform duration-200"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="minimal-card dark:bg-gray-700 dark:border-gray-600 rounded-lg p-4 text-center">
                    <Clock className="w-8 h-8 text-minimal-accent mx-auto mb-3" />
                    <div className="text-3xl font-mono font-bold text-minimal-primary dark:text-white mb-2">
                      {cityData.localTime}
                    </div>
                    <div className="text-minimal-secondary dark:text-gray-300">Hora Local</div>
                    <div className="text-minimal-secondary dark:text-gray-400 text-sm mt-2">
                      {cityData.currentTime.toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  
                  <div className="minimal-card dark:bg-gray-700 dark:border-gray-600 rounded-lg p-4 text-center">
                    {isInDayZone ? 
                      <Sun className="w-8 h-8 text-yellow-500 mx-auto mb-3" /> : 
                      <Moon className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                    }
                    <div className="text-2xl font-semibold text-minimal-primary dark:text-white mb-2">
                      {isInDayZone ? 'Zona Día' : 'Zona Noche'}
                    </div>
                    <div className="text-minimal-secondary dark:text-gray-300">Posición en Globo</div>
                    <div className="text-minimal-secondary dark:text-gray-400 text-sm mt-2">
                      Asignación aleatoria
                    </div>
                  </div>
                  
                  <div className="minimal-card dark:bg-gray-700 dark:border-gray-600 rounded-lg p-4 text-center">
                    <MapPin className="w-8 h-8 text-minimal-accent mx-auto mb-3" />
                    <div className="text-2xl font-semibold text-minimal-primary dark:text-white mb-2">
                      UTC{cityData.timezone.utcOffset >= 0 ? '+' : ''}{cityData.timezone.utcOffset}
                    </div>
                    <div className="text-minimal-secondary dark:text-gray-300">Zona Horaria</div>
                    <div className="text-minimal-secondary dark:text-gray-400 text-sm mt-2">
                      {cityData.timezone.timezone}
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-minimal-secondary dark:text-gray-400 text-sm">
                    💡 Haz clic fuera de este panel para cerrarlo
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="minimal-card dark:bg-gray-800 dark:border-gray-600 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-minimal-primary dark:text-white mb-1">{globeCities.length}</div>
          <div className="text-minimal-secondary dark:text-gray-400 text-sm">Ciudades en Globo</div>
        </div>
        <div className="minimal-card dark:bg-gray-800 dark:border-gray-600 rounded-lg p-4 text-center border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sun className="w-5 h-5 text-yellow-500" />
            <span className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">{dayCities.length}</span>
          </div>
          <div className="text-yellow-600 dark:text-yellow-400 text-sm">Zona de Día</div>
        </div>
        <div className="minimal-card dark:bg-gray-800 dark:border-gray-600 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Moon className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-semibold text-blue-600 dark:text-blue-400">{nightCities.length}</span>
          </div>
          <div className="text-blue-600 dark:text-blue-400 text-sm">Zona de Noche</div>
        </div>
        <div className="minimal-card dark:bg-gray-800 dark:border-gray-600 rounded-lg p-4 text-center">
          <div className="text-2xl font-semibold text-minimal-primary dark:text-white mb-1">{Math.round(rotation)}°</div>
          <div className="text-minimal-secondary dark:text-gray-400 text-sm">Rotación del Globo</div>
        </div>
      </div>
    </div>
  );
};