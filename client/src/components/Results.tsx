import type { SearchFilters } from "../routes/event";
import { useState } from "react";

interface ResultsProps {
  picks: any[];
  offers: any[];
  total: number;
  imageUrls: {[key: string]: string};
  loading?: boolean;
  searched?: boolean;
  eventId?: string;
  endTime?: string;
  searchFilters?: SearchFilters;
}

export default function Results({ picks, offers, total, imageUrls, loading, searched, eventId, endTime, searchFilters }: ResultsProps) {
  const [email, setEmail] = useState<string>("");

  const handleSetNotification = async () => {
    try {
      const response = await fetch('http://localhost:5000/set-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          event_id: eventId,
          sections: searchFilters?.sections,
          max_price: searchFilters?.maxPrice,
          ticket_count: searchFilters?.tickets,
          row: searchFilters?.maxRow,
          expires: endTime
        })
      });
      
      if (response.ok) {
        console.log(response.json())
        alert('Notification set successfully!');
      } else {
        alert('Failed to set notification');
      }
    } catch (error) {
      console.error('Error setting notification:', error);
      alert('Error setting notification');
    }
  };
  return (
    <>
      {total > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Found {total} tickets {loading && <span className="animate-pulse">and counting...</span>}</h2>
          <div className="flex flex-col gap-4">
            {picks.map((pick, index) => {
              const offerId = pick.offerGroups[0].offers[0];
              const offer = offers.find((o: any) => o.offerId === offerId);
              
              return (
                <div key={index} className="w-full flex justify-between items-center bg-grey py-2 pl-2 pr-8 rounded-lg">
                  <div className="flex items-center gap-4">
                    <img src={imageUrls[`${pick.section}-${pick.row}`]} alt={`View from Section ${pick.section}, Row ${pick.row}`} className="w-auto h-[120px] object-cover rounded-md" />
                    <div className="flex flex-col gap-1">
                      <h4 className="font-medium">Section {pick.section} • Row {pick.row}</h4>
                      <p className="text-sm">Seats: {pick.offerGroups[0].seats.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-xl font-bold">C${offer?.totalPrice} <span className="text-sm font-semibold"> ea</span></p>
                    <p className="text-xs">Fees Incl.</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {loading && (
        <div className="w-full flex justify-center items-center py-4">
          <div className="animate-spin ease-linear rounded-full border-4 border-gray-300 border-t-red-600 h-8 w-8"></div>
        </div>
      )}
      {!loading && total === 0 && searched && (
        <div className="w-full flex flex-col justify-center items-center py-4">
          <p className="text-lg">No tickets found for the selected criteria. Try adjusting your filters and searching again.</p>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="border border-gray-300 rounded-lg py-2 px-4 mb-4" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button 
            onClick={handleSetNotification}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
          >
            Set Notification
          </button>
        </div>
      )}
    </>
  );
}