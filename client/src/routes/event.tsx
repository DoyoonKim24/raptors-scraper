import Search from "../components/Search";
import Results from "../components/Results";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import sectionMap from "../images/sectionMap.png"

export interface SearchFilters {
  sections: string[];
  maxRow: string;
  tickets: number;
  maxPrice: number | null;
}

export default function Event() {
  const { id } = useParams();
  const [eventId, setEventId] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const [picks, setPicks] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [sectionViews, setSectionViews] = useState<{[section: string]: any}>({});
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({});

  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);
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

  const getImageUrlForRow = (sectionData: any, row: string) => {
    if (sectionData.views.length === 1) {
      return sectionData.views[0].content[2]?.url;
    }
    for (const view of sectionData.views) {
      const isInRange = compareRows(view.rowFrom?.name, row) <= 0 && compareRows(row, view.rowTo?.name) <= 0;
      if (isInRange) {
        return view.content[2]?.url;
      }
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      // Get unique sections
      const uniqueSections = [...new Set(picks.map(pick => pick.section))];
      
      // Fetch section data for each unique section
      const sectionTasks = uniqueSections.map(async (section) => {
        const views = await fetchSectionViews(section);
        return { section, views };
      });

      const sectionResults = await Promise.all(sectionTasks);
      
      // Build a complete section data map
      const allSectionData: {[key: string]: any} = { ...sectionViews };
      sectionResults.forEach((res) => {
        if (res && res.views) {
          allSectionData[res.section] = res.views;
        }
      });

      // Generate image URLs for each pick using the complete data
      const imageUpdates: {[key: string]: string} = {};
      picks.forEach((pick) => {
        const cacheKey = `${pick.section}-${pick.row}`;
        if (!imageUrls[cacheKey]) {
          const sectionData = allSectionData[pick.section];
          if (sectionData) {
            const url = getImageUrlForRow(sectionData, pick.row);
            if (url) {
              imageUpdates[cacheKey] = url;
            }
          }
        }
      });

      // Update both section views and image URLs
      if (Object.keys(imageUpdates).length > 0) {
        setImageUrls((prev) => ({ ...prev, ...imageUpdates }));
      }
    };

    if (picks.length > 0) loadImages();
  }, [picks]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://app.ticketmaster.com/discovery/v2/events/${id}.json?apikey=${import.meta.env.VITE_TICKETMASTER_API_KEY}`
        );
        const data = await res.json();
        setEventId(data.url.substring(data.url.lastIndexOf("/") + 1));
        setEndTime(data.sales.public.endDateTime);
        const date = new Date(data.dates.start.dateTime);
        const monthName = date.toLocaleString("en-US", { month: "short", timeZone: "America/Toronto" });
        const dayName = date.toLocaleString("en-US", { weekday: "short", timeZone: "America/Toronto" });
        const day = date.toLocaleString("en-US", { day: "numeric", timeZone: "America/Toronto" });
        const time = date.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/Toronto" });
        setDate(`${monthName} ${day} • ${dayName} • ${time}`);
        setTitle(data.name);
      } catch (err) {
        console.error("bro it broke:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleDataUpdate = (data: { picks: any[], offers: any[], total: number, newSearch: boolean }) => {
    setSearched(true);
    if (data.newSearch) {
      setPicks(data.picks);
      setOffers(data.offers);
      setTotal(data.total);
    } else {
      setPicks((prevPicks) => [...prevPicks, ...data.picks]);
      setOffers((prevOffers) => {
        const newOffers = data.offers.filter(
          (newOffer) => !prevOffers.some((prevOffer) => prevOffer.offerId === newOffer.offerId)
        );
        return [...prevOffers, ...newOffers];
      });
      setTotal((prevTotal) => prevTotal + data.total);
    }
  };

  return (
    <div className="mx-auto pt-16 px-64 gap-16 flex flex-col">
      <div>
        <p className="text-lg">{date}</p>
        <h4 className="text-[40px] font-bold mb-4">{title}</h4>
        <Search 
          onDataUpdate={handleDataUpdate} 
          eventId={eventId} 
          setLoading={setLoading}
          searchFilters={searchFilters}
          setSearchFilters={setSearchFilters}
        />
      </div>
      <div className="flex gap-8 relative">
        <div className="flex-1">
          <Results 
            picks={picks} 
            offers={offers} 
            total={total} 
            imageUrls={imageUrls} 
            loading={loading} 
            searched={searched} 
            eventId={eventId}
            endTime={endTime}
            searchFilters={searchFilters}
          />
        </div>
        <div className="w-2/5 flex flex-col gap-2 items-center text-gray-300">
          <p className="font-semibold text-lg">Section Map</p>
          <img src={sectionMap} className="w-full h-auto object-contain" alt="Section view" />
        </div>
        
      </div>
      
    </div>
  );
}
