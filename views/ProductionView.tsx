
import React from 'react';

const ProductionView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Production Tracking</h2>
        <p className="text-slate-500 mt-1">Monitor active print runs and manufacturer logistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-[#e8e2d9] paper-shadow">
          <h3 className="text-lg font-bold mb-4">Active Print Runs</h3>
          <div className="space-y-4">
            {[
              { id: 'RUN-2023-A', name: 'Pubquiz Ultimate UK', qty: '5,000 units', status: 'Printing', progress: 65 },
              { id: 'RUN-2023-B', name: 'Music Legends Deck', qty: '10,000 units', status: 'In Transit', progress: 100 },
            ].map((run) => (
              <div key={run.id} className="p-4 border border-[#f5f0e8] rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-slate-800">{run.name}</p>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">{run.status}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Batch: {run.id}</span>
                  <span>{run.qty}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${run.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#e8e2d9] paper-shadow">
          <h3 className="text-lg font-bold mb-4">Manufacturer Directory</h3>
          <div className="divide-y divide-[#f5f0e8]">
            {[
              { name: 'Shenzhen Fine Print Ltd.', location: 'Guangdong, CN', specialization: 'Premium Box Sets' },
              { name: 'PaperCraft Europe', location: 'Łódź, PL', specialization: 'Card Decks' },
              { name: 'EcoPack Nordics', location: 'Utrecht, NL', specialization: 'Recycled Board' },
            ].map((m, i) => (
              <div key={i} className="py-4 first:pt-0 last:pb-0">
                <p className="font-bold text-slate-800">{m.name}</p>
                <p className="text-xs text-slate-500">{m.location}</p>
                <p className="text-xs text-amber-600 mt-1 font-medium">{m.specialization}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors border-t border-[#f5f0e8]">
            Manage Partners
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductionView;
