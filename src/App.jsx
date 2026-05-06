import { useState, useEffect } from "react";

const DRIVERS = [
  { id: "d1", name: "James Okafor",   avatar: "JO", phone: "07700 900111" },
  { id: "d2", name: "Priya Mehta",    avatar: "PM", phone: "07700 900222" },
  { id: "d3", name: "Connor Walsh",   avatar: "CW", phone: "07700 900333" },
  { id: "d4", name: "Sara Lindqvist", avatar: "SL", phone: "07700 900444" },
  { id: "d5", name: "Tony Brennan",   avatar: "TB", phone: "07700 900555" },
];

const JOBS = [
  { id:"j1", customer:"Oliver Harrison",  vehicle:"BMW 5 Series",      reg:"LK23 MNP", colour:"Midnight Blue",   pickup:"05:30", ret:"15 May, 19:00", zone:"Zone A – P4", driverId:"d1", flight:"BA456 LHR→JFK", delayed:false, status:"complete",    notes:"Keys in envelope at desk." },
  { id:"j2", customer:"Sophie Blackwell", vehicle:"Audi A4",           reg:"MK72 XYZ", colour:"Glacier White",   pickup:"06:10", ret:"12 May, 11:30", zone:"Zone B – P2", driverId:"d2", flight:"EZY3421 LHR→AMS", delayed:true,  status:"in_progress", notes:"Child seat in boot." },
  { id:"j3", customer:"Rajan Patel",      vehicle:"Tesla Model 3",     reg:"HJ22 RTY", colour:"Pearl Red",       pickup:"07:00", ret:"20 May, 08:15", zone:"Zone C – P7 (EV)", driverId:"d3", flight:"VS401 LHR→JFK",  delayed:false, status:"awaiting",    notes:"Request EV bay." },
  { id:"j4", customer:"Claire Fenton",    vehicle:"Range Rover Sport",  reg:"SG23 LMK", colour:"Santorini Black", pickup:"07:45", ret:"10 May, 14:00", zone:"Zone A – P1", driverId:"d1", flight:"BA117 LHR→LAX",  delayed:false, status:"issue",       notes:"ISSUE: Minor scratch on nearside door." },
  { id:"j5", customer:"Marcus Steele",    vehicle:"Ford Focus",         reg:"YP21 WQR", colour:"Race Red",        pickup:"08:20", ret:"14 May, 22:45", zone:"Zone B – P3", driverId:"d4", flight:"FR1234 STN→DUB", delayed:false, status:"awaiting",    notes:"Meet at Short Stay entrance." },
  { id:"j6", customer:"Emily Park",       vehicle:"Mercedes C-Class",   reg:"KT23 DFG", colour:"Selenite Grey",   pickup:"09:00", ret:"11 May, 06:30", zone:"Zone D – P9", driverId:"d2", flight:"LH902 LHR→FRA",  delayed:false, status:"complete",    notes:"Priority return slot booked." },
  { id:"j7", customer:"Ben Whitmore",     vehicle:"Volkswagen Golf",    reg:"AB71 CVX", colour:"Reflex Silver",   pickup:"09:30", ret:"18 May, 17:00", zone:"Zone C – P5", driverId:"d5", flight:"QR7 LHR→DOH",    delayed:false, status:"in_progress", notes:"Long-stay. Wash requested." },
  { id:"j8", customer:"Natasha Owens",    vehicle:"Honda CR-V",         reg:"GL23 PKM", colour:"Lunar Silver",    pickup:"10:15", ret:"16 May, 10:00", zone:"Zone A – P2", driverId:"d3", flight:"BA303 LHR→CDG",  delayed:true,  status:"awaiting",    notes:"Two large suitcases in boot." },
];

const STATUS = {
  awaiting:    { label:"Awaiting",     color:"bg-yellow-100 text-yellow-800", bar:"bg-yellow-400", border:"border-yellow-400" },
  in_progress: { label:"In Progress",  color:"bg-blue-100 text-blue-800",    bar:"bg-blue-500",   border:"border-blue-500" },
  complete:    { label:"Complete",     color:"bg-green-100 text-green-800",  bar:"bg-green-500",  border:"border-green-500" },
  issue:       { label:"Issue",        color:"bg-red-100 text-red-800",      bar:"bg-red-500",    border:"border-red-500" },
};

