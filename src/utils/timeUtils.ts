export const getDayPeriodColors = (dayPeriod: string) => {
  const colorMap = {
    dawn: {
      primary: 'from-orange-400 via-pink-400 to-purple-500',
      secondary: 'from-amber-200 to-orange-300',
      text: 'text-white',
      accent: 'bg-gradient-to-r from-orange-400 to-pink-400'
    },
    morning: {
      primary: 'from-blue-400 via-cyan-400 to-yellow-400',
      secondary: 'from-blue-200 to-cyan-200',
      text: 'text-white',
      accent: 'bg-gradient-to-r from-blue-400 to-cyan-400'
    },
    afternoon: {
      primary: 'from-yellow-400 via-orange-400 to-red-400',
      secondary: 'from-yellow-200 to-orange-200',
      text: 'text-white',
      accent: 'bg-gradient-to-r from-yellow-400 to-orange-400'
    },
    evening: {
      primary: 'from-purple-500 via-pink-500 to-red-500',
      secondary: 'from-purple-200 to-pink-300',
      text: 'text-white',
      accent: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    night: {
      primary: 'from-indigo-900 via-purple-900 to-black',
      secondary: 'from-gray-700 to-indigo-800',
      text: 'text-white',
      accent: 'bg-gradient-to-r from-indigo-600 to-purple-600'
    }
  };

  return colorMap[dayPeriod as keyof typeof colorMap] || colorMap.morning;
};

export const formatTimeZone = (utcOffset: number): string => {
  const sign = utcOffset >= 0 ? '+' : '-';
  const hours = Math.abs(Math.floor(utcOffset));
  const minutes = Math.abs((utcOffset % 1) * 60);
  return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const getLocalDateTime = (utcOffset: number): Date => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (utcOffset * 3600000));
};