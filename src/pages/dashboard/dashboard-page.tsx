import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BookOpenText,
  Bookmark,
  CheckCircle2,
  FolderOpen,
  Heart,
  LayoutGrid,
  Mail,
  MessageSquareText,
  Rocket,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/magicui/tilt-card";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { usePostStats, usePosts } from "@/hooks/use-post";
import { useSeriesStats } from "@/hooks/use-series";
import { useCategoryStats } from "@/hooks/use-category";
import { useTagStats } from "@/hooks/use-tags";
import { useProfileStats } from "@/hooks/use-profile";
import { useCommentStats, useComments } from "@/hooks/use-comment";
import { useBookmarkStats } from "@/hooks/use-bookmark";
import { useLikeStats } from "@/hooks/use-like";
import {
  useNewsletterSubscriberStats,
  useNewsletterSubscribers,
} from "@/hooks/use-newsletter-subscriber";

function StatCard({
  title,
  value,
  icon: Icon,
  glowClass,
}: {
  title: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  glowClass: string;
}) {
  return (
    <TiltCard className="h-full">
      <Card className="h-full overflow-hidden border-border/60 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            <div className={`rounded-xl p-2.5 ${glowClass}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </TiltCard>
  );
}

function QuickAction({
  title,
  desc,
  onClick,
  icon: Icon,
}: {
  title: string;
  desc: string;
  onClick: () => void;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full rounded-xl border border-border/60 bg-background/50 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-brand-blue/40 hover:shadow-[0_8px_20px_rgba(59,130,246,0.12)]"
    >
      <div className="mb-2 flex items-center gap-2">
        <div className="rounded-lg bg-brand-blue/10 p-2 text-brand-blue">
          <Icon className="h-4 w-4" />
        </div>
        <p className="font-semibold">{title}</p>
      </div>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </button>
  );
}

function MiniProgress({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const ratio = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500"
          style={{ width: `${ratio}%` }}
        />
      </div>
    </div>
  );
}

function FancyTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/70 bg-card/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1 space-y-1">
        {payload.map((p, i) => (
          <div key={`${p.name}-${i}`} className="flex items-center justify-between gap-3 text-xs">
            <span className="font-medium">{p.name}</span>
            <span className="font-semibold">{p.value ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false,
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navigate = useNavigate();
  const postStats = usePostStats();
  const seriesStats = useSeriesStats();
  const categoryStats = useCategoryStats();
  const tagStats = useTagStats();
  const profileStats = useProfileStats();
  const commentStats = useCommentStats();
  const bookmarkStats = useBookmarkStats();
  const likeStats = useLikeStats();
  const newsletterStats = useNewsletterSubscriberStats();
  const recentPosts = usePosts({ page: 1, pageSize: 5, sort: "newest" });
  const recentComments = useComments({
    page: 1,
    pageSize: 5,
    sort: "newest",
    status: "all",
  });
  const recentSubscribers = useNewsletterSubscribers({
    page: 1,
    pageSize: 5,
    sort: "newest",
    active: "all",
  });

  const isLoading =
    postStats.isLoading ||
    seriesStats.isLoading ||
    categoryStats.isLoading ||
    tagStats.isLoading ||
    profileStats.isLoading ||
    commentStats.isLoading ||
    bookmarkStats.isLoading ||
    likeStats.isLoading ||
    newsletterStats.isLoading;

  const totals = useMemo(
    () => ({
      posts: postStats.data?.total ?? 0,
      series: seriesStats.data?.total ?? 0,
      categories: categoryStats.data?.total ?? 0,
      tags: tagStats.data?.total ?? 0,
      profiles: profileStats.data?.total ?? 0,
      comments: commentStats.data?.total ?? 0,
      bookmarks: bookmarkStats.data?.total ?? 0,
      likes: likeStats.data?.total ?? 0,
      newsletter: newsletterStats.data?.total ?? 0,
    }),
    [
      bookmarkStats.data?.total,
      categoryStats.data?.total,
      commentStats.data?.total,
      likeStats.data?.total,
      newsletterStats.data?.total,
      postStats.data?.total,
      profileStats.data?.total,
      seriesStats.data?.total,
      tagStats.data?.total,
    ],
  );

  const contentDistribution = [
    { name: "Yazılar", value: totals.posts, color: "#3b82f6" },
    { name: "Seriler", value: totals.series, color: "#8b5cf6" },
    { name: "Kategoriler", value: totals.categories, color: "#10b981" },
    { name: "Etiketler", value: totals.tags, color: "#f59e0b" },
  ];
  const totalContent = contentDistribution.reduce((sum, item) => sum + item.value, 0);

  const engagementData = [
    { name: "Yorum", bar: totals.comments, trend: totals.comments + 3, goal: 20 },
    { name: "Kaydet", bar: totals.bookmarks, trend: totals.bookmarks + 2, goal: 16 },
    { name: "Beğeni", bar: totals.likes, trend: totals.likes + 4, goal: 30 },
    { name: "Abone", bar: totals.newsletter, trend: totals.newsletter + 1, goal: 12 },
  ];

  const healthData = [
    { name: "Toplam Profil", value: totals.profiles },
    { name: "Aktif Profil", value: profileStats.data?.active ?? 0 },
    { name: "Admin", value: profileStats.data?.admins ?? 0 },
  ];

  const activityRows = [
    ...(recentPosts.data?.data ?? []).map((p) => ({
      type: "Yazı",
      title: p.title,
      meta: p.created_at,
    })),
    ...(recentComments.data?.data ?? []).map((c) => ({
      type: "Yorum",
      title: c.content.slice(0, 42) || "Yorum",
      meta: c.created_at,
    })),
    ...(recentSubscribers.data?.data ?? []).map((s) => ({
      type: "Abone",
      title: s.email,
      meta: s.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.meta).getTime() - new Date(a.meta).getTime())
    .slice(0, 7);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-sm">
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-brand-blue/20 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-brand-purple/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              <AnimatedGradientText>Yönetim Paneli</AnimatedGradientText>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              İçerik üretimi, etkileşim ve kullanıcı verileri tek ekranda.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate("/posts/create")}>
              Yeni Yazı
            </Button>
            <Button
              onClick={() => navigate("/newsletter-subscribers")}
              className="border-0 text-white"
              style={{
                background: "linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6)",
              }}
            >
              Aboneleri Gör
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Yazılar"
            value={totals.posts}
            icon={BookOpenText}
            glowClass="bg-brand-blue/10 text-brand-blue"
          />
          <StatCard
            title="Yorumlar"
            value={totals.comments}
            icon={MessageSquareText}
            glowClass="bg-brand-green/10 text-brand-green"
          />
          <StatCard
            title="Beğeniler"
            value={totals.likes}
            icon={Heart}
            glowClass="bg-rose-500/10 text-rose-500"
          />
          <StatCard
            title="Kaydedilenler"
            value={totals.bookmarks}
            icon={Bookmark}
            glowClass="bg-brand-purple/10 text-brand-purple"
          />
          <StatCard
            title="Kategoriler"
            value={totals.categories}
            icon={FolderOpen}
            glowClass="bg-amber-500/10 text-amber-500"
          />
          <StatCard
            title="Etiketler"
            value={totals.tags}
            icon={Tag}
            glowClass="bg-cyan-500/10 text-cyan-500"
          />
          <StatCard
            title="Profiller"
            value={totals.profiles}
            icon={Users}
            glowClass="bg-indigo-500/10 text-indigo-500"
          />
          <StatCard
            title="Bülten Aboneleri"
            value={totals.newsletter}
            icon={Mail}
            glowClass="bg-emerald-500/10 text-emerald-500"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-12">
        <Card className="border-border/60 bg-card/80 backdrop-blur-sm 2xl:col-span-8">
            <CardHeader>
              <CardTitle>Etkileşim Grafiği</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] sm:h-[360px] 2xl:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={engagementData}>
                  <defs>
                    <linearGradient id="engBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.55} />
                    </linearGradient>
                    <linearGradient id="engArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    interval={0}
                  />
                  <YAxis allowDecimals={false} hide={isMobile} />
                  <Tooltip content={<FancyTooltip />} />
                  {!isMobile && (
                    <Area
                      type="monotone"
                      dataKey="trend"
                      name="Trend"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fill="url(#engArea)"
                    />
                  )}
                  <Bar
                    dataKey="bar"
                    name="Gerçek"
                    radius={[10, 10, 0, 0]}
                    fill="url(#engBar)"
                    barSize={isMobile ? 22 : 38}
                  />
                  {!isMobile && (
                    <Line
                      type="monotone"
                      dataKey="goal"
                      name="Hedef"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="6 4"
                      dot={{ r: 3 }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        <Card className="border-border/60 bg-card/80 backdrop-blur-sm 2xl:col-span-4">
            <CardHeader>
              <CardTitle>İçerik Dağılımı</CardTitle>
            </CardHeader>
            <CardContent className="grid h-[330px] grid-cols-1 gap-3 sm:h-[360px] sm:grid-cols-[1fr_170px] sm:items-center 2xl:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={isMobile ? "45%" : 78}
                    outerRadius={isMobile ? "72%" : 116}
                    cornerRadius={8}
                    paddingAngle={2}
                  >
                    {contentDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  {!isMobile && (
                    <>
                      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-[13px] font-medium">
                        Toplam
                      </text>
                      <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-xl font-bold">
                        {totalContent}
                      </text>
                    </>
                  )}
                  <Tooltip content={<FancyTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {contentDistribution.map((item) => {
                  const pct = totalContent > 0 ? Math.round((item.value / totalContent) * 100) : 0;
                  return (
                    <div key={item.name} className="rounded-lg border border-border/50 bg-background/50 px-2.5 py-2 transition-transform duration-200 hover:-translate-y-0.5">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          {item.name}
                        </span>
                        <span className="font-semibold">{pct}%</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">{item.value} kayıt</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-border/60 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Canlı Aktivite Akışı</CardTitle>
            <span className="rounded-full bg-brand-blue/10 px-2.5 py-1 text-xs font-semibold text-brand-blue">
              Son 7 işlem
            </span>
          </CardHeader>
          <CardContent>
            {!activityRows.length ? (
              <p className="text-sm text-muted-foreground">Henüz aktivite yok.</p>
            ) : (
              <div className="space-y-2">
                {activityRows.map((row, idx) => (
                  <div
                    key={`${row.type}-${idx}`}
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-3"
                  >
                    <div className="rounded-lg bg-brand-purple/10 p-2 text-brand-purple">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{row.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.type} ·{" "}
                        {new Date(row.meta).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Hızlı İşlemler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <QuickAction
              title="Yazı Oluştur"
              desc="Yeni içerik yayın akışını başlat."
              onClick={() => navigate("/posts/create")}
              icon={Rocket}
            />
            <QuickAction
              title="Yorumlar"
              desc="Son yorumları incele ve moderasyon yap."
              onClick={() => navigate("/comments")}
              icon={MessageSquareText}
            />
            <QuickAction
              title="Aboneler"
              desc="Bülten listesini güncelle ve filtrele."
              onClick={() => navigate("/newsletter-subscribers")}
              icon={Mail}
            />
            <QuickAction
              title="İçerikler"
              desc="Kategori, etiket ve seri yapılarını yönet."
              onClick={() => navigate("/categories")}
              icon={LayoutGrid}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-border/60 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Profil Sağlığı</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData}>
                <defs>
                  <linearGradient id="profileGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="url(#profileGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Hedef Takibi</CardTitle>
            <TrendingUp className="h-4 w-4 text-brand-green" />
          </CardHeader>
          <CardContent className="space-y-4">
            <MiniProgress label="Yazı Hedefi (100)" value={totals.posts} max={100} />
            <MiniProgress label="Yorum Hedefi (250)" value={totals.comments} max={250} />
            <MiniProgress
              label="Abone Hedefi (500)"
              value={totals.newsletter}
              max={500}
            />
            <MiniProgress label="Beğeni Hedefi (1000)" value={totals.likes} max={1000} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
