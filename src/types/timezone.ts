export interface TimeZone {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  timezone: string;
  latitude: number;
  longitude: number;
  utcOffset: number;
}

export interface WorldTime {
  timezone: TimeZone;
  currentTime: Date;
  localTime: string;
  isDaytime: boolean;
  dayPeriod: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';
  sunPosition: number; // 0-100 representing sun position in the sky
}

export interface TimeZoneAPIResponse {
  status: string;
  message: string;
  countryCode: string;
  countryName: string;
  regionName: string;
  cityName: string;
  zoneName: string;
  abbreviation: string;
  gmtOffset: number;
  dst: string;
  zoneStart: number;
  zoneEnd: number;
  nextAbbreviation: string;
  timestamp: number;
  formatted: string;
}