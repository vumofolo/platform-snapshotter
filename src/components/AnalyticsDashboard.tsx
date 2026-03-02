import React, { useMemo, useState, useRef, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, TrendingUp, Users, BarChart3, LayoutGrid, MessageCircle, Clock, MapPin, Globe, Timer, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Data for the analytics dashboard
const modules = [{
  id: 2023, moduleNumber: 1, title: "Module 1 - Fellowship Welcome by Dr. T", sales: 10, created: "2024-07-24 20:34", status: "active"
}, {
  id: 2027, moduleNumber: 2, title: "Module 2 - Racism And The Right To Health", sales: 15, created: "2025-02-04 13:27", status: "active"
}, {
  id: 2028, moduleNumber: 3, title: "Module 3 - Sexual And Reproductive Health Rights", sales: 13, created: "2025-02-04 13:32", status: "active"
}, {
  id: 2029, moduleNumber: 4, title: "Module 4 - Abortion Care – Legal Frameworks, Research, Clinical Care", sales: 11, created: "2025-02-04 13:34", status: "active"
}, {
  id: 2030, moduleNumber: 5, title: "Module 5 - Group Module - Check-ins", sales: 9, created: "2025-02-04 13:36", status: "active"
}, {
  id: 2031, moduleNumber: 6, title: "Module 6 - Harm Reduction and the Right to Health", sales: 7, created: "2025-02-04 13:38", status: "active"
}, {
  id: 2032, moduleNumber: 7, title: "Module 7 - Decriminalization of Autonomy: Sex workers rights", sales: 6, created: "2025-02-04 21:24", status: "active"
}, {
  id: 2033, moduleNumber: 8, title: "Module 8 - Digital Innovation, Technologies And The Right To Health", sales: 5, created: "2025-02-04 21:45", status: "active"
}, {
  id: 2034, moduleNumber: 9, title: "Module 9 - Group Module: Media as Advocacy Tool", sales: 4, created: "2025-02-04 22:01", status: "active"
}, {
  id: 2035, moduleNumber: 10, title: "Module 10 - Pleasure as Revolution: Conclusion", sales: 4, created: "2025-02-04 22:14", status: "active"
}];

const roles = [
  { title: "Fellowship role", users: 25, firstActivated: "2025-03-03" },
  { title: "Admin role", users: 7, firstActivated: "2024-11-03" },
  { title: "Instructor role", users: 1, firstActivated: "2025-04-03" },
  { title: "Organization role", users: 1, firstActivated: "2025-01-15" },
  { title: "Author", users: 0, firstActivated: "2025-02-15" },
];

const enrollmentsByMonth = [
  { month: "2025-02", uniqueFellows: 2 },
  { month: "2025-05", uniqueFellows: 5 },
  { month: "2025-06", uniqueFellows: 6 },
  { month: "2025-07", uniqueFellows: 6 },
  { month: "2025-08", uniqueFellows: 1 },
  { month: "2025-09", uniqueFellows: 1 },
  { month: "2025-10", uniqueFellows: 2 },
  { month: "2025-11", uniqueFellows: 3 },
  { month: "2025-12", uniqueFellows: 4 },
  { month: "2026-01", uniqueFellows: 1 },
];

// Total module registrations per month (from sales records)
const registrationsPerMonth = [
  { month: "2025-02", registrations: 11 },
  { month: "2025-05", registrations: 12 },
  { month: "2025-06", registrations: 11 },
  { month: "2025-07", registrations: 13 },
  { month: "2025-08", registrations: 2 },
  { month: "2025-09", registrations: 4 },
  { month: "2025-10", registrations: 3 },
  { month: "2025-11", registrations: 5 },
  { month: "2025-12", registrations: 17 },
  { month: "2026-01", registrations: 1 },
];

// Time-of-day distribution for registrations
const registrationsByTimeOfDay = [
  { slot: "00:00–05:59", label: "Late Night", count: 8 },
  { slot: "06:00–11:59", label: "Morning", count: 15 },
  { slot: "12:00–17:59", label: "Afternoon", count: 32 },
  { slot: "18:00–23:59", label: "Evening", count: 26 },
];

// Day-of-week distribution for registrations
const registrationsByDay = [
  { day: "Mon", count: 11 },
  { day: "Tue", count: 8 },
  { day: "Wed", count: 12 },
  { day: "Thu", count: 10 },
  { day: "Fri", count: 14 },
  { day: "Sat", count: 11 },
  { day: "Sun", count: 15 },
];

const modulesPerFellow = [
  { fellow: "Letlhogonolo Mokgoroane", modulesEnrolled: 10 },
  { fellow: "Janice Joseph", modulesEnrolled: 9 },
  { fellow: "Gumani Tshimomola", modulesEnrolled: 9 },
  { fellow: "Lebohang Tshimomola", modulesEnrolled: 9 },
  { fellow: "Lesego Tlhwale", modulesEnrolled: 6 },
  { fellow: "Biruk Tewodros", modulesEnrolled: 6 },
  { fellow: "Esihle Lupindo", modulesEnrolled: 5 },
  { fellow: "Naomi Tuley-Solanke", modulesEnrolled: 5 },
  { fellow: "Kerigo Odada", modulesEnrolled: 4 },
  { fellow: "Zenande Booi, New York", modulesEnrolled: 4 },
  { fellow: "Kgomotso Mashigo", modulesEnrolled: 3 },
  { fellow: "Mr Fellow", modulesEnrolled: 3 },
  { fellow: "Dr Gcobani Qambela", modulesEnrolled: 3 },
  { fellow: "Carries Shelver", modulesEnrolled: 2 },
  { fellow: "Dr Tlaleng", modulesEnrolled: 1 },
];

const classesPerFellow = [
  { name: "Letlhogonolo Mokgoroane", classes: 10 },
  { name: "Janice Joseph", classes: 9 },
  { name: "Gumani Tshimomola", classes: 9 },
  { name: "Lebohang Tshimomola", classes: 9 },
  { name: "Lesego Tlhwale", classes: 6 },
  { name: "Biruk Tewodros", classes: 6 },
  { name: "Mr Fellow", classes: 5 },
  { name: "Esihle Lupindo", classes: 5 },
  { name: "Naomi Tuley-Solanke", classes: 5 },
  { name: "Zenande Booi, New York", classes: 4 },
  { name: "Kerigo Odada", classes: 4 },
  { name: "Kgomotso Mashigo", classes: 3 },
  { name: "Dr Gcobani Qambela", classes: 3 },
  { name: "Carries Shelver", classes: 2 },
  { name: "Dr Tlaleng", classes: 1 },
  { name: "Colleen Cane", classes: 0 },
  { name: "Dudu Dlamini", classes: 0 },
  { name: "Matshidiso Masire", classes: 0 },
  { name: "Nomtika Mjwana", classes: 0 },
  { name: "Saida Dahir", classes: 0 },
  { name: "Catherine Burns", classes: 0 },
  { name: "dqdqdq", classes: 0 },
  { name: "nastar", classes: 0 },
  { name: "inijims2003", classes: 0 },
];

// Fellow statuses from Page 2
const fellowStatuses = [
  { name: "inijims2003", status: "pending" },
  { name: "Mr Fellow", status: "active" },
  { name: "Carries Shelver", status: "active" },
  { name: "Matshidiso Masire", status: "active" },
  { name: "Dr Gcobani Qambela", status: "active" },
  { name: "Biruk Tewodros", status: "active" },
  { name: "Saida Dahir", status: "active" },
  { name: "Colleen Cane", status: "active" },
  { name: "Gumani Tshimomola", status: "active" },
  { name: "Catherine Burns", status: "active" },
  { name: "Lebohang Tshimomola", status: "active" },
  { name: "Lesego Tlhwale", status: "active" },
  { name: "Dudu Dlamini", status: "active" },
  { name: "Esihle Lupindo", status: "active" },
  { name: "Zenande Booi, New York", status: "active" },
  { name: "Naomi Tuley-Solanke", status: "active" },
  { name: "Kgomotso Mashigo", status: "active" },
  { name: "Nomtika Mjwana", status: "active" },
  { name: "Janice Joseph", status: "active" },
  { name: "Kerigo Odada", status: "active" },
  { name: "dqdqdq", status: "active" },
  { name: "Letlhogonolo Mokgoroane", status: "active" },
  { name: "Dr Tlaleng", status: "active" },
  { name: "nastar", status: "active" },
];

// Session data: fellows by country and city
const sessionsByCountry = [
  { country: "South Africa", sessions: 38, fellows: 9 },
  { country: "United States", sessions: 10, fellows: 5 },
  { country: "Switzerland", sessions: 4, fellows: 2 },
  { country: "Indonesia", sessions: 3, fellows: 2 },
  { country: "Kenya", sessions: 1, fellows: 1 },
  { country: "Tanzania", sessions: 1, fellows: 1 },
];

const sessionsByCity = [
  { city: "Pretoria", country: "South Africa", sessions: 22 },
  { city: "Johannesburg", country: "South Africa", sessions: 7 },
  { city: "Silver Spring", country: "United States", sessions: 4 },
  { city: "Cape Town", country: "South Africa", sessions: 4 },
  { city: "New York", country: "United States", sessions: 2 },
  { city: "Brooklyn", country: "United States", sessions: 2 },
  { city: "Lausanne", country: "Switzerland", sessions: 2 },
  { city: "Centurion", country: "South Africa", sessions: 2 },
  { city: "Boshof", country: "South Africa", sessions: 2 },
  { city: "Melkbosstrand", country: "South Africa", sessions: 2 },
  { city: "Lincoln", country: "United States", sessions: 2 },
  { city: "Depok", country: "Indonesia", sessions: 2 },
  { city: "Wetzikon", country: "Switzerland", sessions: 1 },
  { city: "Geneva", country: "Switzerland", sessions: 1 },
  { city: "Nairobi", country: "Kenya", sessions: 1 },
  { city: "Arlington", country: "United States", sessions: 1 },
  { city: "Kempton Park", country: "South Africa", sessions: 1 },
  { city: "Kijini", country: "Tanzania", sessions: 1 },
  { city: "Bogor", country: "Indonesia", sessions: 1 },
];

// Session data: fellows by device
const sessionsByDevice = [
  { device: "Desktop", sessions: 48 },
  { device: "Phone", sessions: 12 },
];

// Session data: fellows by OS
const sessionsByOS = [
  { os: "Windows", sessions: 28 },
  { os: "macOS", sessions: 20 },
  { os: "iOS", sessions: 8 },
  { os: "Android", sessions: 2 },
];

// Sessions per month
const sessionsPerMonth = [
  { month: "2024-09", sessions: 2 },
  { month: "2025-02", sessions: 14 },
  { month: "2025-05", sessions: 24 },
  { month: "2025-06", sessions: 5 },
  { month: "2025-07", sessions: 4 },
  { month: "2025-08", sessions: 2 },
  { month: "2025-09", sessions: 1 },
  { month: "2025-10", sessions: 3 },
  { month: "2025-11", sessions: 1 },
  { month: "2025-12", sessions: 4 },
  { month: "2026-02", sessions: 1 },
];

// Session time-of-day (login times)
const sessionsByTimeOfDay = [
  { slot: "00:00–05:59", label: "Late Night", count: 2 },
  { slot: "06:00–11:59", label: "Morning", count: 18 },
  { slot: "12:00–17:59", label: "Afternoon", count: 24 },
  { slot: "18:00–23:59", label: "Evening", count: 14 },
];

// Duration ranking data (from session Duration column)
const durationRanking = [
  { fellow: "Kgomotso Mashigo", duration: "23h 18m", minutes: 1398, tier: "High" },
  { fellow: "Mr Fellow", duration: "5h 28m", minutes: 328, tier: "High" },
  { fellow: "Lesego Tlhwale", duration: "7h 50m", minutes: 470, tier: "High" },
  { fellow: "Janice Joseph", duration: "5h 9m", minutes: 309, tier: "High" },
  { fellow: "Letlhogonolo Mokgoroane", duration: "37m", minutes: 37, tier: "Medium" },
  { fellow: "Kgomotso Mashigo (session 2)", duration: "7m", minutes: 7, tier: "Low" },
  { fellow: "Catherine Burns", duration: "3m", minutes: 3, tier: "Low" },
  { fellow: "Mr Fellow (quick)", duration: "2m", minutes: 2, tier: "Low" },
];

// Aggregated duration per fellow
const durationPerFellow = [
  { fellow: "Kgomotso Mashigo", totalMinutes: 1439, display: "23h 59m", tier: "High" },
  { fellow: "Lesego Tlhwale", totalMinutes: 470, display: "7h 50m", tier: "High" },
  { fellow: "Mr Fellow", totalMinutes: 334, display: "5h 34m", tier: "High" },
  { fellow: "Janice Joseph", totalMinutes: 309, display: "5h 9m", tier: "Medium" },
  { fellow: "Letlhogonolo Mokgoroane", totalMinutes: 37, display: "37m", tier: "Medium" },
  { fellow: "Carries Shelver", totalMinutes: 0, display: "—", tier: "Low" },
  { fellow: "Catherine Burns", totalMinutes: 3, display: "3m", tier: "Low" },
  { fellow: "Dudu Dlamini", totalMinutes: 0, display: "—", tier: "Low" },
];

// Fellow activity with location & time context
const fellowActivity = [
  { fellow: "Mr Fellow", country: "South Africa", city: "Pretoria", sessions: 16, peakTime: "Afternoon", device: "Desktop" },
  { fellow: "Kgomotso Mashigo", country: "South Africa", city: "Johannesburg / Pretoria", sessions: 6, peakTime: "Afternoon", device: "Desktop" },
  { fellow: "Letlhogonolo Mokgoroane", country: "South Africa", city: "Pretoria / Johannesburg", sessions: 6, peakTime: "Afternoon", device: "Mixed" },
  { fellow: "Janice Joseph", country: "United States", city: "Silver Spring", sessions: 4, peakTime: "Evening", device: "Desktop" },
  { fellow: "Gumani Tshimomola", country: "South Africa", city: "Cape Town / Centurion", sessions: 4, peakTime: "Afternoon", device: "Mixed" },
  { fellow: "Lebohang Tshimomola", country: "South Africa", city: "Boshof", sessions: 3, peakTime: "Morning", device: "Desktop" },
  { fellow: "Zenande Booi, New York", country: "United States", city: "New York", sessions: 2, peakTime: "Evening", device: "Desktop" },
  { fellow: "Lesego Tlhwale", country: "South Africa", city: "Cape Town", sessions: 2, peakTime: "Afternoon", device: "Desktop" },
  { fellow: "Carries Shelver", country: "Switzerland", city: "Lausanne / Geneva", sessions: 3, peakTime: "Morning", device: "Desktop" },
  { fellow: "Esihle Lupindo", country: "United States", city: "Lincoln", sessions: 2, peakTime: "Afternoon", device: "Mixed" },
  { fellow: "Naomi Tuley-Solanke", country: "Switzerland", city: "Wetzikon", sessions: 1, peakTime: "Afternoon", device: "Desktop" },
  { fellow: "Biruk Tewodros", country: "United States", city: "Brooklyn", sessions: 1, peakTime: "Evening", device: "Desktop" },
  { fellow: "Kerigo Odada", country: "Kenya", city: "Nairobi", sessions: 1, peakTime: "Afternoon", device: "Desktop" },
  { fellow: "Dr Tlaleng", country: "South Africa", city: "Melkbosstrand", sessions: 2, peakTime: "Morning", device: "Desktop" },
  { fellow: "Dudu Dlamini", country: "South Africa / Tanzania", city: "Cape Town / Kijini", sessions: 2, peakTime: "Morning", device: "Phone" },
  { fellow: "Colleen Cane", country: "United States", city: "Arlington", sessions: 1, peakTime: "Afternoon", device: "Desktop" },
  { fellow: "Catherine Burns", country: "South Africa", city: "Pretoria", sessions: 1, peakTime: "Evening", device: "Desktop" },
  { fellow: "Saida Dahir", country: "United States", city: "Brooklyn", sessions: 1, peakTime: "Afternoon", device: "Phone" },
];

const engagementByMonth = [{ month: "2025-01", entries: 1 }];
const messagePreview = [{ username: "Dorothy Mutungura", subject: "Global Health Law", status: "Not replied", created: "2025-01-07 20:58" }];

const PIE_COLORS = [
  "hsl(var(--analytics-primary))",
  "hsl(var(--analytics-secondary))",
  "hsl(var(--analytics-support))",
  "hsl(var(--analytics-accent))",
  "hsl(var(--analytics-highlight))",
  "hsl(var(--muted-foreground))",
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
    highlight: "bg-analytics-highlight"
  };
  return <div className="flex items-center gap-2 sm:gap-3 rounded-2xl px-3 sm:px-4 py-3 bg-card shadow-card border min-w-0">
    <div className={`p-1.5 sm:p-2 rounded-xl text-white ${toneMap[tone]} shrink-0`}>
      <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-xs text-muted-foreground truncate">{label}</div>
      <div className="text-sm sm:text-lg font-semibold text-foreground truncate">{value}</div>
    </div>
  </div>;
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
  const dash = value / 100 * c;
  return <svg width={size} height={size} className="shrink-0">
    <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--border))" strokeWidth={stroke} fill="none" />
    <circle cx={size / 2} cy={size / 2} r={r} stroke="hsl(var(--analytics-secondary))" strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={`${dash} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fill="hsl(var(--foreground))">{label}</text>
  </svg>;
}

export default function AnalyticsDashboard() {
  const [tab, setTab] = useState("modules");
  const [exporting, setExporting] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const kpis = useMemo(() => {
    const totalModules = modules.filter(m => m.status === "active").length;
    const totalHours = 29.57;
    const totalEnrolments = modules.reduce((a, m) => a + (m.sales || 0), 0);
    const uniqueFellows = new Set(modulesPerFellow.map(m => m.fellow)).size;
    const activeFellows = fellowStatuses.filter(f => f.status === "active").length;
    const peakMonth = enrollmentsByMonth.slice().sort((a, b) => b.uniqueFellows - a.uniqueFellows)[0]?.month || "—";
    return { totalModules, totalHours, totalEnrolments, uniqueFellows, activeFellows, peakMonth };
  }, []);

  const moduleRankings = useMemo(() =>
    [...modules].sort((a, b) => b.sales - a.sales).map(m => ({
      name: `M${m.moduleNumber}`,
      fullTitle: m.title,
      registrations: m.sales,
    })), []);

  const allTabs = ["modules", "rankings", "roles", "enrol", "classes", "sessions", "engagement"];

  const exportPDF = useCallback(async () => {
    if (!dashboardRef.current || exporting) return;
    setExporting(true);
    const originalTab = tab;
    const pdf = new jsPDF("p", "mm", "a4");
    const A4_W = pdf.internal.pageSize.getWidth();
    const A4_H = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentW = A4_W - margin * 2;
    const gap = 4;
    let currentY = margin;
    let isFirstPage = true;

    const addSectionToPDF = (imgData: string, imgWidthPx: number, imgHeightPx: number) => {
      const scaleFactor = contentW / imgWidthPx;
      const sectionH = imgHeightPx * scaleFactor;

      // If section won't fit on current page and we're not at the top, start new page
      if (currentY + sectionH > A4_H - margin && currentY > margin) {
        pdf.addPage();
        currentY = margin;
      } else if (!isFirstPage && currentY === margin) {
        // Already on a fresh page
      }

      // If a single section is taller than a full page, scale it down to fit
      const maxH = A4_H - margin * 2;
      if (sectionH > maxH) {
        const fitScale = maxH / sectionH;
        const fitW = contentW * fitScale;
        const fitH = sectionH * fitScale;
        const xOffset = margin + (contentW - fitW) / 2;
        pdf.addImage(imgData, "PNG", xOffset, currentY, fitW, fitH);
        currentY += fitH + gap;
      } else {
        pdf.addImage(imgData, "PNG", margin, currentY, contentW, sectionH);
        currentY += sectionH + gap;
      }
      isFirstPage = false;
    };

    try {
      for (let i = 0; i < allTabs.length; i++) {
        setTab(allTabs[i]);
        await new Promise(r => setTimeout(r, 1000));

        // Add a tab title page separator
        if (i > 0) {
          pdf.addPage();
          currentY = margin;
        }

        // Find all Card sections within the active tab content
        const tabContent = dashboardRef.current.querySelector('[role="tabpanel"][data-state="active"]');
        if (!tabContent) continue;

        const sections = tabContent.querySelectorAll(':scope > div, :scope > .grid, :scope > [class*="Card"], :scope > div > [class*="Card"]');
        // Collect top-level children as sections
        const topSections = Array.from(tabContent.children) as HTMLElement[];

        for (const section of topSections) {
          if (section.offsetHeight < 10) continue; // skip invisible
          const canvas = await html2canvas(section, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            windowWidth: 1280,
          });
          const imgData = canvas.toDataURL("image/png");
          addSectionToPDF(imgData, canvas.width, canvas.height);
        }
      }

      pdf.save("OurEquity_Dashboard_Report.pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setTab(originalTab);
      setExporting(false);
    }
  }, [tab, exporting]);

  return <div ref={dashboardRef} className="min-h-screen bg-background">
    {/* Header */}
    <header className="w-full border-b bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3">
          <img src="/lovable-uploads/4698deb9-2a88-44ac-bafb-46922f916821.png" alt="Our Equity Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
          <div>
            <div className="text-base sm:text-lg font-semibold text-primary">Our Equity — Platform Snapshot</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={exportPDF} disabled={exporting}>
            {exporting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Exporting...</> : <><span className="hidden sm:inline">Export PDF</span><span className="sm:hidden">PDF</span></>}
          </Button>
        </div>
      </div>
    </header>

    {/* KPI Section */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
      <KPIChip icon={LayoutGrid} label="Active modules" value={kpis.totalModules} tone="primary" />
      <KPIChip icon={TrendingUp} label="Total enrolments" value={kpis.totalEnrolments} tone="secondary" />
      <KPIChip icon={Users} label="Active fellows" value={kpis.activeFellows} tone="support" />
      <KPIChip icon={Users} label="Unique fellows enrolled" value={kpis.uniqueFellows} tone="primary" />
      <KPIChip icon={BarChart3} label="Peak enrolment month" value={kpis.peakMonth} tone="highlight" />
      <div className="flex items-center gap-3 rounded-2xl px-3 sm:px-4 py-3 bg-card shadow-card border">
        <ProgressRing value={100} label={`${kpis.totalHours}h`} />
        <div>
          <div className="text-xs text-muted-foreground">Total course hours</div>
          <div className="text-sm sm:text-lg font-semibold text-foreground">{kpis.totalHours}</div>
        </div>
      </div>
    </section>

    {/* Main Content */}
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4 grid grid-cols-3 lg:grid-cols-7 w-full h-auto">
          <TabsTrigger value="modules" className="text-xs sm:text-sm px-2 sm:px-4">Modules</TabsTrigger>
          <TabsTrigger value="rankings" className="text-xs sm:text-sm px-2 sm:px-4">Rankings</TabsTrigger>
          <TabsTrigger value="roles" className="text-xs sm:text-sm px-2 sm:px-4">Roles</TabsTrigger>
          <TabsTrigger value="enrol" className="text-xs sm:text-sm px-2 sm:px-4">Enrolment</TabsTrigger>
          <TabsTrigger value="classes" className="text-xs sm:text-sm px-2 sm:px-4">Classes</TabsTrigger>
          <TabsTrigger value="sessions" className="text-xs sm:text-sm px-2 sm:px-4">Sessions</TabsTrigger>
          <TabsTrigger value="engagement" className="text-xs sm:text-sm px-2 sm:px-4">Engagement</TabsTrigger>
        </TabsList>

        {/* Modules Tab */}
        <TabsContent value="modules">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Modules — Registrations by Module (Volume by Sales Count)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modules.map(m => ({ name: m.moduleNumber, sales: m.sales }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" label={{ value: "Module #", position: "insideBottom", offset: -5 }} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
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
                <Download className="mr-2 h-4 w-4" /> CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4 font-semibold">Module #</th>
                      <th className="py-2 pr-4 font-semibold">Title</th>
                      <th className="py-2 pr-4 font-semibold">Sales Count</th>
                      <th className="py-2 pr-4 font-semibold">Created</th>
                      <th className="py-2 pr-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modules.sort((a, b) => a.moduleNumber - b.moduleNumber).map(m => <tr key={m.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-2 pr-4">{m.moduleNumber}</td>
                      <td className="py-2 pr-4">{m.title}</td>
                      <td className="py-2 pr-4 font-medium">{m.sales}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{m.created}</td>
                      <td className="py-2 pr-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-analytics-support text-analytics-support-foreground capitalize">{m.status}</span>
                      </td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rankings Tab */}
        <TabsContent value="rankings">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Module Rankings — Most Registered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 sm:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moduleRankings} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" width={40} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <Tooltip formatter={(value: number, _name: string, props: any) => [value, props.payload.fullTitle]} />
                    <Bar dataKey="registrations" fill="hsl(var(--analytics-primary))" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Registration Activity by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={registrationsPerMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="registrations" fill="hsl(var(--analytics-accent))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Total module registrations (sales) per month. Dec 2025 saw the highest activity with 17 registrations.</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock size={16} /> Registration by Time of Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={registrationsByTimeOfDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--analytics-secondary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Fellows register mostly in the <strong>afternoon (12–18h)</strong> with 32 registrations, followed by evenings (26).</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock size={16} /> Registration by Day of Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={registrationsByDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--analytics-support))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Activity is spread throughout the week with peaks on <strong>Fridays</strong> and <strong>Sundays</strong>.</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Rankings Table (Modules by Registrations)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4 font-semibold">Rank</th>
                      <th className="py-2 pr-4 font-semibold">Module</th>
                      <th className="py-2 pr-4 font-semibold">Registrations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moduleRankings.map((m, idx) => <tr key={idx} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-2 pr-4 font-medium">#{idx + 1}</td>
                      <td className="py-2 pr-4">{m.fullTitle}</td>
                      <td className="py-2 pr-4 font-semibold">{m.registrations}</td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
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
                    <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={60} tick={{ fill: "hsl(var(--muted-foreground))" }} />
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
                <Download className="mr-2 h-4 w-4" /> CSV
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
                    {roles.map((r, idx) => <tr key={idx} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-2 pr-4">{r.title}</td>
                      <td className="py-2 pr-4 font-medium">{r.users}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{r.firstActivated}</td>
                    </tr>)}
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
              <CardTitle>Unique Fellows Enrolling by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={enrollmentsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
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
              <CardTitle>Modules Enrolled per Fellow (Ranked)</CardTitle>
              <Button size="sm" onClick={() => downloadCSV("modules_per_fellow.csv", modulesPerFellow)}>
                <Download className="mr-2 h-4 w-4" /> CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4 font-semibold">Rank</th>
                      <th className="py-2 pr-4 font-semibold">Fellow</th>
                      <th className="py-2 pr-4 font-semibold">Modules Enrolled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modulesPerFellow.map((r, idx) => <tr key={idx} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-2 pr-4 font-medium">#{idx + 1}</td>
                      <td className="py-2 pr-4">{r.fellow}</td>
                      <td className="py-2 pr-4 font-medium">{r.modulesEnrolled}</td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <KPIChip icon={Users} label="Active fellows" value={kpis.activeFellows} tone="support" />
            <KPIChip icon={BarChart3} label="Fellows with classes" value={classesPerFellow.filter(f => f.classes > 0).length} tone="secondary" />
            <KPIChip icon={TrendingUp} label="Avg classes/fellow" value={(classesPerFellow.reduce((a, f) => a + f.classes, 0) / classesPerFellow.filter(f => f.classes > 0).length).toFixed(1)} tone="highlight" />
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Top Fellows by Classes Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[...classesPerFellow].sort((a, b) => b.classes - a.classes).slice(0, 12)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" height={70} tick={{ fill: "hsl(var(--muted-foreground))" }} />
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
              <CardTitle>Classes per Fellow — Ranked Top to Least Enrolled</CardTitle>
              <Button size="sm" onClick={() => downloadCSV("classes_per_fellow.csv", classesPerFellow)}>
                <Download className="mr-2 h-4 w-4" /> CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4 font-semibold">Rank</th>
                      <th className="py-2 pr-4 font-semibold">Name</th>
                      <th className="py-2 pr-4 font-semibold">Classes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...classesPerFellow].sort((a, b) => b.classes - a.classes).map((r, idx) => <tr key={idx} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-2 pr-4 font-medium">#{idx + 1}</td>
                      <td className="py-2 pr-4">{r.name}</td>
                      <td className="py-2 pr-4 font-medium">{r.classes}</td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Globe size={16} /> Fellows by Country</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sessionsByCountry} layout="vertical" margin={{ left: 10, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <YAxis dataKey="country" type="category" width={90} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="sessions" fill="hsl(var(--analytics-primary))" radius={[0, 6, 6, 0]} name="Sessions" />
                      <Bar dataKey="fellows" fill="hsl(var(--analytics-accent))" radius={[0, 6, 6, 0]} name="Fellows" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin size={16} /> Fellows by City</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 overflow-y-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-1.5 pr-3 font-semibold">City</th>
                        <th className="py-1.5 pr-3 font-semibold">Country</th>
                        <th className="py-1.5 font-semibold">Sessions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessionsByCity.map((c, idx) => <tr key={idx} className="border-b last:border-0">
                        <td className="py-1.5 pr-3">{c.city}</td>
                        <td className="py-1.5 pr-3 text-muted-foreground">{c.country}</td>
                        <td className="py-1.5 font-medium">{c.sessions}</td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Sessions by Device</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sessionsByDevice} dataKey="sessions" nameKey="device" cx="50%" cy="50%" outerRadius={70} label={({ device, sessions }) => `${device}: ${sessions}`}>
                        {sessionsByDevice.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-2"><strong>80%</strong> of sessions are on desktop; 20% mobile.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sessions by OS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={sessionsByOS} dataKey="sessions" nameKey="os" cx="50%" cy="50%" outerRadius={70} label={({ os, sessions }) => `${os}: ${sessions}`}>
                        {sessionsByOS.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock size={16} /> Sessions per Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sessionsPerMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="sessions" fill="hsl(var(--analytics-support))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-2">May 2025 had the highest session activity with 24 sessions.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock size={16} /> Session Login Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sessionsByTimeOfDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--analytics-accent))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Fellows log in mostly during <strong>afternoons</strong> (24 sessions) and <strong>mornings</strong> (18 sessions).</p>
              </CardContent>
            </Card>
          </div>

          {/* Duration Ranking */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Timer size={16} /> Session Duration Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="rounded-xl border p-4 bg-analytics-support/10">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">🔥 High Duration</div>
                  {durationPerFellow.filter(f => f.tier === "High").map((f, idx) => (
                    <div key={idx} className="flex justify-between py-1 text-sm">
                      <span>{f.fellow}</span>
                      <span className="font-semibold">{f.display}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border p-4 bg-analytics-highlight/10">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">⚡ Medium Duration</div>
                  {durationPerFellow.filter(f => f.tier === "Medium").map((f, idx) => (
                    <div key={idx} className="flex justify-between py-1 text-sm">
                      <span>{f.fellow}</span>
                      <span className="font-semibold">{f.display}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border p-4 bg-analytics-alert/10">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">📉 Low / No Duration</div>
                  {durationPerFellow.filter(f => f.tier === "Low").map((f, idx) => (
                    <div key={idx} className="flex justify-between py-1 text-sm">
                      <span>{f.fellow}</span>
                      <span className="font-semibold">{f.display}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">💡 Duration data from session start/end times. <strong>Kgomotso Mashigo</strong> has the longest total session time (~24h), while several fellows have no recorded duration.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><MapPin size={16} /> Fellow Activity — Time, Location & Device</CardTitle>
              <Button size="sm" onClick={() => downloadCSV("fellow_activity.csv", fellowActivity)}>
                <Download className="mr-2 h-4 w-4" /> CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-4 font-semibold">Fellow</th>
                      <th className="py-2 pr-4 font-semibold">Country</th>
                      <th className="py-2 pr-4 font-semibold">City</th>
                      <th className="py-2 pr-4 font-semibold">Sessions</th>
                      <th className="py-2 pr-4 font-semibold">Peak Time</th>
                      <th className="py-2 pr-4 font-semibold">Device</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fellowActivity.sort((a, b) => b.sessions - a.sessions).map((f, idx) => <tr key={idx} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-2 pr-4 font-medium">{f.fellow}</td>
                      <td className="py-2 pr-4">{f.country}</td>
                      <td className="py-2 pr-4 text-muted-foreground">{f.city}</td>
                      <td className="py-2 pr-4 font-semibold">{f.sessions}</td>
                      <td className="py-2 pr-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          f.peakTime === "Morning" ? "bg-analytics-support text-analytics-support-foreground" :
                          f.peakTime === "Afternoon" ? "bg-analytics-highlight text-analytics-highlight-foreground" :
                          "bg-analytics-accent text-analytics-accent-foreground"
                        }`}>{f.peakTime}</span>
                      </td>
                      <td className="py-2 pr-4">{f.device}</td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                💡 <strong>Key insight:</strong> Most fellows work during <strong>afternoon hours (12–18h)</strong> on <strong>desktops</strong>, primarily from <strong>South Africa</strong>. US-based fellows tend to be active in the <strong>evening</strong>—likely due to timezone alignment with SA afternoon sessions.
              </p>
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
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis allowDecimals={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="entries" stroke="hsl(var(--analytics-primary))" strokeWidth={2} dot={{ fill: "hsl(var(--analytics-primary))" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Message Preview</CardTitle>
              <Button size="sm" onClick={() => downloadCSV("messages.csv", messagePreview)}>
                <Download className="mr-2 h-4 w-4" /> CSV
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
                    {messagePreview.map((m, idx) => <tr key={idx} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-2 pr-4">{m.username}</td>
                      <td className="py-2 pr-4">{m.subject}</td>
                      <td className="py-2 pr-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-analytics-alert text-analytics-alert-foreground">{m.status}</span>
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground">{m.created}</td>
                    </tr>)}
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
    </main>

    <footer className="text-xs text-right px-6 py-6 text-muted-foreground">
      Our Equity — Generated for cohort & sponsors
    </footer>
  </div>;
}
