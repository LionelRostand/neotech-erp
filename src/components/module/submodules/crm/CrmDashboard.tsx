
import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon, Users, UserPlus, TrendingUp, Percent, Clock, Calendar, Mail, Phone } from "lucide-react";
import { useCrmDashboard } from './hooks/useCrmDashboard';
import StatCard from '@/components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const CrmDashboard: React.FC = () => {
  const { 
    stats, 
    salesData, 
    opportunitiesData, 
    recentActivities,
    COLORS
  } = useCrmDashboard();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Tableau de bord CRM</h2>
      
      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Clients" 
          value={stats.clients.toString()} 
          icon={<Users className="h-6 w-6 text-blue-600" />}
          description="Total des clients actifs" 
        />
        
        <StatCard 
          title="Prospects" 
          value={stats.prospects.toString()} 
          icon={<UserPlus className="h-6 w-6 text-green-600" />}
          description="Prospects à qualifier" 
        />
        
        <StatCard 
          title="Opportunités" 
          value={stats.opportunities.toString()} 
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          description="Affaires en cours" 
        />
        
        <StatCard 
          title="Taux de conversion" 
          value={`${stats.conversionRate}%`} 
          icon={<Percent className="h-6 w-6 text-amber-600" />}
          description="Prospects → Clients" 
        />
      </div>

      {/* Revenue & Pipeline Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <BarChartIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-medium">Performance des ventes</h3>
          </div>
          <ChartContainer className="h-64" config={{ data: { label: 'Ventes', theme: { light: '#60a5fa', dark: '#3b82f6' } } }}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="var(--color-data)" />
            </BarChart>
          </ChartContainer>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>CA généré: <span className="font-medium text-foreground">{stats.revenueGenerated.toLocaleString('fr-FR')} €</span></p>
            <p>Montant moyen: <span className="font-medium text-foreground">{stats.averageDealSize.toLocaleString('fr-FR')} €</span></p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <PieChartIcon className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="font-medium">Répartition des opportunités</h3>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={opportunitiesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {opportunitiesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Pipeline Progress */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Pipeline de Ventes</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Nouveau (12)</span>
              <span className="text-sm text-muted-foreground">25%</span>
            </div>
            <Progress value={25} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">En négociation (8)</span>
              <span className="text-sm text-muted-foreground">17%</span>
            </div>
            <Progress value={17} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Devis envoyé (15)</span>
              <span className="text-sm text-muted-foreground">31%</span>
            </div>
            <Progress value={31} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">En attente (9)</span>
              <span className="text-sm text-muted-foreground">19%</span>
            </div>
            <Progress value={19} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Gagné (4)</span>
              <span className="text-sm text-muted-foreground">8%</span>
            </div>
            <Progress value={8} className="h-2 bg-green-100" />
          </div>
        </div>
      </Card>
      
      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Activité récente</h3>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex justify-between">
                <div className="flex items-center">
                  {activity.type === 'call' && <Phone className="h-4 w-4 mr-2 text-blue-600" />}
                  {activity.type === 'email' && <Mail className="h-4 w-4 mr-2 text-purple-600" />}
                  {activity.type === 'meeting' && <Calendar className="h-4 w-4 mr-2 text-green-600" />}
                  <span className="font-medium">{activity.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(activity.date), "d MMMM à HH:mm", { locale: fr })}
                </span>
              </div>
              <p className="text-sm mt-1">{activity.description}</p>
              <div className="mt-2 text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{activity.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CrmDashboard;
