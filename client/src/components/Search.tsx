import Dropdown from "./Dropdown";
import SelectDropdown from "./SelectDropdown";
import { useAbortFetch } from "../hooks/useAbortFetch";
import { SECTION_OPTIONS, ROW_OPTIONS, TICKET_OPTIONS, getSectionCodes } from "../constants/sections";
import type { SearchFilters } from "../routes/event";

interface SearchProps {
  onDataUpdate: (data: { picks: any[], offers: any[], total: number, newSearch: boolean }) => void;
  eventId: string;
  setSearchState: (state: 'idle' | 'searching' | 'searched') => void;
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
}

export default function Search({ onDataUpdate, eventId, setSearchState, searchFilters, setSearchFilters }: SearchProps) {
  const { begin } = useAbortFetch();

  const handleSubmit = async () => {
    const { signal, cleanup } = await begin();

    const sectionCodes = getSectionCodes(searchFilters.sections);

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

      setSearchState('searching');
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
          break;
        }
      }
    } catch (error) {
      // Handle error (abort will throw AbortError)
    } finally {
      setSearchState('searched');
      cleanup();
    }
  }

  return (
    <>
      {/* desktop view */}
      <div className="hidden md:flex flex-1 min-w-0 items-center gap-2">
        <div className="w-[180px]">
          <SelectDropdown
            defaultIndex={1}
            options={TICKET_OPTIONS}
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
            options={SECTION_OPTIONS.map(option => option.name)}
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
            options={ROW_OPTIONS}
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

      {/* mobile view */}
      <div className="flex md:hidden flex-col flex-1 min-w-0 items-center gap-2">
        <div className="flex w-full gap-2">
          <div className="flex-1">
            <SelectDropdown
              defaultIndex={1}
              options={TICKET_OPTIONS}
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
              options={SECTION_OPTIONS.map(option => option.name)}
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
              options={ROW_OPTIONS}
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
