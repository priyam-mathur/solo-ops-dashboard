import React, { useState, useEffect, useCallback } from 'react';
import {
  CloudSun,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  Search,
  RefreshCw,
  MapPin,
  AlertCircle
} from 'lucide-react';

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity?: number;
  isDay: boolean;
}

interface WeatherWidgetProps {
  defaultCity?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ defaultCity = 'San Francisco' }) => {
  const [city, setCity] = useState<string>(defaultCity);
  const [inputCity, setInputCity] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  useEffect(() => {
    const saved = localStorage.getItem('soloops.theme');
    if (saved === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== 'soloops:themechange') return;
      const t = event.data.theme as 'light' | 'dark';
      if (t === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== 'soloops.theme') return;
      const t = event.newValue as 'light' | 'dark' | null;
      if (t === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const fetchWeather = useCallback(async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        cityName.trim()
      )}&count=1&language=en&format=json`;
      const geoRes = await fetch(geoUrl);
      if (!geoRes.ok) {
        throw new Error('Location lookup failed');
      }
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`Location "${cityName}" not found`);
      }

      const location = geoData.results[0];
      const { latitude, longitude, name, country } = location;

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`;
      const weatherRes = await fetch(weatherUrl);
      if (!weatherRes.ok) {
        throw new Error('Weather data fetch failed');
      }
      const weatherData = await weatherRes.json();
      const current = weatherData.current_weather;

      let humidityValue: number | undefined;
      if (weatherData.hourly && weatherData.hourly.relative_humidity_2m) {
        humidityValue = weatherData.hourly.relative_humidity_2m[0];
      }

      setWeather({
        city: name,
        country: country || '',
        temperature: current.temperature,
        weatherCode: current.weathercode,
        windSpeed: current.windspeed,
        humidity: humidityValue,
        isDay: current.is_day === 1
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('soloops.weather.city', name);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to load weather forecast';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let initialCity = defaultCity;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soloops.weather.city');
      if (saved) {
        initialCity = saved;
      }
    }
    setCity(initialCity);
    fetchWeather(initialCity);
  }, [defaultCity, fetchWeather]);

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      fetchWeather(inputCity.trim());
      setInputCity('');
      setIsEditing(false);
    }
  };

  const getWeatherDescription = (code: number): { text: string; icon: React.ReactNode } => {
    switch (code) {
      case 0:
        return { text: 'Clear Sky', icon: <Sun className="w-8 h-8 text-amber-500" /> };
      case 1:
      case 2:
        return { text: 'Partly Cloudy', icon: <CloudSun className="w-8 h-8 text-amber-400" /> };
      case 3:
        return { text: 'Overcast', icon: <Cloud className="w-8 h-8 text-slate-400" /> };
      case 45:
      case 48:
        return { text: 'Foggy', icon: <CloudFog className="w-8 h-8 text-slate-400" /> };
      case 51:
      case 53:
      case 55:
        return { text: 'Drizzle', icon: <CloudRain className="w-8 h-8 text-blue-400" /> };
      case 61:
      case 63:
      case 65:
        return { text: 'Rain', icon: <CloudRain className="w-8 h-8 text-blue-500" /> };
      case 71:
      case 73:
      case 75:
        return { text: 'Snow', icon: <CloudSnow className="w-8 h-8 text-sky-300" /> };
      case 80:
      case 81:
      case 82:
        return { text: 'Rain Showers', icon: <CloudRain className="w-8 h-8 text-blue-600" /> };
      case 95:
      case 96:
      case 99:
        return { text: 'Thunderstorm', icon: <CloudLightning className="w-8 h-8 text-amber-600" /> };
      default:
        return { text: 'Clear', icon: <Sun className="w-8 h-8 text-amber-500" /> };
    }
  };

  const displayTemp = (celsius: number) => {
    if (unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  return (
    <div className="h-full w-full p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm flex flex-col justify-between transition-colors">
      <div className="flex items-center justify-between pb-4 border-b border-border-light dark:border-border-dark">
        <div className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="font-semibold text-textPrimary-light dark:text-textPrimary-dark">Weather Forecast</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
            className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 text-textSecondary-light dark:text-textSecondary-dark hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            °{unit}
          </button>
          <button
            onClick={() => fetchWeather(city)}
            disabled={loading}
            aria-label="Refresh forecast"
            className="p-1.5 rounded-lg text-textMuted-light dark:text-textMuted-dark hover:text-textPrimary-light dark:hover:text-textPrimary-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="my-4">
        {isEditing ? (
          <form onSubmit={handleCitySubmit} className="flex gap-2">
            <input
              type="text"
              autoFocus
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              placeholder="Enter city name..."
              className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-textPrimary-light dark:text-textPrimary-dark focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border-light dark:border-border-dark text-textSecondary-light dark:text-textSecondary-dark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-textSecondary-light dark:text-textSecondary-dark">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">
                {weather ? `${weather.city}, ${weather.country}` : city}
              </span>
            </div>
            <button
              onClick={() => {
                setInputCity(city);
                setIsEditing(true);
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Search className="w-3 h-3" />
              Change City
            </button>
          </div>
        )}
      </div>

      {loading && !weather ? (
        <div className="py-8 flex flex-col items-center justify-center animate-pulse">
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full mb-3"></div>
          <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      ) : error ? (
        <div className="p-4 my-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-semibold text-amber-800 dark:text-amber-300">Weather API Notice</div>
            <div className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{error}</div>
            <button
              onClick={() => fetchWeather(city)}
              className="mt-2 text-xs font-medium text-amber-900 dark:text-amber-200 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        </div>
      ) : weather ? (
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="text-4xl font-extrabold tracking-tight text-textPrimary-light dark:text-textPrimary-dark">
                {displayTemp(weather.temperature)}°{unit}
              </div>
              <div className="text-sm font-medium text-textSecondary-light dark:text-textSecondary-dark mt-1">
                {getWeatherDescription(weather.weatherCode).text}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-slate-800/80">
              {getWeatherDescription(weather.weatherCode).icon}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border-light dark:border-border-dark text-xs text-textSecondary-light dark:text-textSecondary-dark">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-slate-400" />
              <span>Wind: {Math.round(weather.windSpeed)} km/h</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-slate-400" />
              <span>Humidity: {weather.humidity !== undefined ? `${weather.humidity}%` : 'Normal'}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WeatherWidget;
