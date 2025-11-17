import Search from "../components/Search";
import Results from "../components/Results";
import { useState, useEffect } from "react";

export default function Home() {

  return (
    <div className="max-w-[840px] mx-auto pt-16 px-4">
      <h1>Raptors Ticket Finder</h1>
      <h3 className="text-lg">Choose your ideal section and row for any raptors game, and get notified when tickets reach your set price point</h3>

      <div 
        className="flex items-center bg-grey py-2 pl-2 pr-6 justify-between rounded-lg mt-6 cursor-pointer shadow-red transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center w-16 h-16 bg-[#1F1D1E] rounded-sm">
            <p>Nov</p>
            <p className="text-xl font-medium">7</p>
          </div>
          <div>
            <p> Mon • 7:30 pm </p>
            <p className="text-xl font-medium"> Toronto Raptors vs. Charlotte Hornets </p>
          </div>
        </div>
        <div className="bg-red py-2 px-4 rounded-sm font-medium"> Search Tickets </div>
      </div>
    </div>
  );
}
