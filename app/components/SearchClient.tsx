"use client";

import { useState } from 'react';

type ViolationItem = {
  id: string;
  address: string;
  city?: string;
  state?: string;
  violationType?: string;
  openedDate?: string;
  status?: string;
  dataset?: string;
  sourceUrl?: string;
};

export default function SearchClient() {
  const [form, setForm] = useState({ address: '', city: '', state: '' });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ViolationItem[]>([]);
  const [selected, setSelected] = useState<ViolationItem | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [skiptrace, setSkiptrace] = useState<any>(null);
  const [mortgage, setMortgage] = useState<any>(null);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSelected(null);
    setResults([]);
    setImageUrl(null);
    setSkiptrace(null);
    setMortgage(null);

    try {
      const resp = await fetch('/api/violations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: form }),
      });
      const data = await resp.json();
      setResults(data.items || []);
    } catch (err) {
      console.error(err);
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  }

  async function loadDetails(item: ViolationItem) {
    setSelected(item);
    setImageUrl(null);
    setSkiptrace(null);
    setMortgage(null);

    const payload = { address: item.address, city: item.city, state: item.state };
    try {
      const [imgResp, skResp, moResp] = await Promise.all([
        fetch('/api/image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
        fetch('/api/skiptrace', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
        fetch('/api/mortgage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }),
      ]);
      const [img, sk, mo] = await Promise.all([imgResp.json(), skResp.json(), moResp.json()]);
      setImageUrl(img.url || null);
      setSkiptrace(sk || null);
      setMortgage(mo || null);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          placeholder="Address (optional)"
          className="border rounded px-3 py-2 md:col-span-2"
          value={form.address}
          onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
        />
        <input
          placeholder="City"
          className="border rounded px-3 py-2"
          required
          value={form.city}
          onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
        />
        <input
          placeholder="State (e.g., NY)"
          className="border rounded px-3 py-2"
          required
          value={form.state}
          onChange={(e) => setForm((p) => ({ ...p, state: e.target.value.toUpperCase() }))}
        />
        <button disabled={loading} className="bg-blue-600 text-white rounded px-4 py-2">
          {loading ? 'Searching?' : 'Search'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold mb-2">Results</h2>
            <ul className="divide-y border rounded">
              {results.map((r) => (
                <li key={r.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer" onClick={() => loadDetails(r)}>
                  <div className="font-medium">{r.address}</div>
                  <div className="text-sm text-slate-500">{r.violationType || 'Violation'} ? {r.openedDate || 'Date N/A'} ? {r.dataset || 'Dataset'}</div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Details</h2>
            {!selected && <div className="text-sm text-slate-500">Select a result to view details.</div>}
            {selected && (
              <div className="space-y-3">
                <div className="text-lg font-semibold">{selected.address}</div>
                {imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt="Property" className="w-full aspect-video object-cover rounded border" />
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border rounded p-3">
                    <div className="font-medium mb-1">Owner (Skip Trace)</div>
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(skiptrace, null, 2)}</pre>
                  </div>
                  <div className="border rounded p-3">
                    <div className="font-medium mb-1">Mortgage Status</div>
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(mortgage, null, 2)}</pre>
                  </div>
                </div>
                {selected.sourceUrl && (
                  <a className="text-sm text-blue-600 hover:underline" href={selected.sourceUrl} target="_blank" rel="noreferrer">Source dataset</a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
