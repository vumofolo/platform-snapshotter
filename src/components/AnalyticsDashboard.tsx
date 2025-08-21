import React, { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import { Download, TrendingUp, Users, BarChart3, LayoutGrid, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Data for the analytics dashboard
const modules = [
  { id: 2023, moduleNumber: 1,  title: "Module 1 - Fellowship Welcome by Dr. T", sales: 10, created: "2024-07-24 20:34", status: "Published" },
  { id: 2027, moduleNumber: 2,  title: "Module 2 - Racism And The Right To Health", sales: 13, created: "2025-02-04 13:27", status: "Published" },
  { id: 2028, moduleNumber: 3,  title: "Module 3 - Sexual And Reproductive Health Rights: Challenges And Opportunities During The COVID-19 Pandemic", sales: 9, created: "2025-02-04 13:32", status: "Published" },
  { id: 2029, moduleNumber: 4,  title: "Module 4 - Abortion Care – Legal Frameworks, Research, Clinical Care, Commodities, and Dignified Care", sales: 8, created: "2025-02-04 13:34", status: "Published" },
  { id: 2030, moduleNumber: 5,  title: "Module 5 - Group Module - Check-ins", sales: 6, created: "2025-02-04 13:36", status: "Published" },
  { id: 2031, moduleNumber: 6,  title: "Module 6 - Harm Reduction and the Right to Health – Stigmatized, Criminalized, Marginalized", sales: 2, created: "2025-02-04 13:38", status: "Published" },
  { id: 2032, moduleNumber: 7,  title: "Module 7 - Decriminalization of Autonomy: Sex workers rights", sales: 2, created: "2025-02-04 21:21", status: "Published" },
  { id: 2033, moduleNumber: 8,  title: "Module 8 - Digital Innovation, Technologies And The Right To Health", sales: 1, created: "2025-02-04 21:45", status: "Published" },
  { id: 2034, moduleNumber: 9,  title: "Module 9 - Group Module: The Use of Media as an Advocacy Tool for the Right to Health", sales: 1, created: "2025-02-04 22:01", status: "Published" },
  { id: 2035, moduleNumber: 10, title: "Module 10 - Pleasure as Revolution: Conclusion, Feedback/Survey, Alumni Sign-up", sales: 1, created: "2025-02-04 22:14", status: "Published" },
];

const roles = [
  { title: "Fellowship role", users: 25, firstActivated: "2025-03-03" },
  { title: "Admin role",      users: 7,  firstActivated: "2024-11-03" },
  { title: "Instructor role", users: 1,  firstActivated: "2025-04-03" },
  { title: "Organization role", users: 1, firstActivated: "2025-01-15" },
  { title: "Author",           users: 0,  firstActivated: "2025-02-15" },
];

const enrollmentsByMonth = [
  { month: "2025-02", uniqueFellows: 2 },
  { month: "2025-05", uniqueFellows: 5 },
  { month: "2025-06", uniqueFellows: 6 },
  { month: "2025-07", uniqueFellows: 7 },
  { month: "2025-08", uniqueFellows: 1 },
];

const modulesPerFellow = [
  { fellow: "Letlhogonolo Mokgoroane", modulesEnrolled: 10 },
  { fellow: "Lesego Tlhwale", modulesEnrolled: 6 },
  { fellow: "Esihle Lupindo", modulesEnrolled: 5 },
  { fellow: "Janice Joseph", modulesEnrolled: 4 },
  { fellow: "Kerigo Odada", modulesEnrolled: 4 },
  { fellow: "Naomi Tuley-Solanke", modulesEnrolled: 4 },
  { fellow: "Zenande Booi, New York", modulesEnrolled: 4 },
  { fellow: "Gumani Tshimomola", modulesEnrolled: 3 },
  { fellow: "Kgomotso Mashigo", modulesEnrolled: 3 },
  { fellow: "Mr Fellow", modulesEnrolled: 3 },
  { fellow: "Biruk Tewodros", modulesEnrolled: 1 },
  { fellow: "Dr Tlaleng", modulesEnrolled: 1 },
  { fellow: "Lebohang Tshimomola", modulesEnrolled: 1 },
];

const classesPerFellow = [
  { name: "Letlhogonolo Mokgoroane", classes: 10 },
  { name: "Lesego Tlhwale", classes: 6 },
  { name: "Mr Fellow", classes: 5 },
  { name: "Esihle Lupindo", classes: 5 },
  { name: "Zenande Booi, New York", classes: 4 },
  { name: "Naomi Tuley-Solanke", classes: 4 },
  { name: "Janice Joseph", classes: 4 },
  { name: "Kerigo Odada", classes: 4 },
  { name: "Kgomotso Mashigo", classes: 3 },
  { name: "Gumani Tshimomola", classes: 3 },
  { name: "Lebohang Tshimomola", classes: 1 },
  { name: "Biruk Tewodros", classes: 1 },
  { name: "Dr Tlaleng", classes: 1 },
  { name: "Carries Shelver", classes: 0 },
  { name: "Dudu Dlamini", classes: 0 },
  { name: "Matshidiso Masire", classes: 0 },
  { name: "Dr Gcobani Qambela", classes: 0 },
  { name: "Colleen Cane", classes: 0 },
  { name: "Nomtika Mjwana", classes: 0 },
  { name: "Saida Dahir", classes: 0 },
  { name: "Catherine Burns", classes: 0 },
  { name: "dqdqdq", classes: 0 },
  { name: "nastar", classes: 0 },
];

const engagementByMonth = [
  { month: "2025-01", entries: 1 },
];

const messagePreview = [
  { username: "Dorothy Mutungura", subject: "Global Health Law", status: "Not replied", created: "2025-01-07 20:58" }
];

// Helper functions
function toCSV(rows: any[]) {
  if (!rows?.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const body = rows.map(r => headers.map(h => esc(r[h])).join(",")).join("\n");
  return headers.join(",") + "\n" + body;
}

function downloadCSV(filename: string, rows: any[]) {
  const blob = new Blob([toCSV(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; 
  a.download = filename; 
  a.click(); 
  URL.revokeObjectURL(url);
}

interface KPIChipProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string | number;
  tone?: 'primary' | 'secondary' | 'support' | 'highlight';
}

function KPIChip({ icon: Icon, label, value, tone = "primary" }: KPIChipProps) {
  const toneMap = {
    primary: "bg-primary",
    secondary: "bg-secondary", 
    support: "bg-analytics-support",
    highlight: "bg-analytics-highlight",
  };
  
  return (
    <div className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-card shadow-card border">
      <div className={`p-2 rounded-xl text-white ${toneMap[tone]}`}>
        <Icon size={18} />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-lg font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}

interface ProgressRingProps {
  size?: number;
  stroke?: number;
  value?: number;
  color?: string;
  label?: string;
}

function ProgressRing({ size = 60, stroke = 8, value = 100, label = "" }: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle 
        cx={size/2} 
        cy={size/2} 
        r={r} 
        stroke="hsl(var(--border))" 
        strokeWidth={stroke} 
        fill="none" 
      />
      <circle 
        cx={size/2} 
        cy={size/2} 
        r={r} 
        stroke="hsl(var(--analytics-secondary))" 
        strokeWidth={stroke} 
        fill="none" 
        strokeLinecap="round" 
        strokeDasharray={`${dash} ${c}`} 
        transform={`rotate(-90 ${size/2} ${size/2})`} 
      />
      <text 
        x="50%" 
        y="50%" 
        dominantBaseline="middle" 
        textAnchor="middle" 
        fontSize="12" 
        fill="hsl(var(--foreground))"
      >
        {label}
      </text>
    </svg>
  );
}

export default function AnalyticsDashboard() {
  const [tab, setTab] = useState("modules");

  const kpis = useMemo(() => {
    const totalModules = modules.length;
    const totalHours = 29.57;
    const totalEnrolments = modules.reduce((a, m) => a + (m.sales || 0), 0);
    const uniqueFellows = new Set(modulesPerFellow.map(m => m.fellow)).size;
    const peakMonth = enrollmentsByMonth.slice().sort((a,b)=>b.uniqueFellows - a.uniqueFellows)[0]?.month || "—";
    return { totalModules, totalHours, totalEnrolments, uniqueFellows, peakMonth };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/4698deb9-2a88-44ac-bafb-46922f916821.png" alt="Our Equity Logo" className="w-8 h-8" />
            <div>
              <div className="text-lg font-semibold text-primary">Our Equity — Platform Snapshot</div>
              <div className="text-xs text-muted-foreground">Walter's 5‑page → interactive site • Brand applied</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => window.print()}>Export PDF</Button>
          </div>
        </div>
      </header>

      {/* KPI Section */}
      <section className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <KPIChip icon={LayoutGrid} label="Modules live" value={kpis.totalModules} tone="primary" />
        <KPIChip icon={TrendingUp} label="Total enrolments" value={kpis.totalEnrolments} tone="secondary" />
        <KPIChip icon={Users} label="Unique fellows" value={kpis.uniqueFellows} tone="support" />
        <KPIChip icon={BarChart3} label="Peak enrolment month" value={kpis.peakMonth} tone="highlight" />
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-card shadow-card border">
          <ProgressRing value={100} label={`${kpis.totalHours}h`} />
          <div>
            <div className="text-xs text-muted-foreground">Total course hours</div>
            <div className="text-lg font-semibold text-foreground">{kpis.totalHours}</div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="enrol">Enrolment</TabsTrigger>
            <TabsTrigger value="classes">Classes</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          {/* Modules Tab */}
          <TabsContent value="modules">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Modules — Sales by Module</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={modules.map(m => ({ name: m.moduleNumber, sales: m.sales }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        label={{ value: "Module #", position: "insideBottom", offset: -5 }}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip />
                      <Bar dataKey="sales" fill="hsl(var(--analytics-secondary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Modules Table</CardTitle>
                <Button size="sm" onClick={() => downloadCSV("modules.csv", modules)}>
                  <Download className="mr-2 h-4 w-4"/> CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-4 font-semibold">Module #</th>
                        <th className="py-2 pr-4 font-semibold">Title</th>
                        <th className="py-2 pr-4 font-semibold">Sales</th>
                        <th className="py-2 pr-4 font-semibold">Created</th>
                        <th className="py-2 pr-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modules.sort((a,b)=>a.moduleNumber-b.moduleNumber).map((m) => (
                        <tr key={m.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="py-2 pr-4">{m.moduleNumber}</td>
                          <td className="py-2 pr-4">{m.title}</td>
                          <td className="py-2 pr-4 font-medium">{m.sales}</td>
                          <td className="py-2 pr-4 text-muted-foreground">{m.created}</td>
                          <td className="py-2 pr-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-analytics-support text-analytics-support-foreground">
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-2">* Lesson/sub‑module counts not in current export — add when available.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Users by Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roles.map(r => ({ name: r.title, users: r.users }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        interval={0} 
                        angle={-15} 
                        textAnchor="end" 
                        height={60}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip />
                      <Bar dataKey="users" fill="hsl(var(--analytics-support))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Roles Table</CardTitle>
                <Button size="sm" onClick={() => downloadCSV("roles.csv", roles)}>
                  <Download className="mr-2 h-4 w-4"/> CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-4 font-semibold">Title</th>
                        <th className="py-2 pr-4 font-semibold">Users</th>
                        <th className="py-2 pr-4 font-semibold">First Activated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.map((r, idx) => (
                        <tr key={idx} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="py-2 pr-4">{r.title}</td>
                          <td className="py-2 pr-4 font-medium">{r.users}</td>
                          <td className="py-2 pr-4 text-muted-foreground">{r.firstActivated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enrolment Tab */}
          <TabsContent value="enrol">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Unique Fellows by Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={enrollmentsByMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="month"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip />
                      <Bar dataKey="uniqueFellows" fill="hsl(var(--analytics-accent))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Modules Enrolled per Fellow</CardTitle>
                <Button size="sm" onClick={() => downloadCSV("modules_per_fellow.csv", modulesPerFellow)}>
                  <Download className="mr-2 h-4 w-4"/> CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-4 font-semibold">Fellow</th>
                        <th className="py-2 pr-4 font-semibold">Modules Enrolled</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modulesPerFellow.map((r, idx) => (
                        <tr key={idx} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="py-2 pr-4">{r.fellow}</td>
                          <td className="py-2 pr-4 font-medium">{r.modulesEnrolled}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Top Fellows by Classes Taken</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[...classesPerFellow].sort((a,b)=>b.classes-a.classes).slice(0,12)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        interval={0} 
                        angle={-20} 
                        textAnchor="end" 
                        height={70}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip />
                      <Bar dataKey="classes" fill="hsl(var(--analytics-secondary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Classes per Fellow (Full table)</CardTitle>
                <Button size="sm" onClick={() => downloadCSV("classes_per_fellow.csv", classesPerFellow)}>
                  <Download className="mr-2 h-4 w-4"/> CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-4 font-semibold">Name</th>
                        <th className="py-2 pr-4 font-semibold">Classes Taken</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classesPerFellow.map((r, idx) => (
                        <tr key={idx} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="py-2 pr-4">{r.name}</td>
                          <td className="py-2 pr-4 font-medium">{r.classes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>External Engagement (Messages) by Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementByMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="month"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis 
                        allowDecimals={false}
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                      />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="entries" 
                        stroke="hsl(var(--analytics-primary))" 
                        strokeWidth={2} 
                        dot={{ fill: "hsl(var(--analytics-primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Message Preview</CardTitle>
                <Button size="sm" onClick={() => downloadCSV("messages.csv", messagePreview)}>
                  <Download className="mr-2 h-4 w-4"/> CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-4 font-semibold">Username</th>
                        <th className="py-2 pr-4 font-semibold">Subject</th>
                        <th className="py-2 pr-4 font-semibold">Status</th>
                        <th className="py-2 pr-4 font-semibold">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messagePreview.map((m, idx) => (
                        <tr key={idx} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                          <td className="py-2 pr-4">{m.username}</td>
                          <td className="py-2 pr-4">{m.subject}</td>
                          <td className="py-2 pr-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-analytics-alert text-analytics-alert-foreground">
                              {m.status}
                            </span>
                          </td>
                          <td className="py-2 pr-4 text-muted-foreground">{m.created}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <MessageCircle size={14} /> tip: default share wins to cohort feed and add 1‑tap praise.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Insight Action Cards */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-analytics-primary">Insight → Action (Julian Cole)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Make the <span className="font-semibold text-foreground">next best step obvious</span>. Package modules into <span className="font-semibold text-foreground">3 named pathways</span> and signpost them across UX + emails.
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-analytics-primary">Insight → Action (System1 / Jon Evans)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Maintain a <span className="font-semibold text-foreground">fluent progress device</span> (the ring) everywhere, celebrate <span className="font-semibold text-foreground">small wins</span>, keep copy simple.
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-analytics-primary">Insight → Action (Rory Sutherland)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Use <span className="font-semibold text-foreground">defaults</span> (pathway + weekly schedule), <span className="font-semibold text-foreground">Fresh‑Start prompts</span>, and <span className="font-semibold text-foreground">streak framing</span> to pull usage up.
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="text-xs text-right px-6 py-6 text-muted-foreground">
        Our Equity — Generated for cohort & sponsors
      </footer>
    </div>
  );
}