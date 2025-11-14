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
        <div className="mt-8 px-4">
          <h2 className="text-xl font-bold mb-4">Found {total} tickets</h2>
          <div className="flex flex-wrap gap-4">
            {picks.map((pick, index) => {
              const offerId = pick.offerGroups[0].offers[0];
              const offer = offers.find((o: any) => o.offerId === offerId);
              
              return (
                <div key={index} className="border rounded-lg p-4 min-w-[300px]">
                  <img src={imageUrls[`${pick.section}-${pick.row}`]} alt={`View from Section ${pick.section}, Row ${pick.row}`} className="w-48 h-48 object-cover rounded-md" />
                  <div className="mb-2">
                    <h4 className="font-semibold">Section {pick.section} • Row {pick.row}</h4>
                    <p>Seats: {pick.offerGroups[0].seats.join(", ")}</p>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    ${offer?.totalPrice}
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