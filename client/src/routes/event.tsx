import Search from "../components/Search";
import Results from "../components/Results";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { compareRows, formatEventDate } from "../utils/ticketUtils";
import sectionMap from "../images/sectionMap.png"

export interface SearchFilters {
  sections: string[];
  maxRow: string;
  tickets: number;
  maxPrice: number | null;
}

type SearchState = 'idle' | 'searching' | 'searched';

export default function Event() {
  const { id } = useParams();
  const [event, setEvent] = useState({
    id: "",
    endTime: "",
    date: "",
    title: ""
  });

  const [searchResults, setSearchResults] = useState({
    picks: [] as any[],
    offers: [] as any[],
    total: 0
  });
  const [sectionViews, setSectionViews] = useState<{[section: string]: any}>({});
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({});

  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    sections: [],
    maxRow: 'All Rows',
    tickets: 2,
    maxPrice: null
  });

  const fetchSectionViews = async (section: string) => {
    if (sectionViews[section]) return sectionViews[section];

    try {
      const response = await fetch(`https://venue.tmol.co/vvs/rest/v2/Venues/131157-58717/Views?contentUrlScheme=https&sectionName=${section}`);
      const views = await response.json();
      
      setSectionViews(prev => ({ ...prev, [section]: views }));
      return views;
    } catch (error) {
      console.error('Error fetching section views:', error);
      return null;
    }
  };

  const getImageUrlForRow = (sectionData: any, row: string) => {
    if (sectionData.views.length === 1) {
      return sectionData.views[0].content[2]?.url;
    }
    for (const view of sectionData.views) {
      const isInRange = compareRows(view.rowFrom?.name, row, view.rowTo?.name)
      if (isInRange) {
        return view.content[2]?.url;
      }
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      const picks = searchResults.picks;
      if (picks.length === 0) return;

      // Fetch section data only for sections we don't already have
      const missingSections = Array.from(
        new Set(picks.map((pick) => pick.section).filter((section) => !sectionViews[section]))
      );

      if (missingSections.length > 0) {
        await Promise.all(missingSections.map((section) => fetchSectionViews(section)));
      }

      // Generate image URLs for picks that don't have cached images yet
      const imageUpdates: { [key: string]: string } = {};
      for (const pick of picks) {
        const cacheKey = `${pick.section}-${pick.row}`;
        if (imageUrls[cacheKey]) continue;

        const sectionData = sectionViews[pick.section];
        if (!sectionData) continue;

        const url = getImageUrlForRow(sectionData, pick.row);
        if (url) {
          imageUpdates[cacheKey] = url;
        }
      }

      if (Object.keys(imageUpdates).length > 0) {
        setImageUrls((prev) => ({ ...prev, ...imageUpdates }));
      }
    };

    void loadImages();
  }, [searchResults.picks, sectionViews, imageUrls]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${import.meta.env.VITE_TICKETMASTER_API_KEY}`
        );
        const data = await res.json();
        const eventId = data.url.substring(data.url.lastIndexOf("/") + 1);
        const endTime = data.sales.public.endDateTime;
        const { monthName, dayName, day, time } = formatEventDate(data.dates.start.dateTime);
        
        setEvent({
          id: eventId,
          endTime: endTime,
          date: `${monthName} ${day} • ${dayName} • ${time}`,
          title: data.name
        });
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleDataUpdate = (data: { picks: any[], offers: any[], total: number, newSearch: boolean }) => {
    if (data.newSearch) {
      setSearchResults({
        picks: data.picks,
        offers: data.offers,
        total: data.total
      });
    } else {
      setSearchResults((prev) => {
        return {
          picks: [...prev.picks, ...data.picks],
          offers: [...prev.offers, ...data.offers],
          total: prev.total + data.total
        };
      });
    }
  };

  return (
    <div className="mx-auto pt-16 max-w-[1400px] px-4 sm:px-16 md:px-24 gap-16 flex flex-col">
      <div>
        <p className="text-lg">{event.date}</p>
        <h4 className="text-3xl sm:text-[40px] font-bold mb-4">{event.title}</h4>
        <Search 
          onDataUpdate={handleDataUpdate} 
          eventId={event.id} 
          setSearchState={setSearchState}
          searchFilters={searchFilters}
          setSearchFilters={setSearchFilters}
        />
      </div>
      <div className="flex gap-8 relative">
        <div className="flex-1">
          <Results 
            searchResults={searchResults}
            imageUrls={imageUrls} 
            searchState={searchState} 
            eventId={event.id}
            eventName={event.title}
            eventDate={event.date}
            endTime={event.endTime}
            searchFilters={searchFilters}
          />
        </div>
        <div className="hidden w-2/5 md:flex flex-col gap-2 items-center text-gray-300">
          <p className="font-semibold text-lg">Section Map</p>
          <img src={sectionMap} className="w-full h-auto object-contain" alt="Section view" />
        </div>
        
      </div>
      
    </div>
  );
}
