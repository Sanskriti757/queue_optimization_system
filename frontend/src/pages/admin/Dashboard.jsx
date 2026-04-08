import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  const stats = [
    {
      label: "Total Occupancy",
      value: "84%",
      note: "+2% vs last hour",
      tone: "light",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9h18" />
          <path d="M7 9V5h10v4" />
          <path d="M6 9v10h12V9" />
          <path d="M9 13h6" />
          <path d="M9 16h4" />
        </svg>
      ),
      badge: "Live",
    },
    {
      label: "Total in Queue",
      value: "42",
      note: "24m avg wait time",
      tone: "dark",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      badge: "Critical",
    },
    {
      label: "Doctors On Duty",
      value: "18/24",
      note: "6 on break",
      tone: "light",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="3" />
          <path d="M5 21v-1a7 7 0 0 1 14 0v1" />
          <path d="M12 11v6" />
          <path d="M9 14h6" />
        </svg>
      ),
      badge: "Active",
    },
    {
      label: "Patients Treated",
      value: "156",
      note: "94% SLA met",
      tone: "light",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      badge: "Today",
    },
  ];

  const criticalQueues = [
    {
      department: "Cardiology",
      doctor: "Dr. Sarah Johnson",
      waiting: 14,
      color: "#2a2a2a",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      department: "Neurology",
      doctor: "Dr. Michael Chen",
      waiting: 8,
      color: "#5a5a5a",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
        </svg>
      ),
    },
    {
      department: "Orthopedics",
      doctor: "Dr. Emily Davis",
      waiting: 5,
      color: "#2f2f2f",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z" />
        </svg>
      ),
    },
  ];

  const staffRows = [
    {
      name: "Dr. Sarah Johnson",
      code: "ID: MED-042",
      role: "Senior Doctor",
      dept: "Cardiology",
      status: "Consulting",
      patients: 24,
      avatar: "SJ",
      avatarBg: "#d9f2ef",
      avatarFg: "#0f766e",
    },
    {
      name: "Mark Thompson",
      code: "ID: NUR-336",
      role: "Triage Nurse",
      dept: "Emergency / General",
      status: "On Break",
      patients: 43,
      avatar: "MT",
      avatarBg: "#e8edf8",
      avatarFg: "#334155",
    },
    {
      name: "Dr. Emily Davis",
      code: "ID: MED-923",
      role: "Specialist",
      dept: "Orthopedics",
      status: "Available",
      patients: 12,
      avatar: "ED",
      avatarBg: "#efe6fb",
      avatarFg: "#6b21a8",
    },
  ];

  const navLinks = ["Dashboard", "Departments", "Patients", "Staff", "Settings"];

  const chartValues = [14, 22, 32, 44, 55, 53, 39, 41, 49, 58, 61, 48, 36];

  function buildPath(values) {
    const max = Math.max(...values);
    const min = Math.min(...values);
    const width = 560;
    const height = 160;
    const step = width / (values.length - 1);
    const y = (value) => {
      const range = max - min || 1;
      const scaled = ((value - min) / range) * (height - 12);
      return height - 6 - scaled;
    };

    return values
      .map((value, index) => `${index === 0 ? "M" : "L"}${(index * step).toFixed(1)} ${y(value).toFixed(1)}`)
      .join(" ");
  }

  function logoMark() {
    return (
      <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#1f2937" />
        <rect x="7" y="8" width="6" height="16" rx="1.2" fill="#ffffff" />
        <rect x="16" y="5" width="9" height="19" rx="1.2" fill="#ffffff" />
        <rect x="9" y="11" width="2.5" height="2" rx="0.5" fill="#1f2937" />
        <rect x="18" y="8" width="5" height="2" rx="0.5" fill="#1f2937" />
        <rect x="18" y="12" width="5" height="2" rx="0.5" fill="#1f2937" />
        <rect x="18" y="16" width="5" height="2" rx="0.5" fill="#1f2937" />
      </svg>
    );
  }

  function MiniBadge({ children }) {
    return <span className="inline-flex items-center rounded-full border border-[#ececec] bg-white px-2.5 py-0.5 text-[10px] font-semibold text-[#6d6d6d] shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]">{children}</span>;
  }

  export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("Today");
    const navigate = useNavigate();

    const chartPath = buildPath(chartValues);
    const areaPath = `${chartPath} L 560 160 L 0 160 Z`;

    return (
      <div className="min-h-screen bg-[#fafafa] text-[#111111]" style={{ fontFamily: 'Inter, "Segoe UI", system-ui, sans-serif' }}>
        <main className="mx-auto max-w-310 px-4 py-4 sm:px-6 sm:py-5">
          <section className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-[19px] font-medium tracking-[-0.02em] text-[#111] sm:text-[21px]">Admin Control Center</h1>
              <p className="mt-0.5 text-[11px] text-[#7d7d7d]">Hospital-wide overview and staff management</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/admin/create-user")}
                className="inline-flex h-9 items-center gap-2 rounded-[10px] bg-[#1d1d1d] px-3.5 text-[12px] font-medium text-white shadow-[0_12px_24px_-16px_rgba(0,0,0,0.7)] transition-colors hover:bg-black"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                Create User
              </button>
            </div>
          </section>

          <section className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((card) => (
              <article
                key={card.label}
                className={`rounded-[14px] border p-4 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] ${
                  card.tone === "dark" ? "border-[#181818] bg-[#1a1a1a] text-white" : "border-[#e8e8e8] bg-white text-[#111]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-[10px] ${card.tone === "dark" ? "bg-white/10 text-white" : "bg-[#f8f8f8] text-[#4a4a4a]"}`}
                  >
                    <span className="block h-4 w-4">{card.icon}</span>
                  </div>
                  <MiniBadge>{card.badge}</MiniBadge>
                </div>

                <div className="mt-4 text-[28px] font-semibold leading-none tracking-[-0.04em]">{card.value}</div>
                <div className={`mt-2 text-[12px] ${card.tone === "dark" ? "text-white/85" : "text-[#5f5f5f]"}`}>{card.label}</div>
                <div className={`mt-2 text-[10px] ${card.tone === "dark" ? "text-white/55" : "text-[#7f7f7f]"}`}>{card.note}</div>
              </article>
            ))}
          </section>

          <section className="mb-4 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_315px]">
            <article className="rounded-[14px] border border-[#e8e8e8] bg-white shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]">
              <div className="flex items-center justify-between border-b border-[#efefef] px-4 py-3">
                <div>
                  <h2 className="text-[13px] font-medium text-[#1a1a1a]">Patient Flow Analytics</h2>
                  <p className="mt-0.5 text-[11px] text-[#7d7d7d]">Hourly peak load across departments</p>
                </div>

                <div className="flex items-center gap-1 rounded-[999px] bg-[#f3f3f3] p-1 text-[11px] font-medium text-[#848484]">
                  {["Today", "Week"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-full px-3 py-1 transition-colors ${activeTab === tab ? "bg-white text-[#111] shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : ""}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-4 pb-4 pt-2">
                <svg viewBox="0 0 620 220" className="h-57.5 w-full overflow-visible">
                  <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d2d2d2" stopOpacity="0.36" />
                      <stop offset="100%" stopColor="#d2d2d2" stopOpacity="0.03" />
                    </linearGradient>
                  </defs>

                  {[10, 20, 30, 40, 50, 60].map((tick) => {
                    const y = 180 - ((tick - 10) / 50) * 130;
                    return <line key={tick} x1="14" x2="590" y1={y} y2={y} stroke="#f3f3f3" strokeWidth="1" />;
                  })}

                  {["8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM"].map((label, index) => {
                    const x = 22 + (index * 568) / 8;
                    return (
                      <text key={label} x={x} y="202" textAnchor="middle" className="fill-[#808080]" style={{ fontSize: 9 }}>
                        {label}
                      </text>
                    );
                  })}

                  <text x="8" y="182" className="fill-[#8b8b8b]" style={{ fontSize: 9 }}>10</text>
                  <text x="8" y="156" className="fill-[#8b8b8b]" style={{ fontSize: 9 }}>20</text>
                  <text x="8" y="130" className="fill-[#8b8b8b]" style={{ fontSize: 9 }}>30</text>
                  <text x="8" y="104" className="fill-[#8b8b8b]" style={{ fontSize: 9 }}>40</text>
                  <text x="8" y="78" className="fill-[#8b8b8b]" style={{ fontSize: 9 }}>50</text>
                  <text x="8" y="52" className="fill-[#8b8b8b]" style={{ fontSize: 9 }}>60</text>

                  <path d={areaPath} fill="url(#chartFill)" />
                  <path d={chartPath} fill="none" stroke="#262626" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </article>

            <article className="rounded-[14px] border border-[#e8e8e8] bg-white shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]">
              <div className="flex items-center justify-between border-b border-[#efefef] px-4 py-3">
                <h2 className="text-[13px] font-medium text-[#1a1a1a]">Critical Queues</h2>
                <button className="grid h-7 w-7 place-items-center rounded-full text-[#8b8b8b] hover:bg-[#f4f4f4]" aria-label="More">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1.2" />
                    <circle cx="5" cy="12" r="1.2" />
                    <circle cx="19" cy="12" r="1.2" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2 p-3">
                {criticalQueues.map((queue) => (
                  <div key={queue.department} className="rounded-xl border border-[#ededed] bg-white p-2.5 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-[10px] text-white" style={{ background: queue.color }}>
                          <span className="block h-3.5 w-3.5">{queue.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-[11px] font-medium text-[#1b1b1b]">{queue.department}</div>
                          <div className="truncate text-[9px] text-[#8a8a8a]">{queue.doctor}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[13px] font-semibold leading-none text-[#151515]">{queue.waiting}</div>
                        <div className="mt-0.5 text-[9px] text-[#8a8a8a]">Waiting</div>
                      </div>
                    </div>

                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#ededed]">
                      <div className="h-full rounded-full bg-[#262626]" style={{ width: `${Math.min(92, 28 + queue.waiting * 4)}%` }} />
                    </div>
                  </div>
                ))}

                <button className="mt-2 w-full rounded-[10px] border border-[#ececec] bg-[#fafafa] py-2 text-[12px] font-medium text-[#333] transition-colors hover:bg-[#f4f4f4]">
                  View All Departments
                </button>
              </div>
            </article>
          </section>

          <section className="rounded-[14px] border border-[#e8e8e8] bg-white shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]">
            <div className="flex flex-col gap-3 border-b border-[#efefef] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[13px] font-medium text-[#1a1a1a]">Staff Directory</h2>
                <p className="mt-0.5 text-[11px] text-[#7d7d7d]">Manage doctors and triage nurses</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9a9a]">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M20 20l-3.5-3.5" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search staff..."
                    className="h-8 w-32 rounded-[10px] border border-[#e3e3e3] bg-white pl-8 pr-3 text-[12px] text-[#1a1a1a] outline-none placeholder:text-[#9a9a9a] focus:border-[#cfcfcf] sm:w-33.75"
                  />
                </label>

                <button className="grid h-8 w-8 place-items-center rounded-[10px] border border-[#e3e3e3] bg-white text-[#666] transition-colors hover:bg-[#fafafa]" aria-label="Filter">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 5h16" />
                    <path d="M7 12h10" />
                    <path d="M10 19h4" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#f0f0f0] bg-white">
                    {[
                      "Staff Member",
                      "Role & Dept",
                      "Current Status",
                      "Patients Today",
                      "Actions",
                    ].map((heading) => (
                      <th key={heading} className="px-4 py-3 text-left text-[9px] font-semibold uppercase tracking-[0.12em] text-[#9a9a9a]">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {staffRows.map((row) => {
                    const statusClass =
                      row.status === "Consulting"
                        ? "bg-[#f6f7f8] text-[#4f4f4f]"
                        : row.status === "On Break"
                          ? "bg-[#f7f3ea] text-[#8a5a1f]"
                          : "bg-[#111111] text-white";

                    return (
                      <tr key={row.name} className="border-b border-[#f4f4f4] last:border-b-0">
                        <td className="px-4 py-3.5 align-middle">
                          <div className="flex items-center gap-3">
                            <div
                              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold"
                              style={{ background: row.avatarBg, color: row.avatarFg }}
                            >
                              {row.avatar}
                            </div>
                            <div>
                              <div className="text-[11px] font-semibold text-[#1b1b1b]">{row.name}</div>
                              <div className="mt-0.5 text-[9px] text-[#949494]">{row.code}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 align-middle">
                          <div className="text-[11px] font-medium text-[#313131]">{row.role}</div>
                          <div className="mt-0.5 text-[9px] text-[#949494]">{row.dept}</div>
                        </td>

                        <td className="px-4 py-3.5 align-middle">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold ${statusClass}`}>{row.status}</span>
                        </td>

                        <td className="px-4 py-3.5 align-middle text-[11px] font-semibold text-[#1f1f1f]">{row.patients}</td>

                        <td className="px-4 py-3.5 align-middle">
                          <button className="grid h-7 w-7 place-items-center rounded-lg border border-[#e1e1e1] bg-white text-[#666] transition-colors hover:bg-[#fafafa]" aria-label="Row actions">
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="5" r="1.4" />
                              <circle cx="12" cy="12" r="1.4" />
                              <circle cx="12" cy="19" r="1.4" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#efefef] px-4 py-3.5 text-[11px] text-[#7d7d7d] sm:flex-row sm:items-center sm:justify-between">
              <div>Showing 3 of 24 staff members</div>

              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-[#e2e2e2] bg-white px-3 py-1.5 text-[11px] text-[#666] hover:bg-[#fafafa]">Previous</button>
                <button className="rounded-lg border border-[#e2e2e2] bg-white px-3 py-1.5 text-[11px] text-[#666] hover:bg-[#fafafa]">Next</button>
              </div>
            </div>
          </section>
        </main>

        <style>{`
          @media (max-width: 900px) {
            .dashboard-nav { display: none; }
          }
        `}</style>
      </div>
    );
  }