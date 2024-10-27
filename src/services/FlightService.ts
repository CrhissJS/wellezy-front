import { Airport, City, FlightRequest, FlightResponse } from "../common/Types";
import ApiService from './ApiService';

const groupAirportsByCity = (airports: Airport[], cities: City[]) => {
  const cityGroups: Record<
    string,
    { nameCity: string; airports: Airport[] }
  > = {};

  cities.forEach((city) => {
    cityGroups[`city-${city.cityId}`] = {
      nameCity: city.nameCity,
      airports: city.new_airports || [],
    };
  });

  airports.forEach((airport) => {
    if (!cityGroups[`airport-${airport.airportId}`]) {
      cityGroups[`airport-${airport.airportId}`] = {
        nameCity: airport.nameAirport,
        airports: [airport],
      };
    }
  });

  return cityGroups;
};

export const fetchAirportSuggestionsService = async (query: string) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const response = await ApiService.post<{ airports: Airport[]; cities: City[] }>(
      '/airports',
      {},
      {
        params: { code: query },
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const airports: Airport[] = response.data.airports || [];
    const cities: City[] = response.data.cities || [];
    const suggestions = groupAirportsByCity(airports, cities);

    return suggestions;
  } catch (error) {
    console.error("Error while fetching airport suggestions:", error);
    throw new Error ("Error while fetching airport suggestions")
  }
}

export const fetchFlightsService = async (payload: FlightRequest): Promise<FlightResponse> => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const response = await ApiService.post('/flights', payload, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    return (response.data) as FlightResponse;
  } catch (error) {
    console.error("Error while fetching flights:", error);
    throw new Error ("Error while fetching flights")
  }
}