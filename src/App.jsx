import { useState, useEffect } from "react";

// ─── Seed Data ────────────────────────────────────────────────────────────────

const DRIVERS = [
  { id: "d1", name: "James Okafor",   avatar: "JO", phone: "07700 900111" },
  { id: "d2", name: "Priya Mehta",    avatar: "PM", phone: "07700 900222" },
  { id: "d3", name: "Connor Walsh",   avatar: "CW", phone: "07700 900333" },
  { id: "d4", name: "Sara Lindqvist", avatar: "SL", phone: "07700 900444" },
  { id: "d5", name: "Tony Brennan",   avatar: "TB", phone: "07700 900555" },
];

const INITIAL_JOBS = [
  {
    id: "j1",
    customer: "Oliver Harrison",
    vehicle: "BMW 5 Series",
    reg: "LK23 MNP",
    colour: "Midnight Blue",
    pickupTime: "05:30",
    returnTime: "15 May, 19:00",
    zone: "Zone A – P4",
    driverId: "d1",
    flight: "BA456 LHR→JFK",
    flightDelayed: false,
    status: "complete",
    notes: "Keys in envelope at desk. Parking ticket pre-paid.",
    photos: [],
    signatureDone: false,
  },
  {
    id: "j2",
    customer: "Sophie Blackwell",
    vehicle: "Audi A4",
  2 reg: "MK72 XYZ",
    colour: "Glacier White",
    pickupTime: "06:10",
    returnTime: "12 May, 11:30",
    zone: "Zone B – P2",
    driverId: "d2",
    flight: "EZY3421 LHR→AMS",
    flightDelayed: true,
    status: "in_progress",
    notes: "Child seat in boot – leave in vehicle.",
    photos: [],
    signatureDone: false,
  },
  {
    id: "j3",
    customer: "Rajan Patel",
    vehicle: "Tesla Model 3",
    reg: "HJ22 RTY",
    colour: "Pearl Red",
    pickupTime: "07:00",
    returnTime: "20 May, 08:15",
    zone: "Zone C – P7 (EV Bay)",
    driverId: "d3",
    flight: "VS401 LHR→JFK",
    flightDelayed: false,
    status: "awaiting",
    notes: "Request EV bay. Cable in boot.",
    photos: [],
    signatureDone: false,
  },
  {
    id: "j4",
    customer: "Claire Fenton",
    vehicle: "Range Rover Sport",
    reg: "SG23 LMK",
    colour: "Santorini Black",
    pickupTime: "07:45",
    returnTime: "10 May, 14:00",
    zone: "Zone A – P1",
    driverId: "d1",
    flight: "BA117 LHR→LAX",
    flightDelayed: false,
    status: "issue",
    notes: "ISSUE: Vehicle has minor scratch on nearside door noted on intake form.",
    photos: [],
    signatureDone: false,
  },
  {
    id: "j5",
    customer: "Marcus Steele",
    vehicle: "Ford Focus",
    reg: "YP21 WQR",
    colour: "Race Red",
    pickupTime: "08:20",
    returnTime: "14 May, 22:45",
    zone: "Zone B – P3",
    driverId: "d4",
    flight: "FR1234 STN→DUB",
    flightDelayed: false,
    status: "awaiting",
    notes: "Meet at Short Stay entrance, Terminal 2.",
    photos: [],
    signatureDone: false,
  },
  {
    id: "j6",
    customer: "Emily Park",
    vehicle: "Mercedes C-Class",
    reg: "KT23 DFG",
    colour: "Selenite Grey",
    pickupTime: "09:00",
    returnTime: "11 May, 06:30",
  2 zone: "Zone D – P9",
    driverId: "d2",
    flight: "LH902 LHR→FRA",
    flightDelayed: false,
    status: "complete",
    notes: "Returning on early morning flight – priority return slot booked.",
    photos: ["photo1.jpg"],
    signatureDone: true,
  },
  {
    id: "j7",
    customer: "Ben Whitmore",
    vehicle: "Volkswagen Golf",
    reg: "AB71 CVX",
    colour: "Reflex Silver",
    pickupTime: "09:30",
    returnTime: "18 May, 17:00",
    zone: "Zone C – P5",
    driverId: "d5",
    flight: "QR7 LHR→DOH",
    flightDelayed: false,
    status: "in_progress",
    notes: "Long-stay. Wash requested on return.",
    photos: [],
    signatureDone: false,
  },
  {
    id: "j8",
    customer: "Natasha Owens",
    vehicle: "Honda CR-V",
    reg: "GL23 PKM",
    colour: "Lunar Silver",
    pickupTime: "10:15",
    returnTime: "16 May, 10:00",
    zone: "Zone A – P2",
    driverId: "d3",
    flight: "BA303 LHR→CDG",
    flightDelayed: true,
    status: "awaiting",
    notes: "Two large suitcases in boot – handle with care.",
    photos: [],
    signatureDone: false,
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  awaiting:    { label: "Awaiting Driver", color: "bg-yellow-400",  text: "text-yellow-900", border: "border-yellow-400",  ring: "ring-yellow-300",  dot: "bg-yellow-400" },
  in_progress: { label: "In Progress",     color: "bg-blue-500",    text: "text-blue-900",   border: "border-blue-500",    ring: "ring-blue-300",    dot: "bg-blue-500"   },
  complete:    { label: "Complete",         color: "bg-green-500",   text: "text-green-900",  border: "border-green-500",   ring: "ring-green-300",   dot: "bg-green-500"  },
  issue:       { label: "Issue / Delayed",  color: "bg-red-500",     text: "text-red-900",    border: "border-red-500",     ring: "ring-red-300",     dot: "bg-red-500"    },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function driverById(id) { return DRIVERS.find(d => d.id === id); }

function Avatar({ initials, size = "sm" }) {
  const sz = size === "lg" ? "w-12 h-12 text-lg" : "w-8 h-8 text-xs";
  return (
    <div className={`${sz} rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

function Badge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full bg-current opacity-70`}></span>
      {cfg.label}
    </span>
  );
}

// ─── Job Card (Dashboard) ─────────────────────────────────────────────────────

function JobCard({ job, onClick, isSelected }) {
  const cfg = STATUS_CONFIG[job.status];
  const driver = driverById(job.driverId);
  return (
    <div
      onClick={() => onClick(job)}
      className={`relative bg-white rounded-xl border-l-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${cfg.border} ${isSelected ? "ring-2 " + cfg.ring + " shadow-md" : ""}`}
    >
      {/* colour strip top */}
      <div className={`h-1 rounded-t-xl ${cfg.color} opacity-60`}></div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="font-semibold text-gray-900">{job.customer}</p>
            <p className="text-xs text-gray-500">{job.vehicle} · <span className="font-mono">{job.reg}</span></p>
          </div>
          <Badge status={job.status} />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 mt-3">
          <div><span className="text-gray-400">✈</span> {job.flight}</div>
          <div><span className="text-gray-400">📍</span> {job.zone}</div>
          <div><span className="text-gray-400">⬆</span> {job.pickupTime}</div>
          <div><span className="text-gray-400">⬇</span> {job.returnTime}</div>
        </div>

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          {driver && <Avatar initials={driver.avatar} />}
          <span className="text-xs text-gray-600">{driver?.name ?? "Unassigned"}</span>
          {job.flightDelayed && (
            <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">✈ Delayed</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Edit Panel (Dashboard) ───────────────────────────────────────────────────

function EditPanel({ job, onUpdate, onClose }) {
  const [status, setStatus] = useState(job.status);
  const [driverId, setDriverId] = useState(job.driverId);

  function save() {
    onUpdate(job.id, { status, driverId });
    onClose();
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Edit Job</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
      </div>
      <p className="text-sm font-medium text-gray-700 mb-1">{job.customer}</p>
      <p className="text-xs text-gray-500 mb-4">{job.vehicle} · {job.reg}</p>

      <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="w-full mb-4 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {Object.entries(STATUS_CONFIG).map(([k, v]) => (
          <option key={k} value={k}>{v.label}</option>
        ))}
      </select>

      <label className="block text-xs font-semibold text-gray-600 mb-1">Assign Driver</label>
      <select
        value={driverId}
        onChange={e => setDriverId(e.target.value)}
        className="w-full mb-5 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        {DRIVERS.map(d => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>

      <button
        onClick={save}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
      >
  2     Save Changes
      </button>
    </div>
  );
}

// ─── Driver Panel (Dashboard sidebar) ────────────────────────────────────────

function DriverPanel({ jobs }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h3 className="font-bold text-gray-900 mb-3 text-sm">Driver Roster</h3>
      {/* On mobile show 2-col grid; on lg+ show stacked list */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
        {DRIVERS.map(d => {
          const assigned = jobs.filter(j => j.driverId === d.id && j.status !== "complete");
          const active   = assigned.filter(j => j.status === "in_progress").length;
          return (
            <div key={d.id} className="flex items-center gap-3">
              <Avatar initials={d.avatar} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{d.name}</p>
                <p className="text-xs text-gray-500">{assigned.length} job{assigned.length !== 1 ? "s" : ""} · {active} active</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${active > 0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                {active > 0 ? "On job" : "Free"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({ jobs }) {
  const total    = jobs.length;
  const active   = jobs.filter(j => j.status === "in_progress").length;
  const complete = jobs.filter(j => j.status === "complete").length;
  const issues   = jobs.filter(j => j.status === "issue").length;
  const awaiting = jobs.filter(j => j.status === "awaiting").length;

  const stats = [
    { label: "Total Today",  value: total,    color: "text-indigo-700", bg: "bg-indigo-50" },
    { label: "Awaiting",     value: awaiting, color: "text-yellow-700", bg: "bg-yellow-50" },
    { label: "In Progress",  value: active,   color: "text-blue-700",   bg: "bg-blue-50"   },
    { label: "Completed",    value: complete, color: "text-green-700",  bg: "bg-green-50"  },
    { label: "Issues",       value: issues,   color: "text-red-700",    bg: "bg-red-50"    },
  ];

  return (
    // 2 cols on mobile → 3 cols on sm → 5 cols on md+
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-3 mb-5">
  2   {stats.map(s => (
        <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Flight Delay Banner ──────────────────────────────────────────────────────

function DelayBanner({ jobs }) {
  const delayed = jobs.filter(j => j.flightDelayed && j.status !== "complete");
  if (delayed.length === 0) return null;
  return (
    <div className="mb-4 bg-orange-50 border border-orange-300 rounded-xl px-4 py-3 flex items-start gap-3">
      <span className="text-2xl flex-shrink-0">✈️</span>
      <div>
        <p className="font-bold text-orange-800 text-sm">Flight Delay Alert</p>
        <p className="text-xs text-orange-700 mt-0.5">
          {delayed.map(j => `${j.flight} (${j.customer})`).join(" · ")} — arrival times affected. Coordinate with drivers.
        </p>
      </div>
    </div>
  );
}

// ─── Dashboard View ───────────────────────────────────────────────────────────

function DashboardView({ jobs, onUpdate }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState("all");

  const filtered = filter === "all" ? jobs : jobs.filter(j => j.status === filter);

  return (
    // Mobile: single column stack. lg+: side-by-side with fixed-width sidebar
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Main column */}
      <div className="flex-1 min-w-0">
        <DelayBanner jobs={jobs} />
        <StatsBar jobs={jobs} />

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[["all", "All Jobs"], ["awaiting", "Awaiting"], ["in_progress", "In Progress"], ["complete", "Complete"], ["issue", "Issues"]].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === k ? "bg-indigo-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
            >
            2 {l}
            </button>
          ))}
        </div>

        {/* Job grid — 1 col on mobile, 2 cols on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onClick={j => setSelected(s => s?.id === j.id ? null : j)}
              isSelected={selected?.id === job.id}
            />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-2 text-center text-gray-400 py-12">No jobs match this filter.</p>
          )}
        </div>
      </div>

      {/* Sidebar — full width below job board on mobile, fixed 288px on lg+ */}
      <div className="w-full lg:w-72 lg:flex-shrink-0 space-y-4">
        {selected && (
          <EditPanel
            job={selected}
            onUpdate={(id, patch) => {
              onUpdate(id, patch);
              setSelected(null);
            }}
            onClose={() => setSelected(null)}
          />
        )}
        <DriverPanel jobs={jobs} />
      </div>
    </div>
  );
}

// ─── Driver App View ──────────────────────────────────────────────────────────

const LOGGED_IN_DRIVER = DRIVERS[0]; // James Okafor for demo

function DriverJobCard({ job, onAction }) {
  const cfg = STATUS_CONFIG[job.status];
  const [uploading, setUploading]   = useState(false);
  const [signing, setSigning]       = useState(false);
  const [photoDone, setPhotoDone]   = useState(job.photos.length > 0);
  const [sigDone, setSigDone]       = useState(job.signatureDone);

  function handleUpload() {
    setUploading(true);
    setTimeout(() => { setUploading(false); setPhotoDone(true); }, 1800);
  }
  function handleSign() {
    setSigning(true);
    setTimeout(() => { setSigning(false); setSigDone(true); }, 1500);
  }

  return (
    <div className={`bg-white rounded-2xl border-l-4 shadow-md ${cfg.border} overflow-hidden`}>
      <div className={`${cfg.color} px-4 py-2 flex items-center justify-between`}>
        <span className={`text-xs font-bold ${cfg.text}`}>{cfg.label.toUpperCase()}</span>
        {job.flightDelayed && <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">✈ DELAYED</span>}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg">{job.customer}</h3>
        <p className="text-sm text-gray-500">{job.vehicle} · <span className="font-mono font-semibold">{job.reg}</span> · {job.colour}</p>

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-400 mb-0.5">Pickup</p>
            <p className="font-semibold">{job.pickupTime}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-400 mb-0.5">Return</p>
            <p className="font-semibold text-xs">{job.returnTime}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 col-span-2">
            <p className="text-xs text-gray-400 mb-0.5">Location / Zone</p>
            <p className="font-semibold">{job.zone}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 col-span-2">
            <p className="text-xs text-gray-400 mb-0.5">Flight</p>
            <p className="font-semibold">{job.flight}</p>
          </div>
        </div>

        {job.notes && (
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
            <p className="text-xs font-semibold text-yellow-700 mb-0.5">Notes</p>
            <p className="text-xs text-yellow-800">{job.notes}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-4 space-y-2">
     2    {job.status === "awaiting" && (
            <button
              onClick={() => onAction(job.id, "start")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow"
            >
              🚗 Start Job
           2</button>
          )}

          {job.status === "in_progress" && (
            <>
              <button
                onClick={handleUpload}
                disabled={uploading || photoDone}
                className={`w-full font-bold py-3 rounded-xl text-sm transition-colors shadow ${photoDone ? "bg-green-100 text-green-700" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
              >
                {uploading ? "Uploading…" : photoDone ? "✅ Photo Uploaded" : "📷 Upload Photo"}
              </button>
              <button
                onClick={handleSign}
              2 disabled={signing || sigDone}
                className={`w-full font-bold py-3 rounded-xl text-sm transition-colors shadow ${sigDone ? "bg-green-100 text-green-700" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
              >
                {signing ? "Opening pad…" : sigDone ? "✅ Signature Captured" : "✍️ Get Signature"}
              </button>
              <button
                onClick={() => onAction(job.id, "complete")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow"
              >
                ✔ Mark Complete
              </button>
            </>
          )}

          {job.status === "complete" && (
            <div className="text-center py-2 text-green-700 font-semibold text-sm">✅ Job complete</div>
          )}

          {job.status === "issue" && (
         2  <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow">
              🚨 Report Issue Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DriverAppView({ jobs, onAction }) {
  const myJobs = jobs.filter(j => j.driverId === LOGGED_IN_DRIVER.id);
  const active  = myJobs.filter(j => j.status !== "complete").length;

  return (
    // Full width on mobile; max-w-lg centred on desktop so it doesn't stretch too wide
    <div className="w-full max-w-lg mx-auto">
      {/* Driver header */}
      <div className="bg-indigo-700 text-white rounded-2xl p-4 mb-5 flex items-center gap-4">
        <Avatar initials={LOGGED_IN_DRIVER.avatar} size="lg" />
        <div className="min-w-0">
          <p className="font-bold text-lg truncate">{LOGGED_IN_DRIVER.name}</p>
          <p className="text-indigo-200 text-sm">{LOGGED_IN_DRIVER.phone}</p>
          <p className="text-indigo-200 text-xs">{active} active job{active !== 1 ? "s" : ""}</p>
        </div>
        <div className="ml-auto text-right flex-shrink-0">
          <p className="text-indigo-200 text-xs">Heathrow</p>
     2    <p className="font-mono text-sm">{new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
      </div>

      {myJobs.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-2">🎉</p>
          <p className="font-semibold">No jobs assigned</p>
        </div>
      )}

      <div className="space-y-4">
        {myJobs.map(job => (
          <DriverJobCard key={job.id} job={job} onAction={onAction} />
        ))}
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [jobs, setJobs]   = useState(INITIAL_JOBS);
  const [view, setView]   = useState("dashboard"); // "dashboard" | "driver"
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  function updateJob(id, patch) {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...patch } : j));
  }

  function driverAction(id, action) {
    setJobs(prev => prev.map(j => {
      if (j.id !== id) return j;
      if (action === "start")    return { ...j, status: "in_progress" };
      if (action === "complete") return { ...j, status: "complete" };
      return j;
    }));
 2 }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ´ Top nav ´ */}
      <header className="bg-indigo-800 text-white shadow-lg">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-5 py-3">
          <div className="flex items-center justify-between gap-2">

 2          {/* Logo */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xl flex-shrink-0">🅿️</span>
              <span className="font-bold text-base sm:text-xl tracking-tight">ParkingDesk</span>
              <span className="text-indigo-300 text-xs ml-1 hidden sm:inline">Heathrow</span>
            </div>

            {/* View toggle — abbreviated labels on small screens */}
            <div className="flex bg-indigo-900 rounded-lg p-0.5 flex-shrink-0">
              <button
                onClick={() => setView("dashboard")}
              2        className={`px-2 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors ${view === "dashboard" ? "bg-white text-indigo-800" : "text-indigo-300 hover:text-white"}`}
              >
                <span className="hidden sm:inline">📊 Operations</span>
               2<span className="sm:hidden">📊 Ops</span>
              </button>
              <button
                onClick={() => setView(