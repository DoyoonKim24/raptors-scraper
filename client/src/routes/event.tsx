import Search from "../components/Search";
import Results from "../components/Results";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

export default function Event() {
  const { id } = useParams();
  const [picks, setPicks] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [sectionViews, setSectionViews] = useState<{[section: string]: any}>({});
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({});

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

  const handleDataUpdate = (data: { picks: any[], offers: any[], total: number, newSearch: boolean }) => {
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
    <div>
      <Search onDataUpdate={handleDataUpdate} />
      <Results picks={picks} offers={offers} total={total} imageUrls={imageUrls} />
    </div>
  );
}
