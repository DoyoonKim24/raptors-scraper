import Dropdown from "./Dropdown";
import { useState } from "react";

interface SearchProps {
  onDataUpdate: (data: { picks: any[], offers: any[], total: number, newSearch: boolean }) => void;
  eventId: string;
}

export default function Search({ onDataUpdate, eventId }: SearchProps) {
  const [selectedFilters, setSelectedFilters] = useState<{
    sections: string[];
    maxRow: string;
    tickets: number;
    maxPrice: number | null;
  }>({
    sections: [],
    maxRow: 'All Rows',
    tickets: 2,
    maxPrice: null
  });

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

  const rowOptions = ['All Rows', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32'];

  const ticketOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const compareRows = (row1: string, row2: string) => {
    const getRowValue = (row: string) => {
      if (/^[A-Za-z]$/.test(row)) {
        return row.toUpperCase().charCodeAt(0) - 64;
      } else if (/^\d+$/.test(row)) {
        return parseInt(row) + 100;
      } else {
        return 1000 + row.charCodeAt(0);
      }
    };
    const val1 = getRowValue(row1);
    const val2 = getRowValue(row2);
    return val1 - val2;
  };

  const handleSubmit = async () => {
    // Convert section names to codes for submission
    const sectionCodes = selectedFilters.sections.flatMap(name => {
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

    const params = new URLSearchParams("event_id=" + eventId);
    if (sectionCodes.length > 0) {
      params.append('sections', sectionCodes.map(code => `'${code}'`).join(','));
    }
    if (selectedFilters.maxPrice !== null) {
      params.append('max_price', selectedFilters.maxPrice.toString());
    }

    params.append('tickets', selectedFilters.tickets.toString());
    console.log("Submitting with params:", params.toString());

    let newSearch = true;

    try {
      let picks: any = null;
      let total = 0;
      let offset = 0;
      const limit = 40;
      
      // Keep fetching until we get all data
      while (true) {
        const currentParams = new URLSearchParams(params);
        currentParams.set('offset', offset.toString());
        
        console.log(`Fetching batch with offset ${offset}...`);
        const response = await fetch(`http://localhost:5000/seats?${currentParams.toString()}`);
        const data = await response.json();

        if (selectedFilters.maxRow === 'All Rows') {
          picks = data.picks;
          total = data.picks.length;
        } else {
          picks = data.picks.filter((pick: any) => {
            const row = pick.row;
            if (compareRows(row, selectedFilters.maxRow) <= 0) {
              total += 1;
              return pick; 
            }
          });
        }

        // Add picks from this batch
        if (data.total > 0) {
          onDataUpdate({
            picks: picks,
            offers: data._embedded.offer,
            total: total,
            newSearch: newSearch
          });
          newSearch = false;
          total = 0;
          
          // If we got less than the limit, we've reached the end
          if (data.picks.length < limit) {
            break;
          }
          
          offset += limit;
          
          // Add delay between requests to avoid rate limiting (1-2 seconds)
          if (offset < 400) { // Only continue if reasonable number of results
            console.log('Waiting 1.5 seconds before next request...');
            await new Promise(resolve => setTimeout(resolve, 1500));
          } else {
            console.log('Stopping at 200+ results to avoid detection');
            break;
          }
        } else {
          // No more picks to fetch
          break;
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="flex flex-1 min-w-0 items-center pt-16">
      <div className="flex-1 min-w-0">
        <Dropdown
          placeholder="All Sections"
          options={sectionOptions.map(option => option.name)}
          rounded="left"
          selected={selectedFilters.sections}
          setSelected={(value: string | string[]) =>
            setSelectedFilters((prev) => ({
              ...prev,
              sections: Array.isArray(value)
                ? value
                : prev.sections.includes(value)
                  ? prev.sections
                  : [...prev.sections, value],
            }))
          }
        />
      </div>
      <hr className="border border-cocoa h-6" />
      <div className="flex-1 min-w-0">
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedFilters.maxRow}
          onChange={(e) =>
            setSelectedFilters((prev) => ({
              ...prev,
              maxRow: (e.target.value)
            }))
          }
        >
          {rowOptions.map((row) => (
            <option key={row} value={row}>
              {row === 'All Rows' ? 'All Rows' : `Row ${row} and below`}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-0">
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedFilters.tickets}
          onChange={(e) =>
            setSelectedFilters((prev) => ({
              ...prev,
              tickets: parseInt(e.target.value)
            }))
          }
        >
          {ticketOptions.map((num) => (
            <option key={num} value={num}>
              {num} Ticket{num > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-0">
        <input
          type="text"
          placeholder="Max Price"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedFilters.maxPrice || ""}
          onChange={(e) =>
            setSelectedFilters((prev) => ({
              ...prev,
              maxPrice: Number(e.target.value)
            }))
          }
        />
      </div>
      <button 
        className="bg-[#AF3838] font-sweet font-semibold text-base text-white border-wine border-2 rounded-full px-6 py-3 m-2 whitespace-nowrap flex-shrink-0 disabled:opacity-50"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}
