import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSpreadsheet, Loader2, ExternalLink, Users, CheckCircle, TrendingUp, Award, Download } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays, isAfter, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const LEVEL_COLORS = { A1: '#ef4444', A2: '#f97316', B1: '#3b82f6', B2: '#10b981', C1: '#8b5cf6', C2: '#06b6d4' };

export default function Admin() {
  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState(null);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState('month');

  const { data: results = [] } = useQuery({
    queryKey: ['testResults'],
    queryFn: () => base44.entities.TestResult.list('-created_date')
  });

  const { data: trainerSessions = [] } = useQuery({
    queryKey: ['trainerSessions'],
    queryFn: () => base44.entities.TrainerSession.list('-created_date')
  });

  const allSessions = useMemo(() => [...results, ...trainerSessions], [results, trainerSessions]);

  const filteredResults = useMemo(() => {
    const now = new Date();
    let cutoff;
    if (dateFilter === 'week') cutoff = subDays(now, 7);
    else if (dateFilter === 'month') cutoff = subDays(now, 30);
    else if (dateFilter === '3months') cutoff = subDays(now, 90);
    else return results;
    return results.filter(r => isAfter(parseISO(r.created_date), cutoff));
  }, [results, dateFilter]);

  // Distribution des niveaux
  const levelDistribution = useMemo(() => {
    const counts = {};
    allSessions.forEach(r => {
      if (r.level) counts[r.level] = (counts[r.level] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [allSessions]);

  // Évolution score moyen sur 30 jours
  const scoreEvolution = useMemo(() => {
    const days = {};
    results.forEach(r => {
      const day = format(parseISO(r.created_date), 'dd/MM');
      if (!days[day]) days[day] = { scores: [], date: day };
      days[day].scores.push(r.score || 0);
    });
    return Object.values(days)
      .slice(-14)
      .map(d => ({ date: d.date, score: Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length) }));
  }, [results]);

  // KPIs
  const thisMonthCount = useMemo(() => {
    const cutoff = subDays(new Date(), 30);
    return allSessions.filter(r => isAfter(parseISO(r.created_date), cutoff)).length;
  }, [allSessions]);

  const avgScore = useMemo(() => {
    if (!filteredResults.length) return 0;
    return Math.round(filteredResults.reduce((s, r) => s + (r.score || 0), 0) / filteredResults.length);
  }, [filteredResults]);

  const mostFrequentLevel = useMemo(() => {
    if (!levelDistribution.length) return '-';
    return levelDistribution.sort((a, b) => b.value - a.value)[0]?.name || '-';
  }, [levelDistribution]);

  const handleExport = async () => {
    setExporting(true);
    setError('');
    setExportResult(null);
    try {
      const response = await base44.functions.invoke('exportToSheets');
      if (response.data.error) setError(response.data.error);
      else setExportResult(response.data);
    } catch (err) {
      setError(err.message || "Erreur lors de l'export");
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Nom', 'Email', 'Téléphone', 'Score', 'Niveau', 'Durée (min)', 'Date'];
    const rows = results.map(r => [
      r.candidate_name || '',
      r.candidate_email || '',
      r.candidate_phone || '',
      r.score || 0,
      r.level || '',
      Math.round((r.duration_seconds || 0) / 60),
      format(parseISO(r.created_date), 'dd/MM/yyyy HH:mm')
    ]);
    const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultats_pef_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#17c3b2]/5 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard Admin</h1>
            <p className="text-gray-600">Vue d'ensemble et export des résultats</p>
          </div>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois (30j)</SelectItem>
              <SelectItem value="3months">3 derniers mois</SelectItem>
              <SelectItem value="all">Tout</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total sessions', value: allSessions.length, icon: Users, color: 'text-[#00504e]' },
            { label: 'Score moyen', value: avgScore + '%', icon: TrendingUp, color: 'text-blue-600' },
            { label: 'Niveau fréquent', value: mostFrequentLevel, icon: Award, color: 'text-purple-600' },
            { label: 'Ce mois', value: thisMonthCount, icon: CheckCircle, color: 'text-green-600' },
          ].map((kpi, i) => (
            <Card key={i}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
                    <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  </div>
                  <kpi.icon className={`w-7 h-7 ${kpi.color} opacity-70`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Distribution niveaux */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribution des niveaux CECRL</CardTitle>
            </CardHeader>
            <CardContent>
              {levelDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={levelDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                      {levelDistribution.map((entry) => (
                        <Cell key={entry.name} fill={LEVEL_COLORS[entry.name] || '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">Aucune donnée</div>
              )}
            </CardContent>
          </Card>

          {/* Évolution scores */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Évolution du score moyen</CardTitle>
            </CardHeader>
            <CardContent>
              {scoreEvolution.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={scoreEvolution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => v + '%'} />
                    <Line type="monotone" dataKey="score" stroke="#17c3b2" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">Aucune donnée</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Export Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Download className="w-4 h-4 text-[#00504e]" />
                Export CSV
              </CardTitle>
              <CardDescription>Télécharger tous les résultats en CSV</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleExportCSV}
                disabled={results.length === 0}
                className="w-full h-11 bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger CSV ({results.length} résultats)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileSpreadsheet className="w-4 h-4 text-[#00504e]" />
                Export Google Sheets
              </CardTitle>
              <CardDescription>Exporter vers Google Drive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {error && (
                <Alert className="border-red-200 bg-red-50 py-2">
                  <AlertDescription className="text-red-900 text-sm">{error}</AlertDescription>
                </Alert>
              )}
              {exportResult && (
                <Alert className="border-green-200 bg-green-50 py-2">
                  <AlertDescription className="text-green-900 text-sm flex items-center justify-between">
                    <span><strong>Exporté !</strong> {exportResult.recordsExported} résultats</span>
                    <a href={exportResult.url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 h-7 text-xs">
                        Ouvrir <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </a>
                  </AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handleExport}
                disabled={exporting || results.length === 0}
                className="w-full h-11 bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90"
              >
                {exporting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Export en cours...</>
                ) : (
                  <><FileSpreadsheet className="w-4 h-4 mr-2" />Exporter vers Sheets</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Prospects récents */}
        <Card>
          <CardHeader>
            <CardTitle>Prospects récents</CardTitle>
            <CardDescription>🔥 = Test complété il y a moins de 7 jours (offre active)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-500 text-xs">
                    <th className="text-left py-2 px-2">Candidat</th>
                    <th className="text-left py-2 px-2 hidden md:table-cell">Email</th>
                    <th className="text-center py-2 px-2">Score</th>
                    <th className="text-center py-2 px-2">Niveau</th>
                    <th className="text-right py-2 px-2 hidden sm:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 15).map((result) => {
                    const daysSinceTest = Math.floor((new Date() - new Date(result.created_date)) / (1000 * 60 * 60 * 24));
                    const isHot = daysSinceTest <= 7;
                    return (
                      <tr key={result.id} className={`border-b last:border-0 ${isHot ? 'bg-orange-50' : ''}`}>
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-1">
                            {isHot && <span className="text-base">🔥</span>}
                            <div>
                              <p className="font-medium text-gray-900">{result.candidate_name}</p>
                              {result.candidate_phone && (
                                <a href={`tel:${result.candidate_phone}`} className="text-xs text-[#17c3b2]">{result.candidate_phone}</a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-gray-500 hidden md:table-cell">{result.candidate_email}</td>
                        <td className="py-2 px-2 text-center font-bold text-[#00504e]">{result.score}%</td>
                        <td className="py-2 px-2 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold text-white`} style={{ backgroundColor: LEVEL_COLORS[result.level] || '#94a3b8' }}>
                            {result.level}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right text-gray-400 text-xs hidden sm:table-cell">
                          {format(parseISO(result.created_date), 'dd/MM/yyyy')}
                        </td>
                      </tr>
                    );
                  })}
                  {results.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-400">Aucun résultat</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}