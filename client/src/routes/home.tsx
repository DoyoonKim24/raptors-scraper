import { NavLink } from "react-router";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { formatEventDate } from "../utils/ticketUtils";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const url = `https://app.ticketmaster.com/discovery/v2/events.json?attractionId=K8vZ9171KC0&countryCode=CA&size=40&sort=date,asc&apikey=${import.meta.env.VITE_TICKETMASTER_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        const eventsData = data._embedded?.events ?? [];
        setEvents(eventsData);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="max-w-[840px] mx-auto pt-16 px-4">
      <h1 className="text-4xl sm:text-[56px]">Raptors Ticket Finder</h1>
      <h3 className="text-base sm:text-lg">
        Choose your ideal section and row for any raptors game, and get notified
        when tickets reach your set price point
      </h3>
      {loading && (
        <div className="w-full flex justify-center items-center py-8">
          <div className="animate-spin ease-linear rounded-full border-4 border-gray-300 border-t-red-600 h-8 w-8"></div>
        </div>
      )}
      {!loading && (
        <div className="flex flex-col gap-4 pt-8">
          {events.map((event: any, index: number) => {
            const { monthName, dayName, day, time } = formatEventDate(event.dates.start.dateTime);

            return (
              <NavLink
                to={`/event/${event.id}`}
                key={index}
                className="flex items-center bg-grey py-2 pl-2 pr-6 gap-2 justify-between rounded-lg cursor-pointer shadow-red transition-all"
                end
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-[#1F1D1E] rounded-sm shrink-0">
                    <p className="text-sm sm:text-base">{monthName}</p>
                    <p className="text-base sm:text-xl font-medium">{day}</p>
                  </div>
                  <div>
                    <p className="text-sm sm:text-base">
                      {dayName} • {time}
                    </p>
                    <p className="text-base sm:text-xl font-medium">
                      {" "}
                      {event.name}{" "}
                    </p>
                  </div>
                </div>

                <div className="sm:hidden flex items-center justify-center bg-red h-8 w-8 rounded-full shrink-0">
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-white fa-sm"
                  />
                </div>
                <div className="hidden sm:block text-sm sm:text-base bg-red py-2 px-4 rounded-sm font-medium">
                  {" "}
                  Search Tickets{" "}
                </div>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}
