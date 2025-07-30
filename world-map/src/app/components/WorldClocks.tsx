'use client';

import { useEffect, useState } from 'react';

interface City {
  name: string;
  timeZone: string;
  lat: number;
  lon: number;
}

interface WeatherData {
  icon: string;
  temp: number;
  description: string;
}

const cities: City[] = [
  { name: "New York", timeZone: "America/New_York", lat: 40.7128, lon: -74.006 },
  { name: "London", timeZone: "Europe/London", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo", timeZone: "Asia/Tokyo", lat: 35.6895, lon: 139.6917 },
  { name: "Moscow", timeZone: "Europe/Moscow", lat: 55.7558, lon: 37.6173 },
  { name: "Los Angeles", timeZone: "America/Los_Angeles", lat: 34.0522, lon: -118.2437 },
  { name: "Paris", timeZone: "Europe/Paris", lat: 48.8566, lon: 2.3522 },
];

export default function WorldClocks() {
  const [times, setTimes] = useState<Record<string, string>>({});
  const [weather, setWeather] = useState<Record<string, WeatherData>>({});

  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      const updatedTimes: Record<string, string> = {};

      cities.forEach((city) => {
        const formatter = new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: city.timeZone,
        });
        updatedTimes[city.name] = formatter.format(now);
      });

      setTimes(updatedTimes);
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      const results: Record<string, WeatherData> = {};

      await Promise.all(
        cities.map(async (city) => {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${apiKey}`;
          try {
            const res = await fetch(url);
            const data = await res.json();
            results[city.name] = {
              icon: data.weather[0].icon,
              temp: Math.round(data.main.temp),
              description: data.weather[0].main,
            };
          } catch (err) {
            console.error(`Weather error for ${city.name}:`, err);
          }
        })
      );

      setWeather(results);
    };

    fetchWeather();

    // Refresh weather every 10 minutes
    const weatherInterval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(weatherInterval);
  }, [apiKey]);

  return (
    <div className="clock-grid">
      {cities.map((city) => (
        <div key={city.name} className="clock">
          <div className="city">{city.name}</div>
          <div className="time">{times[city.name] || 'Loading...'}</div>
          <div className="weather">
            {weather[city.name] ? (
              <>
                <img
                  src={`https://openweathermap.org/img/wn/${weather[city.name].icon}@2x.png`}
                  alt={weather[city.name].description}
                  title={weather[city.name].description}
                />
                <div className="temp">{weather[city.name].temp}°C</div>
              </>
            ) : (
              'Loading weather...'
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
