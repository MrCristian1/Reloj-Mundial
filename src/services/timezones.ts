import { TimeZone, TimeZoneAPIResponse, WorldTime } from '../types/timezone';

class TimezoneService {
  private apiKey: string;
  private baseUrl: string = 'http://api.timezonedb.com/v2.1';

  constructor() {
    // TODO: Replace with your actual TimeZoneDB API key
    // Get your API key from: https://timezonedb.com/register
    this.apiKey = '7GN2KV90V64U';
    
    if (this.apiKey === 'YOUR_TIMEZONEDB_API_KEY_HERE') {
      console.warn('⚠️ Please replace YOUR_TIMEZONEDB_API_KEY_HERE with your actual TimeZoneDB API key in src/services/timezones.ts');
    }
  }

  // Expanded cities with more global coverage
  private defaultCities: TimeZone[] = [
    // América del Norte
    {
      id: 'toronto',
      city: 'Toronto',
      country: 'Canadá',
      countryCode: 'CA',
      timezone: 'America/Toronto',
      latitude: 43.6532,
      longitude: -79.3832,
      utcOffset: -5
    },
    {
      id: 'vancouver',
      city: 'Vancouver',
      country: 'Canadá',
      countryCode: 'CA',
      timezone: 'America/Vancouver',
      latitude: 49.2827,
      longitude: -123.1207,
      utcOffset: -8
    },
    {
      id: 'newyork',
      city: 'Nueva York',
      country: 'Estados Unidos',
      countryCode: 'US',
      timezone: 'America/New_York',
      latitude: 40.7128,
      longitude: -74.0060,
      utcOffset: -5
    },
    {
      id: 'losangeles',
      city: 'Los Ángeles',
      country: 'Estados Unidos',
      countryCode: 'US',
      timezone: 'America/Los_Angeles',
      latitude: 34.0522,
      longitude: -118.2437,
      utcOffset: -8
    },
    {
      id: 'chicago',
      city: 'Chicago',
      country: 'Estados Unidos',
      countryCode: 'US',
      timezone: 'America/Chicago',
      latitude: 41.8781,
      longitude: -87.6298,
      utcOffset: -6
    },
    {
      id: 'mexico',
      city: 'Ciudad de México',
      country: 'México',
      countryCode: 'MX',
      timezone: 'America/Mexico_City',
      latitude: 19.4326,
      longitude: -99.1332,
      utcOffset: -6
    },
    
    // América del Sur
    {
      id: 'bogota',
      city: 'Bogotá',
      country: 'Colombia',
      countryCode: 'CO',
      timezone: 'America/Bogota',
      latitude: 4.7110,
      longitude: -74.0721,
      utcOffset: -5
    },
    {
      id: 'lima',
      city: 'Lima',
      country: 'Perú',
      countryCode: 'PE',
      timezone: 'America/Lima',
      latitude: -12.0464,
      longitude: -77.0428,
      utcOffset: -5
    },
    {
      id: 'buenosaires',
      city: 'Buenos Aires',
      country: 'Argentina',
      countryCode: 'AR',
      timezone: 'America/Argentina/Buenos_Aires',
      latitude: -34.6118,
      longitude: -58.3960,
      utcOffset: -3
    },
    {
      id: 'saopaulo',
      city: 'São Paulo',
      country: 'Brasil',
      countryCode: 'BR',
      timezone: 'America/Sao_Paulo',
      latitude: -23.5505,
      longitude: -46.6333,
      utcOffset: -3
    },
    {
      id: 'santiago',
      city: 'Santiago',
      country: 'Chile',
      countryCode: 'CL',
      timezone: 'America/Santiago',
      latitude: -33.4489,
      longitude: -70.6693,
      utcOffset: -3
    },
    
    // Europa
    {
      id: 'london',
      city: 'Londres',
      country: 'Reino Unido',
      countryCode: 'GB',
      timezone: 'Europe/London',
      latitude: 51.5074,
      longitude: -0.1278,
      utcOffset: 0
    },
    {
      id: 'paris',
      city: 'París',
      country: 'Francia',
      countryCode: 'FR',
      timezone: 'Europe/Paris',
      latitude: 48.8566,
      longitude: 2.3522,
      utcOffset: 1
    },
    {
      id: 'madrid',
      city: 'Madrid',
      country: 'España',
      countryCode: 'ES',
      timezone: 'Europe/Madrid',
      latitude: 40.4168,
      longitude: -3.7038,
      utcOffset: 1
    },
    {
      id: 'rome',
      city: 'Roma',
      country: 'Italia',
      countryCode: 'IT',
      timezone: 'Europe/Rome',
      latitude: 41.9028,
      longitude: 12.4964,
      utcOffset: 1
    },
    {
      id: 'berlin',
      city: 'Berlín',
      country: 'Alemania',
      countryCode: 'DE',
      timezone: 'Europe/Berlin',
      latitude: 52.5200,
      longitude: 13.4050,
      utcOffset: 1
    },
    {
      id: 'moscow',
      city: 'Moscú',
      country: 'Rusia',
      countryCode: 'RU',
      timezone: 'Europe/Moscow',
      latitude: 55.7558,
      longitude: 37.6176,
      utcOffset: 3
    },
    {
      id: 'stockholm',
      city: 'Estocolmo',
      country: 'Suecia',
      countryCode: 'SE',
      timezone: 'Europe/Stockholm',
      latitude: 59.3293,
      longitude: 18.0686,
      utcOffset: 1
    },
    
    // Asia
    {
      id: 'tokyo',
      city: 'Tokio',
      country: 'Japón',
      countryCode: 'JP',
      timezone: 'Asia/Tokyo',
      latitude: 35.6762,
      longitude: 139.6503,
      utcOffset: 9
    },
    {
      id: 'beijing',
      city: 'Pekín',
      country: 'China',
      countryCode: 'CN',
      timezone: 'Asia/Shanghai',
      latitude: 39.9042,
      longitude: 116.4074,
      utcOffset: 8
    },
    {
      id: 'mumbai',
      city: 'Bombay',
      country: 'India',
      countryCode: 'IN',
      timezone: 'Asia/Kolkata',
      latitude: 19.0760,
      longitude: 72.8777,
      utcOffset: 5.5
    },
    {
      id: 'dubai',
      city: 'Dubái',
      country: 'Emiratos Árabes Unidos',
      countryCode: 'AE',
      timezone: 'Asia/Dubai',
      latitude: 25.2048,
      longitude: 55.2708,
      utcOffset: 4
    },
    {
      id: 'seoul',
      city: 'Seúl',
      country: 'Corea del Sur',
      countryCode: 'KR',
      timezone: 'Asia/Seoul',
      latitude: 37.5665,
      longitude: 126.9780,
      utcOffset: 9
    },
    {
      id: 'singapore',
      city: 'Singapur',
      country: 'Singapur',
      countryCode: 'SG',
      timezone: 'Asia/Singapore',
      latitude: 1.3521,
      longitude: 103.8198,
      utcOffset: 8
    },
    {
      id: 'bangkok',
      city: 'Bangkok',
      country: 'Tailandia',
      countryCode: 'TH',
      timezone: 'Asia/Bangkok',
      latitude: 13.7563,
      longitude: 100.5018,
      utcOffset: 7
    },
    
    // África
    {
      id: 'cairo',
      city: 'El Cairo',
      country: 'Egipto',
      countryCode: 'EG',
      timezone: 'Africa/Cairo',
      latitude: 30.0444,
      longitude: 31.2357,
      utcOffset: 2
    },
    {
      id: 'lagos',
      city: 'Lagos',
      country: 'Nigeria',
      countryCode: 'NG',
      timezone: 'Africa/Lagos',
      latitude: 6.5244,
      longitude: 3.3792,
      utcOffset: 1
    },
    {
      id: 'capetown',
      city: 'Ciudad del Cabo',
      country: 'Sudáfrica',
      countryCode: 'ZA',
      timezone: 'Africa/Johannesburg',
      latitude: -33.9249,
      longitude: 18.4241,
      utcOffset: 2
    },
    {
      id: 'casablanca',
      city: 'Casablanca',
      country: 'Marruecos',
      countryCode: 'MA',
      timezone: 'Africa/Casablanca',
      latitude: 33.5731,
      longitude: -7.5898,
      utcOffset: 1
    },
    
    // Oceanía
    {
      id: 'sydney',
      city: 'Sídney',
      country: 'Australia',
      countryCode: 'AU',
      timezone: 'Australia/Sydney',
      latitude: -33.8688,
      longitude: 151.2093,
      utcOffset: 10
    },
    {
      id: 'melbourne',
      city: 'Melbourne',
      country: 'Australia',
      countryCode: 'AU',
      timezone: 'Australia/Melbourne',
      latitude: -37.8136,
      longitude: 144.9631,
      utcOffset: 10
    },
    {
      id: 'auckland',
      city: 'Auckland',
      country: 'Nueva Zelanda',
      countryCode: 'NZ',
      timezone: 'Pacific/Auckland',
      latitude: -36.8485,
      longitude: 174.7633,
      utcOffset: 12
    },
    {
      id: 'fiji',
      city: 'Suva',
      country: 'Fiyi',
      countryCode: 'FJ',
      timezone: 'Pacific/Fiji',
      latitude: -18.1248,
      longitude: 178.4501,
      utcOffset: 12
    }
  ];

