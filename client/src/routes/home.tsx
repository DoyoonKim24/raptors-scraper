import { NavLink } from "react-router";
import { useState, useEffect } from "react";


export default function Home() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const url = `https://app.ticketmaster.com/discovery/v2/events.json?attractionId=K8vZ9171KC0&countryCode=CA&size=40&sort=date,asc&apikey=${import.meta.env.VITE_TICKETMASTER_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        const eventsData = data._embedded?.events ?? [];
        setEvents(eventsData);
      } catch (err) {
        console.log("Fetching events from URL:", process.env.TICKETMASTER_API_KEY);
        console.error("bro it broke:", err);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="max-w-[840px] mx-auto pt-16 px-4">
      <h1>Raptors Ticket Finder</h1>
      <h3 className="text-lg">Choose your ideal section and row for any raptors game, and get notified when tickets reach your set price point</h3>
      <div className="flex flex-col gap-4 pt-8">
        {events.map((event: any, index: number) => {
          const date = new Date(event.dates.start.dateTime);
          const monthName = date.toLocaleString("en-US", { month: "short", timeZone: "America/Toronto" });
          const dayName = date.toLocaleString("en-US", { weekday: "short", timeZone: "America/Toronto" });
          const day = date.toLocaleString("en-US", { day: "numeric", timeZone: "America/Toronto" });
          const time = date.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/Toronto" });
          
          return (
            <NavLink 
              to={`/event/${event.id}`}
              key={index}
              className="flex items-center bg-grey py-2 pl-2 pr-6 justify-between rounded-lg cursor-pointer shadow-red transition-all"
              end>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center w-16 h-16 bg-[#1F1D1E] rounded-sm">
                  <p>{monthName}</p>
                  <p className="text-xl font-medium">{day}</p>
                </div>
                <div>
                  <p>{dayName} • {time}</p>
                  <p className="text-xl font-medium"> {event.name} </p>
                </div>
              </div>
              <div className="bg-red py-2 px-4 rounded-sm font-medium"> Search Tickets </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
