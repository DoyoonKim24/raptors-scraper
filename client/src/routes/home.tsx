import Dropdown from "../components/Dropdown";
import { useState } from "react";

export default function Home() {

  const [selectedFilters, setSelectedFilters] = useState<{
    sections: string[];
    rows: string[];
    prices: number[];
  }>({
    sections: [],
    rows: [],
    prices: []
  });

  const sectionOptions = [
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

  const rowOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32'];

  const handleSubmit = async () => {
    // Convert section names to codes for submission
    const sectionCodes = selectedFilters.sections.map(name => {
      const section = sectionOptions.find(option => option.name === name);
      return section ? section.code : '';
    }).filter(code => code !== '');

    const params = new URLSearchParams();
    if (sectionCodes.length > 0) {
      params.append('sections', sectionCodes.map(code => `'${code}'`).join(','));
    }
    if (selectedFilters.prices.length > 0) {
      params.append('max_price', selectedFilters.prices[0].toString());
    }

    try {
      const response = await fetch(`http://localhost:5000/seats?${params.toString()}`);
      const data = await response.json();
      console.log("Response:", data);
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
        <Dropdown
          placeholder="All Rows"
          options={rowOptions}
          selected={selectedFilters.rows}
          setSelected={(value: string | string[]) =>
            setSelectedFilters((prev) => ({
              ...prev,
              rows: Array.isArray(value)
                ? value
                : prev.rows.includes(value)
                  ? prev.rows
                  : [...prev.rows, value],
            }))
          }
        />
      </div>
      <div className="flex-1 min-w-0">
        <input
          type="text"
          placeholder="Max Price"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedFilters.prices[0] || ""}
          onChange={(e) =>
            setSelectedFilters((prev) => ({
              ...prev,
              prices: e.target.value
                ? [Number(e.target.value)]
                : [],
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