function Avatar({ initials, lg }) {
  return (
    <div className={`${lg ? "w-12 h-12 text-base" : "w-8 h-8 text-xs"} rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

function Badge({ status }) {
  const s = STATUS[status];
  return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>{s.label}</span>;
}

function JobCard({ job, onClick, selected }) {
  const s = STATUS[job.status];
  const driver = DRIVERS.find(d => d.id === job.driverId);
  return (
    <div onClick={() => onClick(job)} className={`bg-white rounded-xl border-l-4 shadow-sm cursor-pointer ${s.border} ${selected ? "ring-2 ring-indigo-400" : ""}`}>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate">{job.customer}</p>
            <p className="text-xs text-gray-500 truncate">{job.vehicle} · <span className="font-mono">{job.reg}</span></p>
          </div>
          <Badge status={job.status} />
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs text-gray-600 mb-2">
          <span>✈ {job.flight}</span>
          <span>📍 {job.zone}</span>
          <span>⬆ {job.pickup}</span>
          <span>⬇ {job.ret}</span>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <Avatar initials={driver?.avatar || "?"} />
          <span className="text-xs text-gray-500">{driver?.name ?? "Unassigned"}</span>
          {job.delayed && <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">⚠ Delayed</span>}
        </div>
      </div>
    </div>
  );
}

function EditPanel({ job, onSave, onClose }) {
  const [status, setStatus] = useState(job.status);
  const [driverId, setDriverId] = useState(job.driverId);
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900">Edit Job</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
      </div>
      <p className="text-sm font-medium text-gray-700">{job.customer}</p>
      <p className="text-xs text-gray-500 mb-3">{job.vehicle} · {job.reg}</p>
      <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
      <select value={status} onChange={e => setStatus(e.target.value)} className="w-full mb-3 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
        {Object.entries(STATUS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
      </select>
      <label className="block text-xs font-semibold text-gray-600 mb-1">Driver</label>
      <select value={driverId} onChange={e => setDriverId(e.target.value)} className="w-full mb-4 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
        {DRIVERS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>
      <button onClick={() => { onSave(job.id, { status, driverId }); onClose(); }} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg text-sm">Save Changes</button>
    </div>
  );
}

function DashboardView({ jobs, onUpdate }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? jobs : jobs.filter(j => j.status === filter);
  const counts = { total: jobs.length, awaiting: jobs.filter(j=>j.status==="awaiting").length, in_progress: jobs.filter(j=>j.status==="in_progress").length, complete: jobs.filter(j=>j.status==="complete").length, issue: jobs.filter(j=>j.status==="issue").length };

  return (
    <div>
      {/* Stats — 2 cols mobile, 5 cols md+ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
        {[["Total","total","bg-indigo-50 text-indigo-700"],["Awaiting","awaiting","bg-yellow-50 text-yellow-700"],["Active","in_progress","bg-blue-50 text-blue-700"],["Done","complete","bg-green-50 text-green-700"],["Issues","issue","bg-red-50 text-red-700"]].map(([label,key,cls])=>(
          <div key={key} className={`${cls} rounded-xl p-3 text-center`}>
            <p className="text-2xl font-bold">{counts[key]}</p>
            <p className="text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Delayed banner */}
      {jobs.some(j=>j.delayed && j.status!=="complete") && (
        <div className="mb-4 bg-orange-50 border border-orange-300 rounded-xl px-3 py-2 flex gap-2 items-start">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-bold text-orange-800 text-sm">Flight Delay Alert</p>
            <p className="text-xs text-orange-700">{jobs.filter(j=>j.delayed&&j.status!=="complete").map(j=>`${j.flight} (${j.customer})`).join(" · ")}</p>
          </div>
        </div>
      )}

      {/* Main layout: stacked on mobile, side-by-side on lg+ */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Job board */}
        <div className="flex-1 min-w-0">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {[["all","All"],["awaiting","Awaiting"],["in_progress","Active"],["complete","Done"],["issue","Issues"]].map(([k,l])=>(
              <button key={k} onClick={()=>setFilter(k)} className={`px-3 py-1 rounded-lg text-xs font-semibold ${filter===k?"bg-indigo-600 text-white":"bg-white text-gray-600 border border-gray-200"}`}>{l}</button>
            ))}
          </div>
          {/* Job grid — 1 col mobile, 2 cols lg+ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map(job => (
              <JobCard key={job.id} job={job} selected={selected?.id===job.id} onClick={j=>setSelected(s=>s?.id===j.id?null:j)} />
            ))}
            {filtered.length===0 && <p className="text-center text-gray-400 py-8 col-span-2">No jobs match this filter.</p>}
          </div>
        </div>

        {/* Sidebar — full width below on mobile, fixed 272px on lg+ */}
        <div className="w-full lg:w-68 lg:flex-shrink-0 space-y-3">
          {selected && (
            <EditPanel job={selected} onSave={(id,patch)=>{onUpdate(id,patch);setSelected(null);}} onClose={()=>setSelected(null)} />
          )}
          {/* Driver roster */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Driver Roster</h3>
            {/* 2-col grid on mobile, stacked on lg+ */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {DRIVERS.map(d => {
                const active = jobs.filter(j=>j.driverId===d.id&&j.status==="in_progress").length;
                const assigned = jobs.filter(j=>j.driverId===d.id&&j.status!=="complete").length;
                return (
                  <div key={d.id} className="flex items-center gap-2">
                    <Avatar initials={d.avatar} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{d.name}</p>
                      <p className="text-xs text-gray-500">{assigned} job{assigned!==1?"s":""} · {active} active</p>
                    </div>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${active>0?"bg-blue-100 text-blue-700":"bg-gray-100 text-gray-500"}`}>{active>0?"On job":"Free"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ME = DRIVERS[0];

function DriverView({ jobs, onAction }) {
  const myJobs = jobs.filter(j => j.driverId === ME.id);
  const active = myJobs.filter(j => j.status !== "complete").length;
  const [uploading, setUploading] = useState({});
  const [signing, setSigning] = useState({});
  const [photoDone, setPhotoDone] = useState({});
  const [sigDone, setSigDone] = useState({});

  function fakeUpload(id) {
    setUploading(u=>({...u,[id]:true}));
    setTimeout(()=>{ setUploading(u=>({...u,[id]:false})); setPhotoDone(p=>({...p,[id]:true})); }, 1800);
  }
  function fakeSign(id) {
    setSigning(s=>({...s,[id]:true}));
    setTimeout(()=>{ setSigning(s=>({...s,[id]:false})); setSigDone(p=>({...p,[id]:true})); }, 1500);
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Driver header */}
      <div className="bg-indigo-700 text-white rounded-2xl p-4 mb-4 flex items-center gap-3">
        <Avatar initials={ME.avatar} lg />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-lg truncate">{ME.name}</p>
          <p className="text-indigo-200 text-sm">{ME.phone}</p>
          <p className="text-indigo-200 text-xs">{active} active job{active!==1?"s":""}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-indigo-200 text-xs">Heathrow</p>
          <p className="font-mono text-sm">{new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</p>
        </div>
      </div>

      {myJobs.length === 0 && <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-2">🎉</p><p className="font-semibold">No jobs assigned</p></div>}

      <div className="space-y-4">
        {myJobs.map(job => {
          const s = STATUS[job.status];
          return (
            <div key={job.id} className={`bg-white rounded-2xl border-l-4 shadow-md overflow-hidden ${s.border}`}>
              <div className={`${s.bar} px-4 py-1.5 flex items-center justify-between`}>
                <span className="text-xs font-bold text-white">{s.label.toUpperCase()}</span>
                {job.delayed && <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">⚠ DELAYED</span>}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg">{job.customer}</h3>
                <p className="text-sm text-gray-500 mb-3">{job.vehicle} · <span className="font-mono font-semibold">{job.reg}</span> · {job.colour}</p>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-400">Pickup</p><p className="font-semibold">{job.pickup}</p></div>
                  <div className="bg-gray-50 rounded-lg p-2"><p className="text-xs text-gray-400">Return</p><p className="font-semibold text-xs">{job.ret}</p></div>
                  <div className="bg-gray-50 rounded-lg p-2 col-span-2"><p className="text-xs text-gray-400">Zone</p><p className="font-semibold">{job.zone}</p></div>
                  <div className="bg-gray-50 rounded-lg p-2 col-span-2"><p className="text-xs text-gray-400">Flight</p><p className="font-semibold">{job.flight}</p></div>
                </div>
                {job.notes && <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 mb-3"><p className="text-xs font-semibold text-yellow-700 mb-0.5">Notes</p><p className="text-xs text-yellow-800">{job.notes}</p></div>}
                <div className="space-y-2">
                  {job.status==="awaiting" && <button onClick={()=>onAction(job.id,"start")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm">🚀 Start Job</button>}
                  {job.status==="in_progress" && <>
                    <button onClick={()=>fakeUpload(job.id)} disabled={uploading[job.id]||photoDone[job.id]} className={`w-full font-bold py-3 rounded-xl text-sm ${photoDone[job.id]?"bg-green-100 text-green-700":"bg-gray-100 text-gray-800 hover:bg-gray-200"}`}>{uploading[job.id]?"Uploading…":photoDone[job.id]?"✅ Photo Uploaded":"📷 Upload Photo"}</button>
                    <button onClick={()=>fakeSign(job.id)} disabled={signing[job.id]||sigDone[job.id]} className={`w-full font-bold py-3 rounded-xl text-sm ${sigDone[job.id]?"bg-green-100 text-green-700":"bg-gray-100 text-gray-800 hover:bg-gray-200"}`}>{signing[job.id]?"Opening pad…":sigDone[job.id]?"✅ Signature Captured":"✍️ Get Signature"}</button>
                    <button onClick={()=>onAction(job.id,"complete")} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-sm">✔ Mark Complete</button>
                  </>}
                  {job.status==="complete" && <div className="text-center py-2 text-green-700 font-semibold text-sm">✅ Job complete</div>}
                  {job.status==="issue" && <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm">🚨 Report Issue Details</button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [jobs, setJobs] = useState(JOBS);
  const [view, setView] = useState("dashboard");
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
      if (action === "start") return { ...j, status: "in_progress" };
      if (action === "complete") return { ...j, status: "complete" };
      return j;
    }));
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-800 text-white shadow-lg">
        <div className="max-w-screen-xl mx-auto px-3 sm:px-5 py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xl flex-shrink-0">🅿️</span>
              <span className="font-bold text-base sm:text-xl">ParkingDesk</span>
              <span className="text-indigo-300 text-xs ml-1 hidden sm:inline">Heathrow</span>
            </div>
            {/* Toggle */}
            <div className="flex bg-indigo-900 rounded-lg p-0.5 flex-shrink-0">
              <button onClick={() => setView("dashboard")} className={`px-2 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors ${view==="dashboard"?"bg-white text-indigo-800":"text-indigo-300 hover:text-white"}`}>
                <span className="hidden sm:inline">📊 Operations</span>
                <span className="sm:hidden">📊 Ops</span>
              </button>
              <button onClick={() => setView("driver")} className={`px-2 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors ${view==="driver"?"bg-white text-indigo-800":"text-indigo-300 hover:text-white"}`}>
                <span className="hidden sm:inline">🚗 Driver App</span>
                <span className="sm:hidden">🚗 Driver</span>
              </button>
            </div>
            {/* Clock — hidden on mobile */}
            <div className="hidden sm:block text-right flex-shrink-0">
              <p className="font-mono text-sm">{clock.toLocaleTimeString("en-GB")}</p>
              <p className="text-indigo-300 text-xs">{clock.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"})}</p>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-screen-xl mx-auto px-3 sm:px-5 py-4 sm:py-6">
        {view === "dashboard"
          ? <DashboardView jobs={jobs} onUpdate={updateJob} />
          : <DriverView jobs={jobs} onAction={driverAction} />
        }
      </main>
    </div>
  );
}
