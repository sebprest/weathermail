import { fetchWeatherApi } from "openmeteo";

const getWeatherData = async (input: {
  latitude: number;
  longitude: number;
}) => {
  const { latitude, longitude } = input;
  const params = {
    latitude: latitude,
    longitude: longitude,
    hourly: [
      "temperature_2m",
      "precipitation",
      "rain",
      "cloud_cover",
      "relative_humidity_2m",
    ],
    timezone: "auto",
    forecast_days: 1,
  };
  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  const response = responses[0];

  const hourly = response.hourly()!;
  const utcOffsetSeconds = response.utcOffsetSeconds();

  const weatherData = {
    hourly: {
      time: [
        ...Array(
          (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval()
        ),
      ].map(
        (_, i) =>
          new Date(
            (Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) *
              1000
          )
      ),
      temperature2m: hourly.variables(0)!.valuesArray()!,
      precipitation: hourly.variables(1)!.valuesArray()!,
      rain: hourly.variables(2)!.valuesArray()!,
      cloudCover: hourly.variables(3)!.valuesArray()!,
      relativeHumidity2m: hourly.variables(4)!.valuesArray()!,
    },
  };

  return weatherData;
};

export { getWeatherData };
