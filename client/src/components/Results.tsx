interface ResultsProps {
  picks: any[];
  offers: any[];
  total: number;
  imageUrls: {[key: string]: string};
}

export default function Results({ picks, offers, total, imageUrls }: ResultsProps) {
  return (
    <>
      {total > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Found {total} tickets</h2>
          <div className="flex flex-col gap-4">
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
    </>
  );
}