import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  Download,
  Sparkles,
  ExternalLink,
  Mail,
  Globe,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Plus,
  MessageSquare,
  Search,
  Filter,
  Share2,
  Calendar
} from 'lucide-react';
import { SavedLead, LeadStatus, PlanType } from '../types';

interface SavedLeadsPageProps {
  savedLeads: SavedLead[];
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onUpdateNotes: (leadId: string, notes: string) => void;
  onRemoveSavedLead: (leadId: string) => void;
  onOpenOutreach: (lead: SavedLead) => void;
  onExportCSV: () => void;
  activePlan: PlanType;
}

export const SavedLeadsPage: React.FC<SavedLeadsPageProps> = ({
  savedLeads,
  onUpdateStatus,
  onUpdateNotes,
  onRemoveSavedLead,
  onOpenOutreach,
  onExportCSV,
  activePlan
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Pipeline Statistics
  const stats = useMemo(() => {
    const total = savedLeads.length;
    const newCount = savedLeads.filter((l) => l.status === 'New').length;
    const contactedCount = savedLeads.filter((l) => l.status === 'Contacted').length;
    const repliedCount = savedLeads.filter((l) => l.status === 'Replied').length;
    const wonCount = savedLeads.filter((l) => l.status === 'Won').length;
    const lostCount = savedLeads.filter((l) => l.status === 'Lost').length;

    const replyRate = contactedCount > 0 ? Math.round((repliedCount / contactedCount) * 100) : 0;
    const estimatedValue = wonCount * 2500; // 2500 € estimated deal value

    return { total, newCount, contactedCount, repliedCount, wonCount, lostCount, replyRate, estimatedValue };
  }, [savedLeads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return savedLeads.filter((lead) => {
      if (statusFilter !== 'All' && lead.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = lead.name.toLowerCase().includes(q);
        const matchNotes = lead.notes.toLowerCase().includes(q);
        const matchNiche = lead.niche.toLowerCase().includes(q);
        const matchLocation = lead.location.toLowerCase().includes(q);
        if (!matchName && !matchNotes && !matchNiche && !matchLocation) return false;
      }
      return true;
    });
  }, [savedLeads, statusFilter, searchQuery]);

  const handleEditNotes = (lead: SavedLead) => {
    setEditingNotesId(lead.id);
    setTempNotes(lead.notes || '');
  };

  const handleSaveNotes = (leadId: string) => {
    onUpdateNotes(leadId, tempNotes);
    setEditingNotesId(null);
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'New':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Contacted':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Replied':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Won':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Lost':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'All': return 'Tous';
      case 'New': return 'Nouveau';
      case 'Contacted': return 'Contacté';
      case 'Replied': return 'Répondu';
      case 'Won': return 'Gagné';
      case 'Lost': return 'Perdu';
      default: return status;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Title & Export Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-blue-600 fill-blue-600" />
            Prospects enregistrés & Suivi du Pipeline
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Gérez votre prospection commerciale active, suivez le statut de vos opportunités, mettez à jour vos notes et exportez vers CSV.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exporter CSV</span>
          </button>
        </div>
      </div>

      {/* Pipeline Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Enregistrés</p>
          <p className="text-2xl font-extrabold text-slate-900">{stats.total}</p>
          <p className="text-[11px] text-slate-400">Prospects dans le CRM</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <p className="text-xs font-semibold text-amber-700 uppercase">Contactés</p>
          <p className="text-2xl font-extrabold text-amber-600">{stats.contactedCount}</p>
          <p className="text-[11px] text-slate-400">Messages envoyés</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <p className="text-xs font-semibold text-purple-700 uppercase">Ont répondu</p>
          <p className="text-2xl font-extrabold text-purple-600">{stats.repliedCount}</p>
          <p className="text-[11px] text-slate-400">{stats.replyRate}% Taux de réponse</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <p className="text-xs font-semibold text-emerald-700 uppercase">Contrats Gagnés</p>
          <p className="text-2xl font-extrabold text-emerald-600">{stats.wonCount}</p>
          <p className="text-[11px] text-slate-400">Clients signés</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1 col-span-2 lg:col-span-1">
          <p className="text-xs font-semibold text-blue-700 uppercase">Chiffre d'Affaires Est.</p>
          <p className="text-2xl font-extrabold text-blue-600">{stats.estimatedValue.toLocaleString()} €</p>
          <p className="text-[11px] text-slate-400">Basé sur 2 500 € par contrat</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium bg-slate-100 p-1 rounded-xl">
            {['All', 'New', 'Contacted', 'Replied', 'Won', 'Lost'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-blue-600 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {getStatusLabel(st)}
                {st === 'All' && ` (${savedLeads.length})`}
                {st === 'New' && ` (${stats.newCount})`}
                {st === 'Contacted' && ` (${stats.contactedCount})`}
                {st === 'Replied' && ` (${stats.repliedCount})`}
                {st === 'Won' && ` (${stats.wonCount})`}
                {st === 'Lost' && ` (${stats.lostCount})`}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des prospects ou notes..."
              className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* Saved Leads List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Aucun prospect dans cette étape</h3>
            <p className="text-xs text-slate-500">
              {savedLeads.length === 0
                ? "Vous n'avez pas encore enregistré de prospects. Rendez-vous sur le tableau de recherche pour trouver et sauvegarder des clients potentiels."
                : 'Aucun prospect ne correspond au filtre sélectionné.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-600">
                  <th className="p-4">Info Prospect</th>
                  <th className="p-4">Étape du Pipeline</th>
                  <th className="p-4 max-w-sm">Notes & Activité</th>
                  <th className="p-4">Date d'enregistrement</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Lead Info */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm">{lead.name}</div>
                      <div className="mt-1 flex items-center gap-2 text-slate-500">
                        <span className="text-[11px]">{lead.location}</span>
                        <span>•</span>
                        <span className="text-[11px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">
                          {lead.niche}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        {lead.website && (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <Globe className="w-3 h-3" /> Site Web
                          </a>
                        )}
                        {lead.contactEmail && (
                          <a
                            href={`mailto:${lead.contactEmail}`}
                            className="text-slate-600 hover:text-blue-600 flex items-center gap-1 text-[11px]"
                          >
                            <Mail className="w-3 h-3 text-slate-400" /> {lead.contactEmail}
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Status Dropdown Selector */}
                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={(e) => onUpdateStatus(lead.id, e.target.value as LeadStatus)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        <option value="New">Nouveau</option>
                        <option value="Contacted">Contacté</option>
                        <option value="Replied">Répondu</option>
                        <option value="Won">Gagné 🎉</option>
                        <option value="Lost">Perdu</option>
                      </select>
                    </td>

                    {/* Notes & Activity */}
                    <td className="p-4 max-w-sm">
                      {editingNotesId === lead.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            placeholder="Ajoutez des notes d'appels, dates de relance, rappels..."
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-2.5 py-1 text-slate-600 font-medium hover:bg-slate-100 rounded-lg text-xs"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={() => handleSaveNotes(lead.id)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs"
                            >
                              Enregistrer
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="group relative bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start justify-between gap-2">
                          <p className="text-slate-700 text-xs leading-relaxed italic">
                            {lead.notes || 'Aucune note pour le moment.'}
                          </p>
                          <button
                            onClick={() => handleEditNotes(lead)}
                            className="text-slate-400 hover:text-blue-600 p-1 rounded transition-colors cursor-pointer shrink-0"
                            title="Modifier les notes"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Saved Date */}
                    <td className="p-4 text-slate-500 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(lead.savedAt).toLocaleDateString('fr-FR', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right space-y-1.5">
                      <button
                        onClick={() => onOpenOutreach(lead)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Prospection IA</span>
                      </button>

                      <button
                        onClick={() => onRemoveSavedLead(lead.id)}
                        className="w-full text-slate-400 hover:text-red-600 text-xs py-1 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Supprimer</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
