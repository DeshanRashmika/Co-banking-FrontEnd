import React from 'react';

export default function InvestmentsChart({ holdings = [] }) {
  const data = holdings.map(h => ({
    symbol: h.symbol,
    value: (h.shares || 0) * (h.currentPrice || 0),
  }));

  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="w-full">
      {data.length === 0 ? (
        <div className="py-12 text-center text-gray-400">No data to display.</div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <svg viewBox="0 0 400 160" className="w-full md:w-3/4 h-40">
            <g transform="translate(20,10)">
              {data.map((d, i) => {
                const barWidth = 24;
                const gap = 14;
                const x = i * (barWidth + gap);
                const height = Math.max(2, (d.value / max) * 110);
                return (
                  <g key={d.symbol}>
                    <rect x={x} y={120 - height} width={barWidth} height={height} rx={6} fill="#111827" opacity={0.95} />
                    <text x={x + barWidth / 2} y={136} fontSize="10" textAnchor="middle" fill="#374151">{d.symbol}</text>
                  </g>
                );
              })}
              <line x1="0" y1="122" x2={data.length * 38} y2="122" stroke="#E5E7EB" strokeWidth="1" />
            </g>
          </svg>

          <div className="w-full md:w-1/4 bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm text-gray-500 font-medium">Portfolio Breakdown</h4>
            <ul className="mt-3 space-y-3">
              {data.map(d => (
                <li key={d.symbol} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{d.symbol}</span>
                  <span className="text-gray-500">{((d.value / total) * 100).toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
