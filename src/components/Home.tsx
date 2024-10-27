// Home.tsx

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FlightSearch from "./FlightSearch";

interface Itinerary {
  id: number;
  reserve_id: number;
  departure_city: string;
  arrival_city: string;
  departure_date: string;
  arrival_date: string;
  departure_time: string;
  arrival_time: string;
  flight_number: string;
  marketing_carrier: string;
  created_at: string;
  updated_at: string;
}

interface UserReservation {
  name: string;
  email: string;
  passenger_count: number;
  adult_count: number;
  child_count: number;
  baby_count: number;
  total_amount: number;
  currency: string;
  updated_at: string;
  created_at: string;
  id: number;
  itineraries: Itinerary[];
}

const Home = ({ onLogout }: { onLogout: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reservations, setReservations] = useState<UserReservation[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      onLogout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar la sesión:", error);
      toast.error("Error when closing the session");
    } finally {
      setLoading(false);
      setMenuOpen(false);
    }
  };

  const getProfileFromLocalStorage = () => {
    const profile = localStorage.getItem("user");
    return profile ? JSON.parse(profile) : null;
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const storedReservations = JSON.parse(
      localStorage.getItem("reservations") || "[]"
    );
    setReservations(storedReservations);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-800 text-white p-4 shadow fixed top-0 left-0 right-0 z-10">
        <h1 className="text-lg font-bold">
          Welcome to{" "}
          <span className="text-xl font-bold text-center text-blue-600 mb-4">
            Wellezy
          </span>
        </h1>

        {/* Profile icon */}
        <div className="relative" ref={menuRef}>
          <button onClick={toggleMenu} className="focus:outline-none">
            {/* User icon */}
            <svg
              className="h-8 w-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14.5c2.5 0 4.5-2 4.5-4.5S14.5 5.5 12 5.5 7.5 7.5 7.5 10s2 4.5 4.5 4.5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14.5c3.75 0 8 1.5 8 4.5H4c0-3 4.25-4.5 8-4.5z"
              />
            </svg>
          </button>

          {/* Drop-down menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
              <div className="py-2 px-4 text-gray-800">
                <p className="font-bold flex justify-center">Your profile:</p>
                <p className="text-sm flex gap-1">
                  <span className="font-bold text-blue-600">Name:</span>{" "}
                  {getProfileFromLocalStorage()?.name}
                </p>
                <p className="text-sm flex gap-1">
                  <span className="font-bold text-blue-600">Email:</span>{" "}
                  {getProfileFromLocalStorage()?.email}
                </p>
                <div className="overflow-y-scroll max-h-64 p-4">
                  <h3 className="text-lg font-semibold mb-4 text-blue-700">
                    Reservations
                  </h3>
                  {reservations.length === 0 ? (
                    <p>Without reservations</p>
                  ) : (
                    <ul>
                      {reservations.map((reservation) => (
                        <li
                          key={reservation.id}
                          className="border-b py-2 list-item"
                        >
                          <p>
                            Reserve to:{" "}
                            {reservation.itineraries[0].departure_date} at{" "}
                            {reservation.itineraries[0].departure_time} in{" "}
                            {reservation.itineraries[0].departure_city} with
                            Arrival to {reservation.itineraries[0].arrival_city}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="border-t flex justify-center mt-5 p-2 border-gray-200">
                <button
                  type="submit"
                  onClick={handleLogout}
                  className={`w-auto bg-blue-600 text-white py-2 px-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Closing..." : "Close session"}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Cuerpo */}
      <main className="flex-1 mt-32 bg-gray-100 p-4 overflow-auto">
        <FlightSearch />
      </main>
    </div>
  );
};

export default Home;
