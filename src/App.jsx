import React, { useState, useMemo, useEffect } from "react";
import { initialData } from "./data";

function App() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("vocabEntries");
    return saved ? JSON.parse(saved) : initialData;
  });

  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    localStorage.setItem("vocabEntries", JSON.stringify(entries));
  }, [entries]);

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!newKey || !newValue) return;

    setEntries((prev) => [
      {
        key: newKey,
        value: newValue,
        createdAt: filterDate,
      },
      ...prev,
    ]);

    setNewKey("");
    setNewValue("");
  };

  const groupedEntries = useMemo(() => {
    const filtered = showAll
      ? entries
      : entries.filter((e) => e.createdAt === filterDate);

    return filtered.reduce((acc, curr) => {
      acc[curr.createdAt] = acc[curr.createdAt] || [];
      acc[curr.createdAt].push(curr);
      return acc;
    }, {});
  }, [entries, filterDate, showAll]);

  const sortedDates = Object.keys(groupedEntries).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-neutral-800">
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">

        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-4xl font-serif tracking-tight">
            Vocabulary Journal
          </h1>
          <p className="text-neutral-500 text-sm leading-relaxed max-w-md">
            Words you discovered while reading the newspaper — saved calmly,
            remembered forever.
          </p>

          <div className="flex items-center gap-3 pt-4">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setShowAll(false);
              }}
              className="px-3 py-2 rounded-md border bg-white text-sm"
            />
            <button
              onClick={() => setShowAll(true)}
              className="text-sm px-4 py-2 rounded-md border bg-white hover:bg-neutral-100"
            >
              View all
            </button>
          </div>
        </header>

        {/* Add Word */}
        <section className="bg-white rounded-xl p-6 shadow-sm border">
          <form onSubmit={handleAddEntry} className="flex flex-col gap-4">
            <input
              placeholder="New word"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="text-lg font-medium px-4 py-3 border rounded-lg focus:outline-none"
            />
            <textarea
              placeholder="Meaning (in your own words)"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              rows={3}
              className="px-4 py-3 border rounded-lg text-sm resize-none focus:outline-none"
            />
            <button className="self-start px-6 py-2 bg-neutral-900 text-white rounded-lg text-sm hover:bg-neutral-800">
              Save word
            </button>
          </form>
        </section>

        {/* Entries */}
        <section className="space-y-20">
          {sortedDates.length ? (
            sortedDates.map((date) => (
              <div key={date}>

                {/* Date divider */}
                <div className="mb-10 flex items-center gap-4">
                  <div className="h-px flex-1 bg-neutral-300" />
                  <span className="text-xs uppercase tracking-widest text-neutral-500">
                    {new Date(date).toDateString()}
                  </span>
                  <div className="h-px flex-1 bg-neutral-300" />
                </div>

                {/* Key–Value list (CENTERED + STRIPED) */}
                <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-neutral-200">

                  {groupedEntries[date].map((item, i) => (
                    <div
                      key={i}
                      className={`grid grid-cols-[160px_1fr] gap-6 px-6 py-5
                        ${i % 2 === 0 ? "bg-white" : "bg-neutral-50"}
                      `}
                    >
                      {/* KEY */}
                      <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                        {item.key}
                      </div>

                      {/* VALUE */}
                      <p className="text-sm leading-7 text-neutral-700">
                        {item.value}
                      </p>
                    </div>
                  ))}

                </div>
              </div>
            ))
          ) : (
            <div className="text-neutral-400 text-center py-20">
              No words saved yet
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default App;
