import type { SearchFilters } from "../routes/event";
import { useEffect, useState } from "react";
import { validate } from "email-validator";

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
  const [notificationSet, setNotificationSet] = useState<boolean>(false);

  const sectionOptions = [
    {name: "All Sections", code: ''},
    {name: "Courtside", code: ''},
    {name: "Lower Bowl", code: ''},
    {name: "Upper Bowl", code: ''},
    {name: "Lower Sideline (center court)", code: ''},
    {name: "Lower Baseline (end zone)", code: ''},
    {name: "Upper Sideline (center court)", code: ''},
    {name: "Upper Baseline (end zone)", code: ''},
    {name: "CRTN", code: 's_217'},
    {name: "CRTE", code: 's_216'},
    {name: "CRTS", code: 's_214'},
    {name: "CRTW", code: 's_215'},
    {name: "101", code: 's_41'},
    {name: "102", code: 's_25'},
    {name: "103", code: 's_46'},
    {name: "104", code: 's_43'},
    {name: "105", code: 's_208'},
    {name: "106", code: 's_38'},
    {name: "107", code: 's_30'},
    {name: "108", code: 's_24'},
    {name: "109", code: 's_31'},
    {name: "110", code: 's_40'},
    {name: "111", code: 's_36'},
    {name: "112", code: 's_44'},
    {name: "113", code: 's_27'},
    {name: "114", code: 's_26'},
    {name: "115", code: 's_42'},
    {name: "116", code: 's_127'},
    {name: "117", code: 's_38'},
    {name: "118", code: 's_29'},
    {name: "119", code: 's_33'},
    {name: "120", code: 's_28'},
    {name: "121", code: 's_37'},
    {name: "122", code: 's_45'},
    {name: "301", code: 's_218'},
    {name: "302", code: 's_203'},
    {name: "303", code: 's_201'},
    {name: "304", code: 's_202'},
    {name: "305", code: 's_49'},
    {name: "306", code: 's_135'},
    {name: "307", code: 's_145'},
    {name: "308", code: 's_197'},
    {name: "309", code: 's_194'},
    {name: "310", code: 's_196'},
    {name: "311", code: 's_142'},
    {name: "312", code: 's_133'},
    {name: "313", code: 's_50'},
    {name: "314", code: 's_56'},
    {name: "315", code: 's_200'},
    {name: "316", code: 's_55'},
    {name: "317", code: 's_48'},
    {name: "318", code: 's_131'},
    {name: "319", code: 's_149'},
    {name: "320", code: 's_198'},
    {name: "321", code: 's_195'},
    {name: "322", code: 's_199'},
    {name: "323", code: 's_152'},
    {name: "324", code: 's_129'},
  ];

  useEffect(() => {
    if (loading) {
      setNotificationSet(false);
    }
  }, [loading]);


  const handleSetNotification = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const sectionCodes = searchFilters?.sections.flatMap((name: string) => {
      if (name === "All Sections") {
        return sectionOptions
          .filter(option => option.code !== '')
          .map(option => option.code);
      }
      if (name === "Courtside") {
        return ['s_217', 's_216', 's_214', 's_215'];
      }
      if (name === "Lower Bowl") {
        return [
          's_41', 's_25', 's_46', 's_43', 's_208', 's_38', 's_30', 's_24',
          's_31', 's_40', 's_36', 's_44', 's_27', 's_26', 's_42', 's_127',
          's_38', 's_29', 's_33', 's_28', 's_37', 's_45'
        ];
      }
      if (name === "Upper Bowl") {
        return [
          's_218', 's_203', 's_201', 's_202', 's_49', 's_135', 's_145',
          's_197', 's_194', 's_196', 's_142', 's_133', 's_50', 's_56',
          's_200', 's_55', 's_48', 's_131', 's_149', 's_198', 's_195',
          's_199', 's_152', 's_129'
        ];
      }
      if (name === "Lower Baseline (end zone)") {
        return ['s_41', 's_25', 's_46', 's_43', 's_44', 's_27', 's_36', 's_42'];
      }
      if (name === "Lower Sideline (center court)") {
        return [
          's_208', 's_38', 's_30', 's_24', 's_31', 's_40', 's_36', 
          's_127', 's_38', 's_29', 's_33', 's_28', 's_37', 's_45'
        ];
      }
      if (name === "Upper Baseline (end zone)") {
        return [
          's_218', 's_203', 's_201', 's_202', 's_49', 's_50', 's_56', 's_200', 's_55', 's_48',
        ];
      }
      if (name === "Upper Sideline (center court)") {
        return [
          's_135', 's_145', 's_197', 's_194', 's_196', 's_142', 's_133',
          's_131', 's_149', 's_198', 's_195', 's_199', 's_152', 's_129'
          
        ];
      }
      const section = sectionOptions.find(option => option.name === name);
      return section ? section.code : '';
    });
    
    if (!validate(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/set-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          event_id: eventId,
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
          <div className="flex flex-col gap-4 mb-8">
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

      {!loading && total === 0 && !searched && (
        <div className="w-full items-center py-4">
          <p className="text-[24px] font-semibold">Set your filters and click search to find tickets!</p>
        </div>
      )}
      {!loading && total === 0 && searched && !notificationSet && (
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
              className="bg-[#AA0D0D] font-medium text-base text-white rounded-full px-6 py-2 hover:bg-[#880B0B] duration-200"
            >
              Set Notification
            </button>
          </form>
        </div>
      )}
      {!loading && total === 0 && searched && notificationSet && (
        <div className="w-full flex flex-col justify-center py-4 gap-2">
          <h6 className="text-2xl font-semibold">Notifications Set!</h6>
          <p className="text-lg">You will be notified when tickets become available. In the meantime, alter your filters to find more tickets!</p>
        </div>
      )}
    </>
  );
}