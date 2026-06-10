import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users, CheckCircle, Clock, TrendingUp, Mail, Phone, Download, Plus, Copy, Link as LinkIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

export default function Sessions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCandidate, setNewCandidate] = useState({ name: '', email: '', phone: '' });
  const [generatedLink, setGeneratedLink] = useState('');

  const { data: freeSessions = [], isLoading: loadingFree } = useQuery({
    queryKey: ['freeSessions'],
    queryFn: () => base44.entities.FreeTestSession.list('-created_date', 100),
  });

  const { data: paidResults = [], isLoading: loadingPaid } = useQuery({
    queryKey: ['paidResults'],
    queryFn: () => base44.entities.TestResult.list('-created_date', 100),
  });

  const { data: trainerSessions = [], isLoading: loadingTrainer } = useQuery({
    queryKey: ['trainerSessions'],
    queryFn: () => base44.entities.TrainerSession.list('-created_date', 100),
  });

  const trainerName = localStorage.getItem('trainer_name') || 'Formateur';

  const filterSession = (item) => {
    const matchSearch = !searchTerm ||
      item.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.candidate_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.trainer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = levelFilter === 'all' || item.level === levelFilter;
    return matchSearch && matchLevel;
  };

  const filteredFreeSessions = freeSessions.filter(s => !s.has_paid).filter(filterSession);
  const filteredPaidResults = paidResults.filter(filterSession);
  const filteredTrainerSessions = trainerSessions.filter(filterSession);

  const handleGenerateLink = () => {
    if (!newCandidate.name || !newCandidate.email || !newCandidate.phone) return;
    const params = new URLSearchParams({
      name: newCandidate.name,
      email: newCandidate.email,
      phone: newCandidate.phone,
      trainer: 'true',
      trainerName: trainerName,
    });
    const link = `${window.location.origin}/Test?${params.toString()}`;
    setGeneratedLink(link);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success('Lien copié dans le presse-papiers !');
  };

  const handleExportCSV = (data, filename) => {
    const headers = ['Nom', 'Email', 'Téléphone', 'Score', 'Niveau', 'Date'];
    const rows = data.map(r => [
      r.candidate_name || '',
      r.candidate_email || '',
      r.candidate_phone || '',
      r.score !== undefined ? r.score + '%' : '',
      r.level || '',
      r.created_date ? format(parseISO(r.created_date), 'dd/MM/yyyy HH:mm') : ''
    ]);
    const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#17c3b2]/5 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Sessions</h1>
            <p className="text-gray-600">Suivi des candidats et résultats</p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-[#00504e] to-[#17c3b2] hover:opacity-90 h-10 shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer une session candidat
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Tests gratuits', value: freeSessions.length, icon: Clock, color: 'text-orange-500' },
            { label: 'Non convertis', value: freeSessions.filter(s => !s.has_paid).length, icon: Users, color: 'text-red-600' },
            { label: 'Tests complets', value: paidResults.length, icon: CheckCircle, color: 'text-green-600' },
            { label: 'Taux conversion', value: freeSessions.length > 0 ? Math.round((paidResults.length / freeSessions.length) * 100) + '%' : '0%', icon: TrendingUp, color: 'text-[#17c3b2]' },
          ].map((s, i) => (
            <Card key={i}>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                  <s.icon className={`w-6 h-6 ${s.color} opacity-70`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full sm:w-40 h-11">
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous niveaux</SelectItem>
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(l => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="trainer" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trainer" className="text-xs md:text-sm">
              Formateurs ({filteredTrainerSessions.length})
            </TabsTrigger>
            <TabsTrigger value="paid" className="text-xs md:text-sm">
              Tests complets ({filteredPaidResults.length})
            </TabsTrigger>
            <TabsTrigger value="free" className="text-xs md:text-sm">
              Partiels ({filteredFreeSessions.length})
            </TabsTrigger>
          </TabsList>

          {/* Trainer Sessions */}
          <TabsContent value="trainer">
            <div className="flex justify-end mb-3">
              <Button variant="outline" size="sm" onClick={() => handleExportCSV(trainerSessions, 'sessions_formateurs.csv')}>
                <Download className="w-3 h-3 mr-1" /> Exporter CSV
              </Button>
            </div>
            <SessionList sessions={filteredTrainerSessions} loading={loadingTrainer} type="trainer" />
          </TabsContent>

          {/* Paid Tests */}
          <TabsContent value="paid">
            <div className="flex justify-end mb-3">
              <Button variant="outline" size="sm" onClick={() => handleExportCSV(paidResults, 'tests_complets.csv')}>
                <Download className="w-3 h-3 mr-1" /> Exporter CSV
              </Button>
            </div>
            <SessionList sessions={filteredPaidResults} loading={loadingPaid} type="paid" />
          </TabsContent>

          {/* Free Sessions */}
          <TabsContent value="free">
            <SessionList sessions={filteredFreeSessions} loading={loadingFree} type="free" />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Session Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => { setShowCreateDialog(open); if (!open) { setGeneratedLink(''); setNewCandidate({ name: '', email: '', phone: '' }); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#00504e]">
              <LinkIcon className="w-5 h-5" />
              Créer un lien de session
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {!generatedLink ? (
              <>
                <div className="space-y-2">
                  <Label>Nom du candidat</Label>
                  <Input placeholder="Jean Martin" value={newCandidate.name} onChange={e => setNewCandidate(p => ({ ...p, name: e.target.value }))} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Email du candidat</Label>
                  <Input type="email" placeholder="jean@email.com" value={newCandidate.email} onChange={e => setNewCandidate(p => ({ ...p, email: e.target.value }))} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone du candidat</Label>
                  <Input type="tel" placeholder="06 12 34 56 78" value={newCandidate.phone} onChange={e => setNewCandidate(p => ({ ...p, phone: e.target.value }))} className="h-11 rounded-xl" />
                </div>
                <Button
                  onClick={handleGenerateLink}
                  disabled={!newCandidate.name || !newCandidate.email || !newCandidate.phone}
                  className="w-full h-11 bg-gradient-to-r from-[#00504e] to-[#17c3b2]"
                >
                  Générer le lien
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-800 font-medium mb-2">✅ Lien généré pour {newCandidate.name}</p>
                  <p className="text-xs text-green-700 break-all bg-white rounded p-2 border border-green-200">{generatedLink}</p>
                </div>
                <Button onClick={handleCopyLink} className="w-full h-11 bg-gradient-to-r from-[#00504e] to-[#17c3b2]">
                  <Copy className="w-4 h-4 mr-2" />
                  Copier le lien
                </Button>
                <Button variant="outline" onClick={() => setGeneratedLink('')} className="w-full h-11">
                  Créer un autre lien
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SessionList({ sessions, loading, type }) {
  if (loading) return <p className="text-center text-gray-500 py-8">Chargement...</p>;
  if (sessions.length === 0) return <p className="text-center text-gray-500 py-8">Aucune session trouvée</p>;

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <Card key={session.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 md:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h3 className="font-semibold text-gray-900 truncate">{session.candidate_name}</h3>
                  {type === 'trainer' && session.trainer_name && (
                    <Badge className="bg-purple-100 text-purple-800 text-xs shrink-0">
                      {session.trainer_name}
                    </Badge>
                  )}
                  {type === 'free' && <Badge className="bg-orange-100 text-orange-800 text-xs shrink-0">Partiel</Badge>}
                  {type === 'paid' && <Badge className="bg-green-100 text-green-800 text-xs shrink-0">✓ Complet</Badge>}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  {session.candidate_email && (
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{session.candidate_email}</span>
                  )}
                  {session.candidate_phone && (
                    <a href={`tel:${session.candidate_phone}`} className="flex items-center gap-1 text-[#17c3b2] hover:underline">
                      <Phone className="w-3 h-3" />{session.candidate_phone}
                    </a>
                  )}
                  {session.created_date && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(parseISO(session.created_date), 'dd/MM/yyyy HH:mm')}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                {session.score !== undefined && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Score</p>
                    <p className="text-xl font-bold text-[#00504e]">{session.score}%</p>
                  </div>
                )}
                {session.level && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-0.5">Niveau</p>
                    <Badge className="bg-[#17c3b2] text-white text-sm px-3 py-0.5">{session.level}</Badge>
                  </div>
                )}
                {type === 'free' && session.partial_score !== undefined && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Score</p>
                    <p className="text-xl font-bold text-orange-600">{session.partial_score}/5</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}