// FlightSearch.tsx

import axios from "axios";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Airport,
  PassengerCounts,
  FlightSegment,
  SegmentDetail,
} from "../common/Types";
import Loader from "../common/Loader";
import ConfirmationModal from "../common/ConfirmationModal";
import {
  fetchAirportSuggestionsService,
  fetchFlightsService,
} from "../services/FlightService";
import { useNavigate } from "react-router-dom";

const FlightSearch: React.FC = () => {
  const [departureCity, setDepartureCity] = useState<string>("");
  const [arrivalCity, setArrivalCity] = useState<string>("");
  const [departureCitySuggestions, setDepartureCitySuggestions] = useState<
    Record<string, { nameCity: string; airports: Airport[] }>
  >({});
  const [arrivalCitySuggestions, setArrivalCitySuggestions] = useState<
    Record<string, { nameCity: string; airports: Airport[] }>
  >({});
  const [selectedDepartureCity, setSelectedDepartureCity] =
    useState<Airport | null>(null);
  const [selectedArrivalCity, setSelectedArrivalCity] =
    useState<Airport | null>(null);
  const [dateTime, setDateTime] = useState<Date | null>(new Date());
  const [passengers, setPassengers] = useState<PassengerCounts>({
    adults: 1,
    children: 0,
    babies: 0,
  });

  const [flightResults, setFlightResults] = useState<
    Record<string, SegmentDetail[]>
  >({});

  const [loadingFlights, setLoadingFlights] = useState<boolean>(false);
  const [loadingDepartureSuggestions, setLoadingDepartureSuggestions] =
    useState<boolean>(false);
  const [loadingArrivalSuggestions, setLoadingArrivalSuggestions] =
    useState<boolean>(false);
  const [showResults, setShowResults] = useState(false);
  const [priceMin, setPriceMin] = useState<number>(100000);
  const [priceMax, setPriceMax] = useState<number>(10000000);

  const resultsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedResults, setPaginatedResults] = useState<SegmentDetail[]>([]);

  const [reserving, setReserving] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<SegmentDetail | null>(
    null
  );
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const departureSuggestionsRef = useRef<HTMLUListElement>(null);
  const arrivalSuggestionsRef = useRef<HTMLUListElement>(null);
  const departureDebounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const arrivalDebounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const fetchAirportSuggestions = useCallback(
    async (
      query: string,
      setSuggestions: React.Dispatch<
        React.SetStateAction<
          Record<string, { nameCity: string; airports: Airport[] }>
        >
      >,
      setLoading: React.Dispatch<React.SetStateAction<boolean>>
    ): Promise<void> => {
      setLoading(true);
      try {
        const suggestions = await fetchAirportSuggestionsService(query);
        setSuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching airport suggestions:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (departureCity.length > 2) {
      if (departureDebounceTimeout.current) {
        clearTimeout(departureDebounceTimeout.current);
      }
      departureDebounceTimeout.current = setTimeout(() => {
        fetchAirportSuggestions(
          departureCity,
          setDepartureCitySuggestions,
          setLoadingDepartureSuggestions
        );
      }, 500);
    } else {
      setDepartureCitySuggestions({});
    }
    return () => {
      if (departureDebounceTimeout.current) {
        clearTimeout(departureDebounceTimeout.current);
      }
    };
  }, [departureCity, fetchAirportSuggestions]);

  useEffect(() => {
    if (arrivalCity.length > 2) {
      if (arrivalDebounceTimeout.current) {
        clearTimeout(arrivalDebounceTimeout.current);
      }
      arrivalDebounceTimeout.current = setTimeout(() => {
        fetchAirportSuggestions(
          arrivalCity,
          setArrivalCitySuggestions,
          setLoadingArrivalSuggestions
        );
      }, 500);
    } else {
      setArrivalCitySuggestions({});
    }
    return () => {
      if (arrivalDebounceTimeout.current) {
        clearTimeout(arrivalDebounceTimeout.current);
      }
    };
  }, [arrivalCity, fetchAirportSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        departureSuggestionsRef.current &&
        !departureSuggestionsRef.current.contains(event.target as Node)
      ) {
        setDepartureCitySuggestions({});
      }
      if (
        arrivalSuggestionsRef.current &&
        !arrivalSuggestionsRef.current.contains(event.target as Node)
      ) {
        setArrivalCitySuggestions({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchFlights = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoadingFlights(true);

    const payload = {
      direct: false,
      currency: "COP",
      searchs: 100,
      class: false,
      qtyPassengers:
        passengers.adults + passengers.children + passengers.babies,
      adult: passengers.adults,
      child: passengers.children,
      baby: passengers.babies,
      seat: 0,
      itinerary: [
        {
          departureCity: selectedDepartureCity!.codeIataAirport,
          arrivalCity: selectedArrivalCity!.codeIataAirport,
          hour: dateTime!.toISOString(),
        },
      ],
    };

    try {
      const response = await fetchFlightsService(payload);

      const segments = response.data?.Seg1;

      if (!segments) {
        console.error("No se encontraron datos en la respuesta de vuelos.");
        toast.error("No available flights were found. Please try again.");
        return;
      }

      const flightsByAirline: Record<string, SegmentDetail[]> = {};

      segments.forEach((flightSegment: FlightSegment) => {
        flightSegment.segments.forEach((segment) => {
          const airline = segment.companyId.marketingCarrier;
          if (!flightsByAirline[airline]) {
            flightsByAirline[airline] = [];
          }
          flightsByAirline[airline].push(segment);
        });
      });

      setFlightResults(flightsByAirline);
      setShowResults(true);
      setCurrentPage(1);

      setPriceMin(Number(response.data.priceMin) || 100000);
      setPriceMax(Number(response.data.priceMax) || 10000000);

      toast.success("Flights found.");
    } catch (error) {
      console.error("Error al buscar vuelos:", error);
      toast.error("Error finding flights. Please try again.");
    } finally {
      setLoadingFlights(false);
    }
  };

  useEffect(() => {
    const allFlights = Object.values(flightResults).flat();
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    setPaginatedResults(allFlights.slice(startIndex, endIndex));

    setTotalPages(
      Math.ceil(Object.values(flightResults).flat().length / resultsPerPage)
    );
  }, [flightResults, currentPage]);

  useEffect(() => {
    if (showResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showResults, flightResults]);

  const getProfileFromLocalStorage = () => {
    const profile = localStorage.getItem("user");
    return profile ? JSON.parse(profile) : null;
  };

  const handleReserveFlight = async (flight: SegmentDetail) => {
    setReserving(true);

    const reservePayload = {
      name: getProfileFromLocalStorage()?.name,
      email: getProfileFromLocalStorage()?.email,
      passenger_count:
        passengers.adults + passengers.children + passengers.babies,
      adult_count: passengers.adults,
      child_count: passengers.children,
      baby_count: passengers.babies,
      total_amount: 300.5,
      currency: "USD",
      itineraries: [
        {
          departure_city: selectedDepartureCity?.nameAirport || "N/A",
          arrival_city: selectedArrivalCity?.nameAirport || "N/A",
          departure_date: flight.productDateTime.dateOfDeparture,
          arrival_date: flight.productDateTime.dateOfArrival,
          departure_time: flight.productDateTime.timeOfDeparture,
          arrival_time: flight.productDateTime.timeOfArrival,
          flight_number: flight.flightOrtrainNumber,
          marketing_carrier: flight.companyId.marketingCarrier,
        },
      ],
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/reserves`,
        reservePayload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const existingReserves = JSON.parse(
        localStorage.getItem("reservations") || "[]"
      );

      localStorage.setItem(
        "reservations",
        JSON.stringify([...existingReserves, response.data.data])
      );
    } catch (error) {
      console.error("Error al reservar el vuelo:", error);
      toast.error("Error making the reservation.");
    } finally {
      setReserving(false);
    }
  };

  const handleReserveClick = (flight: SegmentDetail) => {
    setSelectedFlight(flight);
    setShowConfirmationModal(true);
  };

  const confirmReserveFlight = async () => {
    setIsReserving(true);
    try {
      if (selectedFlight) {
        await handleReserveFlight(selectedFlight);
        setShowConfirmationModal(false);
      }

      toast.success("Reserve made successfully, redirecting...");

      setTimeout(() => {
        navigate(0);
      }, 2500);
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
      toast.error("Error making the reservation.");
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <>
      <h2 className="flex gap-2 items-center align-middle text-4xl mb-10 font-semibold">
        Find <span className="text-blue-700">flights</span> with us{" "}
        <img
          src="./src/assets/airplane.svg"
          className="ml-2"
          width={35}
          alt=""
        />
      </h2>
      <div className="w-full flex items-center">
        {/* Flight search form */}
        <form
          onSubmit={handleSearchFlights}
          className="space-y-4 w-full max-w-md mx-auto mb-8"
        >
          {/* Departure city */}
          <div className="relative flex items-center flex-col">
            <label className="block text-gray-700">Departure city</label>
            <input
              type="text"
              value={departureCity}
              onChange={(e) => {
                setDepartureCity(e.target.value);
                setSelectedDepartureCity(null);
              }}
              required
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Ingrese la ciudad de salida"
            />
            {loadingDepartureSuggestions && (
              <div className="absolute right-2 top-8">
                <Loader />
              </div>
            )}
            {Object.keys(departureCitySuggestions).length > 0 &&
              !selectedDepartureCity && (
                <ul
                  ref={departureSuggestionsRef}
                  className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-80 overflow-auto"
                >
                  {Object.entries(departureCitySuggestions).map(
                    ([key, { nameCity, airports }]) => (
                      <li key={key} className="p-2">
                        <p className="font-bold text-gray-700">{nameCity}</p>
                        <ul className="pl-4">
                          {airports.map((airport) => (
                            <li
                              key={`${airport.airportId}-${airport.codeIataAirport}`}
                              className="hover:bg-gray-200 cursor-pointer"
                              onClick={() => {
                                setSelectedDepartureCity(airport);
                                setDepartureCity(
                                  `${airport.nameAirport} (${airport.codeIataAirport})`
                                );
                                setDepartureCitySuggestions({});
                              }}
                            >
                              {airport.nameAirport} ({airport.codeIataAirport})
                              - {airport.nameCountry}
                            </li>
                          ))}
                        </ul>
                      </li>
                    )
                  )}
                </ul>
              )}
          </div>

          {/* Arrival city */}
          <div className="relative flex items-center flex-col">
            <label className="block text-gray-700">Arrival city</label>
            <input
              required
              type="text"
              value={arrivalCity}
              onChange={(e) => {
                setArrivalCity(e.target.value);
                setSelectedArrivalCity(null);
              }}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Ingrese la ciudad de llegada"
            />
            {loadingArrivalSuggestions && (
              <div className="absolute right-2 top-8">
                <Loader />
              </div>
            )}
            {Object.keys(arrivalCitySuggestions).length > 0 &&
              !selectedArrivalCity && (
                <ul
                  ref={arrivalSuggestionsRef}
                  className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-80 overflow-auto"
                >
                  {Object.entries(arrivalCitySuggestions).map(
                    ([key, { nameCity, airports }]) => (
                      <li key={key} className="p-2">
                        <p className="font-bold text-gray-700">{nameCity}</p>
                        <ul className="pl-4">
                          {airports.map((airport) => (
                            <li
                              key={`${airport.airportId}-${airport.codeIataAirport}`}
                              className="hover:bg-gray-200 cursor-pointer"
                              onClick={() => {
                                setSelectedArrivalCity(airport);
                                setArrivalCity(
                                  `${airport.nameAirport} (${airport.codeIataAirport})`
                                );
                                setArrivalCitySuggestions({});
                              }}
                            >
                              {airport.nameAirport} ({airport.codeIataAirport})
                              - {airport.nameCountry}
                            </li>
                          ))}
                        </ul>
                      </li>
                    )
                  )}
                </ul>
              )}
          </div>

          {/* Departure date */}
          <div className="flex flex-col">
            <label className="text-gray-700 flex justify-center">
              Departure date
            </label>
            <DatePicker
              required
              selected={dateTime}
              onChange={(date) => setDateTime(date)}
              className="w-full p-2 border border-gray-300 rounded"
              minDate={new Date()}
            />
          </div>

          {/* Passengers */}
          <label className="text-xl mt-5 text-blue-700 flex justify-center">
            Passengers
          </label>
          <div className="flex justify-center space-x-4">
            <div>
              <label className="block text-gray-600">Adult</label>
              <input
                type="number"
                min="1"
                value={passengers.adults}
                onChange={(e) =>
                  setPassengers({
                    ...passengers,
                    adults: parseInt(e.target.value) || 1,
                  })
                }
                className="w-20 p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-600">Children</label>
              <input
                type="number"
                min="0"
                value={passengers.children}
                onChange={(e) =>
                  setPassengers({
                    ...passengers,
                    children: parseInt(e.target.value) || 0,
                  })
                }
                className="w-20 p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-gray-600">Babies</label>
              <input
                type="number"
                min="0"
                value={passengers.babies}
                onChange={(e) =>
                  setPassengers({
                    ...passengers,
                    babies: parseInt(e.target.value) || 0,
                  })
                }
                className="w-20 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingFlights}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            {loadingFlights ? <Loader /> : "Find flights"}
          </button>
        </form>
      </div>

      {showResults && (
        <div className="absolute right-0 left-0" ref={resultsRef}>
          <div className="flex justify-center mt-10 text-2xl text-bold text-blue-900">
            <h1>Available flights</h1>
          </div>

          <ConfirmationModal
            isOpen={showConfirmationModal}
            isReserving={isReserving}
            onClose={() => setShowConfirmationModal(false)}
            onConfirm={confirmReserveFlight}
          />

          <div>
            {/* RESULTS TABLE */}
            <div className="mb-8 max-h-auto overflow-y-hidden overflo-x-scroll w-full">
              <table className="w-full border">
                <thead>
                  <tr className="bg-blue-950 text-lime-50">
                    <th className="border p-2">Airline</th>
                    <th className="border p-2">Departure time</th>
                    <th className="border p-2">Arrival time</th>
                    <th className="border p-2">Duration</th>
                    <th className="border p-2">Min-Max Price</th>
                    <th className="border p-2">Reserve</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedResults.map((flight, index) => (
                    <tr key={index} className="border-t">
                      <td className="border p-2 text-center">
                        <img
                          src={`https://pics.avs.io/60/60/${flight.companyId.marketingCarrier}.png`}
                          alt=""
                        />
                        <p className="flex justify-center">
                          {flight.companyId.marketingCarrier}
                        </p>
                      </td>
                      <td className="border p-2 text-center">
                        {flight.productDateTime.dateOfDeparture} -{" "}
                        {flight.productDateTime.timeOfDeparture}
                      </td>
                      <td className="border p-2 text-center">
                        {flight.productDateTime.dateOfArrival} -{" "}
                        {flight.productDateTime.timeOfArrival}
                      </td>
                      <td className="border p-2 text-center">
                        {flight.attributeDetail.attributeDescription}
                      </td>
                      <td className="border p-2 text-center">
                        {priceMin} - {priceMax} COP
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleReserveClick(flight)}
                          disabled={reserving}
                          className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                          {reserving ? "Reserving..." : "Reserve"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination flex justify-center items-center mt-4 mb-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-gray-200 rounded-l-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-gray-100 mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={
                  currentPage * resultsPerPage >=
                  Object.values(flightResults).flat().length
                }
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 bg-gray-200 rounded-r-md"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FlightSearch;