  async getTimeByZone(zone: string): Promise<TimeZoneAPIResponse | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/get-time-zone?key=${this.apiKey}&format=json&by=zone&zone=${zone}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: TimeZoneAPIResponse = await response.json();
      
      if (data.status === 'FAILED') {
        throw new Error(data.message);
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching time for zone ${zone}:`, error);
      return null;
    }
  }

  private calculateDayPeriod(hour: number): 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night' {
    if (hour >= 5 && hour < 7) return 'dawn';
    if (hour >= 7 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 20) return 'evening';
    return 'night';
  }

  private calculateSunPosition(hour: number): number {
    // Simulate sun position (0-100) based on hour
    if (hour >= 6 && hour <= 18) {
      // Daytime: sun rises from 0 to 100 then falls back to 0
      const dayHours = hour - 6;
      const maxHours = 12;
      const progress = dayHours / maxHours;
      return Math.sin(progress * Math.PI) * 100;
    }
    return Math.max(0, Math.min(100, (hour < 6 ? hour + 24 - 18 : hour - 18) * 8.33)); // Nighttime progression
  }

  async getWorldTimes(): Promise<WorldTime[]> {
    const worldTimes: WorldTime[] = [];

    for (const timezone of this.defaultCities) {
      try {
        // For demo purposes, we'll calculate local time using JavaScript
        // In production, you should use the actual API response
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const localTime = new Date(utc + (timezone.utcOffset * 3600000));
        const hour = localTime.getHours();

        const worldTime: WorldTime = {
          timezone,
          currentTime: localTime,
          localTime: localTime.toLocaleTimeString('es-ES', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          isDaytime: hour >= 6 && hour < 20,
          dayPeriod: this.calculateDayPeriod(hour),
          sunPosition: this.calculateSunPosition(hour)
        };

        worldTimes.push(worldTime);

        // Uncomment the following to use actual API calls:
        /*
        const apiResponse = await this.getTimeByZone(timezone.timezone);
        if (apiResponse) {
          const apiDate = new Date(apiResponse.timestamp * 1000);
          const hour = apiDate.getHours();
          
          const worldTime: WorldTime = {
            timezone,
            currentTime: apiDate,
            localTime: apiResponse.formatted,
            isDaytime: hour >= 6 && hour < 20,
            dayPeriod: this.calculateDayPeriod(hour),
            sunPosition: this.calculateSunPosition(hour)
          };
          
          worldTimes.push(worldTime);
        }
        */
      } catch (error) {
        console.error(`Error processing timezone ${timezone.timezone}:`, error);
      }
    }

    return worldTimes;
  }

  getDefaultCities(): TimeZone[] {
    return this.defaultCities;
  }

  // Método para buscar ciudades
  searchCities(searchTerm: string): TimeZone[] {
    if (!searchTerm.trim()) {
      return this.defaultCities;
    }

    const term = searchTerm.toLowerCase().trim();
    return this.defaultCities.filter(city => 
      city.city.toLowerCase().includes(term) ||
      city.country.toLowerCase().includes(term) ||
      city.countryCode.toLowerCase().includes(term) ||
      city.timezone.toLowerCase().includes(term)
    );
  }
}

export const timezoneService = new TimezoneService();