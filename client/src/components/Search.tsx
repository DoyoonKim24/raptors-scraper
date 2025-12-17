import Dropdown from "./Dropdown";
import { useRef } from "react";
import SelectDropdown from "./SelectDropdown";
import type { SearchFilters } from "../routes/event";

interface SearchProps {
  onDataUpdate: (data: { picks: any[], offers: any[], total: number, newSearch: boolean }) => void;
  eventId: string;
  setLoading: (loading: boolean) => void;
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
}

export default function Search({ onDataUpdate, eventId, setLoading, searchFilters, setSearchFilters }: SearchProps) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const cleanupPromiseRef = useRef<Promise<void> | null>(null);

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

  const rowOptions = [
    { value: 'All Rows', label: 'All Rows' },
    { value: 'A', label: 'Row A and below' },
    { value: 'B', label: 'Row B and below' },
    { value: 'C', label: 'Row C and below' },
    { value: 'D', label: 'Row D and below' },
    { value: 'E', label: 'Row E and below' },
    { value: 'F', label: 'Row F and below' },
    { value: 'G', label: 'Row G and below' },
    { value: 'H', label: 'Row H and below' },
    { value: '1', label: 'Row 1 and below' },
    { value: '2', label: 'Row 2 and below' },
    { value: '3', label: 'Row 3 and below' },
    { value: '4', label: 'Row 4 and below' },
    { value: '5', label: 'Row 5 and below' },
    { value: '6', label: 'Row 6 and below' },
    { value: '7', label: 'Row 7 and below' },
    { value: '8', label: 'Row 8 and below' },
    { value: '9', label: 'Row 9 and below' },
    { value: '10', label: 'Row 10 and below' },
    { value: '11', label: 'Row 11 and below' },
    { value: '12', label: 'Row 12 and below' },
    { value: '13', label: 'Row 13 and below' },
    { value: '14', label: 'Row 14 and below' },
    { value: '15', label: 'Row 15 and below' },
    { value: '16', label: 'Row 16 and below' },
    { value: '17', label: 'Row 17 and below' },
    { value: '18', label: 'Row 18 and below' },
    { value: '19', label: 'Row 19 and below' },
    { value: '20', label: 'Row 20 and below' },
    { value: '21', label: 'Row 21 and below' },
    { value: '22', label: 'Row 22 and below' },
    { value: '23', label: 'Row 23 and below' },
    { value: '24', label: 'Row 24 and below' },
    { value: '25', label: 'Row 25 and below' },
    { value: '26', label: 'Row 26 and below' },
    { value: '27', label: 'Row 27 and below' },
    { value: '28', label: 'Row 28 and below' },
    { value: '29', label: 'Row 29 and below' },
    { value: '30', label: 'Row 30 and below' },
    { value: '31', label: 'Row 31 and below' },
    { value: '32', label: 'Row 32 and below' }
  ];

  const ticketOptions = [
    {value: 1, label: '1 Ticket'},
    {value: 2, label: '2 Tickets'},
    {value: 3, label: '3 Tickets'},
    {value: 4, label: '4 Tickets'},
    {value: 5, label: '5 Tickets'},
    {value: 6, label: '6 Tickets'},
    {value: 7, label: '7 Tickets'},
    {value: 8, label: '8 Tickets'},
    {value: 9, label: '9 Tickets'}
  ];

  const handleSubmit = async () => {
    // Cancel any ongoing search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Wait for previous cleanup to complete
    if (cleanupPromiseRef.current) {
      await cleanupPromiseRef.current;
    }
    
    // Create new abort controller for this search
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    let resolveCleanup: () => void;
    cleanupPromiseRef.current = new Promise<void>(resolve => {
      resolveCleanup = resolve;
    });
    
    // Cleanup function to ensure loading state is reset
    const cleanup = () => {
      setLoading(false);
      if (abortControllerRef.current) {
        abortControllerRef.current = null;
      }
      resolveCleanup();
    };

    // Convert section names to codes for submission
    const sectionCodes = searchFilters.sections.flatMap((name: string) => {
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
    if (searchFilters.maxPrice !== null) {
      params.append('max_price', searchFilters.maxPrice.toString());
    }
    if (searchFilters.maxRow !== 'All Rows') {
      params.append('max_row', searchFilters.maxRow);
    }

    params.append('tickets', searchFilters.tickets.toString());

    let newSearch = true;

    try {
      let picks: any = null;
      let total = 0;
      let offset = 0;
      const limit = 40;

      setLoading(true);
      onDataUpdate({
        picks: [],
        offers: [],
        total: 0,
        newSearch: newSearch
      });
      let last_batch = false;
      // Keep fetching until we get all data
      while (last_batch === false) {
        const currentParams = new URLSearchParams(params);
        currentParams.set('offset', offset.toString());
        
        console.log(`Fetching batch with offset ${offset}...`);
        const response = await fetch(`http://127.0.0.1:5000/seats?${currentParams.toString()}`, { signal });
        const data = await response.json();
        console.log(`Received ${data.total} picks in this batch.`);
        console.log(data);

        picks = data.picks;
        total = data.total;
        last_batch = data.last_batch;

        // Add picks from this batch
        onDataUpdate({
          picks: picks,
          offers: data._embedded.offer,
          total: total,
          newSearch: newSearch
        });
        newSearch = false;
        offset += limit;
        
        // Add delay between requests to avoid rate limiting (1-2 seconds)
        if (offset < 400) { // Only continue if reasonable number of results
          await new Promise(resolve => setTimeout(resolve, 1500));
        } else {
          cleanup();
          break;
        }
      }
    } catch (error) {
      cleanup();
    }
    cleanup();
  }

  return (
    <>
      <div className="hidden md:flex flex-1 min-w-0 items-center gap-2">
        <div className="w-[180px]">
          <SelectDropdown
            defaultIndex={1}
            options={ticketOptions}
            instanceId="ticket-select"
            onChange={(selectedOption: any) =>
              setSearchFilters({
                ...searchFilters,
                tickets: selectedOption?.value || 2
              })
            }
          />
        </div>
        <div className="w-1/4">
          <Dropdown
            placeholder="All Sections"
            options={sectionOptions.map(option => option.name)}
            selected={searchFilters.sections}
            setSelected={(value: string | string[]) =>
              setSearchFilters({
                ...searchFilters,
                sections: Array.isArray(value)
                  ? value
                  : searchFilters.sections.includes(value)
                    ? searchFilters.sections
                    : [...searchFilters.sections, value],
              })
            }
          />
        </div>
        <div className="w-[180px]">
          <SelectDropdown
            defaultIndex={0}
            options={rowOptions}
            instanceId="row-select"
            onChange={(selectedOption: any) =>
              setSearchFilters({
                ...searchFilters,
                maxRow: selectedOption?.value || 'All Rows'
              })
            }
          />
        </div>
        
        <div className="w-50 relative">
          <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${searchFilters.maxPrice ? 'block' : 'hidden'}`}>
            &le;&nbsp;&nbsp;$
          </span>
          <input
            type="text"
            placeholder="Max Price"
            className={`w-full h-9.5 border border-[#440C0C] bg-[#581d1d20] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${searchFilters.maxPrice ? 'pl-9 pr-4' : 'px-4'}`}
            value={searchFilters.maxPrice || ""}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              setSearchFilters({
                ...searchFilters,
                maxPrice: value ? Number(value) : null
              })
            }}
          />
        </div>
        <button 
          className="bg-[#AA0D0D] font-medium text-base text-white rounded-full px-6 py-2 whitespace-nowrap flex-shrink-0 disabled:opacity-50 hover:bg-[#880B0B] cursor-pointer ml-2"
          onClick={handleSubmit}
        >
          Search
        </button>
      </div>
      <div className="flex flex-col md:hidden flex-1 min-w-0 items-center gap-2">
        <div className="flex w-full gap-2">
          <div className="flex-1">
            <SelectDropdown
              defaultIndex={1}
              options={ticketOptions}
              instanceId="ticket-select"
              onChange={(selectedOption: any) =>
                setSearchFilters({
                  ...searchFilters,
                  tickets: selectedOption?.value || 2
                })
              }
            />
          </div>
          <div className="w-50 relative flex-1">
            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${searchFilters.maxPrice ? 'block' : 'hidden'}`}>
              &le;&nbsp;&nbsp;$
            </span>
            <input
              type="text"
              placeholder="Max Price"
              className={`w-full h-9.5 border border-[#440C0C] bg-[#581d1d20] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${searchFilters.maxPrice ? 'pl-9 pr-4' : 'px-4'}`}
              value={searchFilters.maxPrice || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setSearchFilters({
                  ...searchFilters,
                  maxPrice: value ? Number(value) : null
                })
              }}
            />
          </div>
        </div>
        <div className="flex w-full gap-2">
          <div className="w-[49%]">
            <Dropdown
              placeholder="All Sections"
              options={sectionOptions.map(option => option.name)}
              selected={searchFilters.sections}
              setSelected={(value: string | string[]) =>
                setSearchFilters({
                  ...searchFilters,
                  sections: Array.isArray(value)
                    ? value
                    : searchFilters.sections.includes(value)
                      ? searchFilters.sections
                      : [...searchFilters.sections, value],
                })
              }
            />
          </div>
          <div className="flex-1">
            <SelectDropdown
              defaultIndex={0}
              options={rowOptions}
              instanceId="row-select"
              onChange={(selectedOption: any) =>
                setSearchFilters({
                  ...searchFilters,
                  maxRow: selectedOption?.value || 'All Rows'
                })
              }
            />
          </div>
        </div>
        
  
        <button 
          className="bg-[#AA0D0D] font-medium text-base text-white rounded-full px-6 py-2 w-full mt-4 whitespace-nowrap flex-shrink-0 disabled:opacity-50 hover:bg-[#880B0B] cursor-pointer ml-2"
          onClick={handleSubmit}
        >
          Search
        </button>
      </div>
    </>
  );
}
