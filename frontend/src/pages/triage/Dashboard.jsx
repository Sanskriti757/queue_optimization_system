import { useNavigate } from "react-router-dom";
import { useState } from "react";

const IcUsers = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcClock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IcMonitor = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const IcCheck = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IcHeart = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcBrain = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;
const IcBone = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"/></svg>;
const IcWind = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>;
const IcEye = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IcDownload = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const IcPlus = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IcPhone = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.86-.86a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IcMore = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>;
const IcSearch = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IcChevD = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const IcChevL = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
const IcChevR = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;

const deptIcon = { Cardiology: IcHeart, Neurology: IcBrain, Orthopedics: IcBone, Pulmonology: IcWind, Ophthalmology: IcEye };

const departments = [
  { name:"Cardiology",    dr:"Dr. Sarah Johnson",   q:12, w:"22m" },
  { name:"Neurology",     dr:"Dr. Michael Chen",    q:8,  w:"15m" },
  { name:"Orthopedics",   dr:"Dr. Emily Davis",     q:6,  w:"12m" },
  { name:"Pulmonology",   dr:"Dr. Robert Martinez", q:5,  w:"10m" },
  { name:"Ophthalmology", dr:"Dr. Lisa Anderson",   q:3,  w:"8m"  },
];

const serving = [
  { token:"A-042", counter:3, dept:"Cardiology" },
  { token:"B-028", counter:5, dept:"Neurology" },
  { token:"C-015", counter:7, dept:"Orthopedics" },
];

const nextQ = [
  { token:"A-043", dept:"Cardiology" },
  { token:"B-029", dept:"Neurology" },
  { token:"C-016", dept:"Orthopedics" },
];

const patients = [
  { token:"A-044", name:"John Anderson",  id:"ID: P-10234", dept:"Cardiology",  dr:"Dr. Sarah Johnson",   ci:"09:45 AM", wt:"18 min",  pr:"Normal", st:"Waiting"     },
  { token:"B-030", name:"Maria Garcia",   id:"ID: P-10235", dept:"Neurology",   dr:"Dr. Michael Chen",    ci:"09:52 AM", wt:"11 min",  pr:"Urgent", st:"Waiting"     },
  { token:"C-017", name:"David Wilson",   id:"ID: P-10236", dept:"Orthopedics", dr:"Dr. Emily Davis",     ci:"10:05 AM", wt:"-2 min",  pr:"Normal", st:"In Progress" },
  { token:"A-045", name:"Sarah Thompson", id:"ID: P-10237", dept:"Cardiology",  dr:"Dr. Sarah Johnson",   ci:"10:15 AM", wt:"-12 min", pr:"Normal", st:"Waiting"     },
  { token:"D-012", name:"James Brown",    id:"ID: P-10238", dept:"Pulmonology", dr:"Dr. Robert Martinez", ci:"10:22 AM", wt:"-19 min", pr:"Normal", st:"Waiting"     },
];

const avatarClasses = [
  "bg-blue-100 text-blue-800",
  "bg-yellow-100 text-yellow-800",
  "bg-green-100 text-green-800",
  "bg-pink-100 text-pink-800",
  "bg-purple-100 text-purple-800",
];

