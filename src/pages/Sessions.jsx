import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, CheckCircle, Clock, TrendingUp, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Sessions() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: freeSessions = [], isLoading: loadingFree } = useQuery({
    queryKey: ['freeSessions'],
    queryFn: () => base44.entities.FreeTestSession.list('-created_date', 100),
  });

  const { data: paidResults = [], isLoading: loadingPaid } = useQuery({
    queryKey: ['paidResults'],
    queryFn: () => base44.entities.TestResult.list('-created_date', 100),
  });

  const filteredFreeSessions = freeSessions.filter(session =>
    session.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.candidate_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPaidResults = paidResults.filter(result =>
    result.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.candidate_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const notPaidSessions = filteredFreeSessions.filter(s => !s.has_paid);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#17c3b2]/5 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sessions Formateurs</h1>
          <p className="text-gray-600">Suivi des candidats et résultats des tests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tests gratuits</p>
                  <p className="text-2xl font-bold text-[#00504e]">{freeSessions.length}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Non convertis</p>
                  <p className="text-2xl font-bold text-red-600">{notPaidSessions.length}</p>
                </div>
                <Users className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tests complets</p>
                  <p className="text-2xl font-bold text-green-600">{paidResults.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux conversion</p>
                  <p className="text-2xl font-bold text-[#17c3b2]">
                    {freeSessions.length > 0 ? Math.round((paidResults.length / freeSessions.length) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#17c3b2]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="free" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="free">
              Tests gratuits ({notPaidSessions.length})
            </TabsTrigger>
            <TabsTrigger value="paid">
              Tests payés ({filteredPaidResults.length})
            </TabsTrigger>
          </TabsList>

          {/* Free Tests Tab */}
          <TabsContent value="free">
            <div className="space-y-4">
              {loadingFree ? (
                <p className="text-center text-gray-500 py-8">Chargement...</p>
              ) : notPaidSessions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Aucune session gratuite trouvée</p>
              ) : (
                notPaidSessions.map((session) => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {session.candidate_name}
                            </h3>
                            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                              Test partiel
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {session.candidate_email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {session.candidate_phone}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-4 h-4" />
                              {format(new Date(session.created_date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Score</p>
                            <p className="text-2xl font-bold text-[#00504e]">
                              {session.partial_score}/5
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Niveau estimé</p>
                            <Badge className="bg-[#17c3b2]/10 text-[#00504e]">
                              {session.estimated_level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Paid Tests Tab */}
          <TabsContent value="paid">
            <div className="space-y-4">
              {loadingPaid ? (
                <p className="text-center text-gray-500 py-8">Chargement...</p>
              ) : filteredPaidResults.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Aucun test payé trouvé</p>
              ) : (
                filteredPaidResults.map((result) => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {result.candidate_name}
                            </h3>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Test complet
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {result.candidate_email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {result.candidate_phone}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-4 h-4" />
                              {format(new Date(result.created_date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Score</p>
                            <p className="text-2xl font-bold text-[#00504e]">
                              {result.score}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-1">Niveau CECRL</p>
                            <Badge className="bg-[#17c3b2] text-white text-lg px-4 py-1">
                              {result.level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}