import React from 'react';
import { MapPin, Clock, Sun, Moon, Sunrise, Sunset, Calendar } from 'lucide-react';
import { WorldTime } from '../types/timezone';
import { formatTimeZone } from '../utils/timeUtils';

interface CityCardProps {
  worldTime: WorldTime;
  index: number;
}

export const CityCard: React.FC<CityCardProps> = ({ worldTime, index }) => {
  const { timezone, currentTime, localTime, isDaytime, dayPeriod, sunPosition } = worldTime;
  
  const getDayPeriodIcon = () => {
    switch (dayPeriod) {
      case 'dawn':
        return <Sunrise className="w-4 h-4" />;
      case 'morning':
        return <Sun className="w-4 h-4" />;
      case 'afternoon':
        return <Sun className="w-4 h-4" />;
      case 'evening':
        return <Sunset className="w-4 h-4" />;
      case 'night':
        return <Moon className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDayPeriodText = (period: string) => {
    const translations = {
      dawn: 'Amanecer',
      morning: 'Mañana',
      afternoon: 'Tarde',
      evening: 'Atardecer',
      night: 'Noche'
    };
    return translations[period as keyof typeof translations] || period;
  };

  return (
    <div
      className="minimal-card dark:bg-gray-800 dark:border-gray-600 minimal-hover rounded-xl p-6 animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-minimal-secondary dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-minimal-accent" />
          </div>
          <span className="text-sm font-medium text-minimal-secondary dark:text-gray-300">
            {timezone.country}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-minimal-secondary dark:bg-gray-700 rounded-full px-3 py-1">
          <div className={isDaytime ? 'text-yellow-500' : 'text-blue-500'}>
            {getDayPeriodIcon()}
          </div>
          <span className="text-xs font-medium text-minimal-secondary dark:text-gray-300 uppercase tracking-wide">
            {getDayPeriodText(dayPeriod)}
          </span>
        </div>
      </div>

      {/* City Name */}
      <h3 className="text-xl font-semibold text-minimal-primary dark:text-white mb-4">
        {timezone.city}
      </h3>

      {/* Time Display */}
      <div className="mb-6">
        <div className="text-3xl font-mono font-bold text-minimal-primary dark:text-white mb-2 tracking-tight">
          {localTime}
        </div>
        <div className="flex items-center gap-2 text-minimal-secondary dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {formatDate(currentTime)}
          </span>
        </div>
      </div>

      {/* Timezone Info */}
      <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-minimal-secondary dark:text-gray-400 font-medium">
          {formatTimeZone(timezone.utcOffset)}
        </span>
        <div className="flex items-center gap-2 text-minimal-secondary dark:text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{timezone.timezone.split('/')[1]}</span>
        </div>
      </div>

      {/* Day/Night Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-minimal-secondary dark:text-gray-400">
          <span>Progreso del día</span>
          <span>{Math.round(sunPosition)}%</span>
        </div>
        <div className="h-2 bg-minimal-secondary dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              isDaytime 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
                : 'bg-gradient-to-r from-blue-400 to-purple-400'
            }`}
            style={{ width: `${sunPosition}%` }}
          />
        </div>
      </div>
    </div>
  );
};