const inits = n => n.split(" ").map(w => w[0]).join("").slice(0, 2);

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deptF,  setDeptF]  = useState("All Departments");
  const [statF,  setStatF]  = useState("All Status");
  const [page,   setPage]   = useState(1);

  const rows = patients.filter(p =>
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.token.toLowerCase().includes(search.toLowerCase())) &&
    (deptF === "All Departments" || p.dept === deptF) &&
    (statF === "All Status"      || p.st   === statF)
  );

  return (
    <div className="bg-white mx-auto max-w-310 px-4 py-4 sm:px-6 sm:py-5 mt-5 min-h-screen text-gray-900" style={{fontFamily:"'Inter',-apple-system,sans-serif"}}>

      {/* HEADER */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Queue Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">Real-time patient queue monitoring and management</p>
        </div>
        <div className="flex gap-2 items-center">
          <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
            <IcDownload /> Export
          </button>
          <button
            onClick={() => navigate("/triage/register")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-gray-900 text-sm font-medium text-white hover:bg-gray-800 cursor-pointer border-0"
          >
            <IcPlus /> Add Patient
          </button>
        </div>
      </div>

      <div className="px-6 py-5">

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {[
            { label:"Total Patients", val:127, sub:"+12% vs yesterday",    badge:"Today",  Ic:IcUsers,   badgeCls:"bg-gray-100 text-gray-500"                },
            { label:"In Queue",       val:34,  sub:"18 min avg wait time",  badge:"Live",   Ic:IcClock,   badgeCls:"bg-red-50 text-red-500",   live:true      },
            { label:"Being Served",   val:23,  sub:"8 rooms occupied",      badge:"Active", Ic:IcMonitor, badgeCls:"bg-green-50 text-green-600"               },
            { label:"Completed",      val:70,  sub:"92% satisfaction",      badge:"Today",  Ic:IcCheck,   badgeCls:"bg-gray-100 text-gray-500"                },
          ].map(({ label, val, sub, badge, Ic, badgeCls, live }) => (
            <div key={label} className="border border-gray-200 rounded-lg bg-white p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="text-gray-500"><Ic /></div>
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${badgeCls}`}>
                  {live && <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />}
                  {badge}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 leading-none">{val}</div>
              <div className="text-xs text-gray-500 mt-1.5">{label}</div>
              <div className={`text-xs mt-2 ${sub.startsWith("+") ? "text-green-600" : "text-gray-400"}`}>{sub}</div>
            </div>
          ))}
        </div>

        {/* MIDDLE ROW */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-5">

          {/* Department Queues */}
          <div className="xl:col-span-3 border border-gray-200 rounded-lg bg-white">
            <div className="flex justify-between items-center px-5 py-3.5 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-900">Department Queues</span>
              <button className="text-xs text-gray-400 bg-transparent border-0 cursor-pointer hover:text-gray-700">View All →</button>
            </div>
            {departments.map(({ name, dr, q, w }, i) => {
              const Ic = deptIcon[name];
              return (
                <div key={name} className={`flex items-center gap-4 px-5 py-3.5 ${i < 4 ? "border-b border-gray-50" : ""}`}>
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                    <Ic />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900">{name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{dr}</div>
                  </div>
                  <div className="text-right shrink-0 mr-3">
                    <div className="text-sm font-semibold text-gray-900">{q} <span className="text-xs font-normal text-gray-400">in queue</span></div>
                    <div className="text-xs text-gray-400 mt-0.5">{w} wait time</div>
                  </div>
                  <button className="text-xs px-3 py-1.5 border border-gray-200 rounded-md bg-white text-gray-600 cursor-pointer hover:bg-gray-50 shrink-0">
                    Manage
                  </button>
                </div>
              );
            })}
          </div>

          {/* Now Serving */}
          <div className="xl:col-span-2 border border-gray-200 rounded-lg bg-white">
            <div className="px-5 py-3.5 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-900">Now Serving</span>
            </div>
            <div className="p-4">
              {serving.map(({ token, counter, dept }) => (
                <div key={token} className="border border-gray-200 rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900 tracking-tight">{token}</span>
                    <span className="text-[10px] font-bold bg-gray-900 text-white px-2.5 py-0.5 rounded">Active</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1.5">Counter {counter}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{dept}</div>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 mt-1">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Next in Queue</div>
                {nextQ.map(({ token, dept }) => (
                  <div key={token} className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-gray-700">{token}</span>
                    <span className="text-xs text-gray-400">{dept}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PATIENT QUEUE */}
        <div className="border border-gray-200 rounded-lg bg-white">
          {/* Toolbar */}
          <div className="flex flex-wrap justify-between items-center px-5 py-3.5 border-b border-gray-100 gap-3">
            <span className="text-sm font-semibold text-gray-900">Patient Queue</span>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative flex items-center">
                <span className="absolute left-2.5 flex"><IcSearch /></span>
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search patients..."
                  className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-xs text-gray-700 outline-none w-44 bg-white"
                />
              </div>
              <div className="relative flex items-center">
                <select value={deptF} onChange={e => setDeptF(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-1.5 border border-gray-200 rounded-md text-xs text-gray-700 bg-white cursor-pointer outline-none">
                  <option>All Departments</option>
                  {departments.map(d => <option key={d.name}>{d.name}</option>)}
                </select>
                <span className="absolute right-2 pointer-events-none flex"><IcChevD /></span>
              </div>
              <div className="relative flex items-center">
                <select value={statF} onChange={e => setStatF(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-1.5 border border-gray-200 rounded-md text-xs text-gray-700 bg-white cursor-pointer outline-none">
                  <option>All Status</option>
                  <option>Waiting</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
                <span className="absolute right-2 pointer-events-none flex"><IcChevD /></span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["TOKEN","PATIENT","DEPARTMENT","CHECK-IN TIME","WAIT TIME","PRIORITY","STATUS","ACTIONS"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((p, i) => {
                  const stCls =
                    p.st === "Waiting"     ? "bg-gray-100 text-gray-600"   :
                    p.st === "In Progress" ? "bg-blue-50 text-blue-600"    :
                                             "bg-green-50 text-green-700";
                  return (
                    <tr key={p.token} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">{p.token}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarClasses[i % avatarClasses.length]}`}>
                            {inits(p.name)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">{p.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{p.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-sm font-medium text-gray-900 whitespace-nowrap">{p.dept}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{p.dr}</div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{p.ci}</td>
                      <td className={`px-4 py-3.5 text-sm font-semibold whitespace-nowrap ${p.wt.startsWith("-") ? "text-red-500" : "text-gray-800"}`}>{p.wt}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${p.pr === "Urgent" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                          {p.pr}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${stCls}`}>{p.st}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-1.5">
                          <button className="p-1.5 border border-gray-200 rounded bg-white cursor-pointer text-gray-500 hover:bg-gray-50 flex items-center"><IcPhone /></button>
                          <button className="p-1.5 border border-gray-200 rounded bg-white cursor-pointer text-gray-500 hover:bg-gray-50 flex items-center"><IcMore /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center px-5 py-3.5 border-t border-gray-100 flex-wrap gap-2">
            <span className="text-xs text-gray-400">Showing 1-{rows.length} of 34 patients</span>
            <div className="flex gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} className="w-7 h-7 border border-gray-200 rounded bg-white cursor-pointer flex items-center justify-center hover:bg-gray-50"><IcChevL /></button>
              {[1, 2, 3].map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-7 h-7 border rounded text-xs font-medium cursor-pointer ${page === n ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(Math.min(3, page + 1))} className="w-7 h-7 border border-gray-200 rounded bg-white cursor-pointer flex items-center justify-center hover:bg-gray-50"><IcChevR /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}