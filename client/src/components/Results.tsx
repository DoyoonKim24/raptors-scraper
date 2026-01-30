import type { SearchFilters } from "../routes/event";
import { getSectionCodes } from "../constants/sections";
import { useEffect, useState, useMemo } from "react";
import { validate } from "email-validator";

interface ResultsProps {
  searchResults: {
    picks: any[];
    offers: any[];
    total: number;
  };
  imageUrls: {[key: string]: string};
  searchState: 'idle' | 'searching' | 'searched';
  eventId?: string;
  eventName?: string;
  eventDate?: string;
  endTime?: string;
  searchFilters?: SearchFilters;
}

export default function Results({ searchResults, imageUrls, searchState, eventId, eventName, eventDate, endTime, searchFilters }: ResultsProps) {
  const { picks, offers, total } = searchResults;
  const [email, setEmail] = useState<string>("");
  const [notificationSet, setNotificationSet] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [notificationError, setNotificationError] = useState<string>("");

  useEffect(() => {
    if (searchState === 'searching') {
      setNotificationSet(false);
    }
  }, [searchState]);

  // Memoize offer lookup to avoid repeated .find() calls
  const offersById = useMemo(() => {
    return offers.reduce((map: Record<string, any>, offer: any) => {
      map[offer.offerId] = offer;
      return map;
    }, {});
  }, [offers]);


  const handleSetNotification = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setEmailError("");
    setNotificationError("");
    
    const sectionCodes = searchFilters?.sections ? getSectionCodes(searchFilters.sections) : [];
    
    if (!validate(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    try {
      const response = await fetch('http://127.0.0.1:5000/set-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          event_id: eventId,
          event_name: eventName,
          event_date: eventDate,
          sections: sectionCodes?.length ? sectionCodes.map(code => `'${code}'`).join(',') : null,
          max_price: searchFilters?.maxPrice,
          ticket_count: searchFilters?.tickets,
          row: searchFilters?.maxRow,
          expires: endTime
        })
      });
      
      if (response.ok) {
        console.log(response.json())
        setNotificationSet(true);
      } else {
        setNotificationError('Failed to set notification');
      }
    } catch (error) {
      console.error('Error setting notification:', error);
      setNotificationError('Error setting notification');
    }
  };
  
  return (
    <>
      {/* Show tickets */}
      {total > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Found {total} tickets {searchState === 'searching' && <span className="animate-pulse">and counting...</span>}</h2>
          <div className="flex flex-col gap-4 mb-8">
            {picks.map((pick, index) => {
              const offerId = pick.offerGroups[0].offers[0];
              const offer = offersById[offerId];
              
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

      {/* Loading Spinner */}
      {searchState === 'searching' && (
        <div className="w-full flex justify-center items-center py-4">
          <div className="animate-spin ease-linear rounded-full border-4 border-gray-300 border-t-red-600 h-8 w-8"></div>
        </div>
      )}

      {/* Landing Message */}
      {searchState !== 'searching' && total === 0 && searchState === 'idle' && (
        <div className="w-full items-center py-4">
          <p className="text-[24px] font-semibold">Set your filters and click search to find tickets!</p>
          {/* <p className="text-[24px] font-medium">Unfortunately, due to Ticketmaster’s anti-bot measures and firewall restrictions, ticket search is not available in the production version. See the demo on my <span className="text-red"><a href="https://github.com/DoyoonKim24/raptors-scraper" target="_blank" rel="noopener noreferrer">Github!</a></span></p> */}
        </div>
      )}

      {/* No Results / Notification Section */}
      {searchState === 'searched' && total === 0 && !notificationSet && (
        <div className="w-full flex flex-col justify-center items-center py-4 gap-8">
          <p className="text-lg">No tickets found for the selected criteria. Enter your email to get alerts for tickets if they become available.</p>
          <form 
            onSubmit={handleSetNotification} 
            className="flex justify-center w-full gap-4"
          >
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="border border-gray-300 rounded-lg py-2 px-4 flex-1" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-[#AA0D0D] font-medium text-base text-white rounded-full px-6 py-2 hover:bg-[#880B0B] duration-200 cursor-pointer"
            >
              Set Notification
            </button>
          </form>
          {emailError && <p className="text-red-400 text-sm">{emailError}</p>}
          {notificationError && <p className="text-red-400 text-sm">{notificationError}</p>}
        </div>
      )}

      {/* Notification Set */}
      {searchState === 'searched' && total === 0 &&  notificationSet && (
        <div className="w-full flex flex-col justify-center py-4 gap-2">
          <h6 className="text-2xl font-semibold">Notifications Set!</h6>
          <p className="text-lg">You will be notified when tickets become available. In the meantime, alter your filters to find more tickets!</p>
        </div>
      )}
    </>
  );
}