'use client';

import { useState, useEffect } from 'react';
import { SimulationForm } from '@/components/simulation-form';
import { ResultsDisplay } from '@/components/results-display';
import { ScenarioList } from '@/components/scenario-list';
import { EmailGateDialog } from '@/components/email-gate-dialog';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Calculator } from 'lucide-react';

export default function Home() {
  const [results, setResults] = useState<any>(null);
  const [inputs, setInputs] = useState<any>(null);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      const response = await fetch('/api/scenarios');
      if (response.ok) {
        const data = await response.json();
        setScenarios(data);
      }
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    }
  };

  const handleSimulate = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Simulation failed');
      }

      const data = await response.json();
      setResults(data.results);
      setInputs(data.inputs);
      setCurrentScenarioId(null);

      toast({
        title: 'Success',
        description: 'ROI calculation completed successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to calculate ROI',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!results || !inputs) return;

    setSaving(true);
    try {
      const response = await fetch('/api/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        throw new Error('Failed to save scenario');
      }

      const scenario = await response.json();
      setCurrentScenarioId(scenario.id);
      await loadScenarios();

      toast({
        title: 'Success',
        description: 'Scenario saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save scenario',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleViewScenario = async (id: string) => {
    try {
      const response = await fetch(`/api/scenarios/${id}`);
      if (!response.ok) {
        throw new Error('Failed to load scenario');
      }

      const scenario = await response.json();
      setResults(scenario.results);
      setInputs({
        scenario_name: scenario.scenario_name,
        monthly_invoice_volume: scenario.monthly_invoice_volume,
        num_ap_staff: scenario.num_ap_staff,
        avg_hours_per_invoice: scenario.avg_hours_per_invoice,
        hourly_wage: scenario.hourly_wage,
        error_rate_manual: scenario.error_rate_manual * 100,
        error_cost: scenario.error_cost,
        time_horizon_months: scenario.time_horizon_months,
        one_time_implementation_cost: scenario.one_time_implementation_cost,
      });
      setCurrentScenarioId(id);

      window.scrollTo({ top: 0, behavior: 'smooth' });

      toast({
        title: 'Success',
        description: 'Scenario loaded',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load scenario',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteScenario = async (id: string) => {
    try {
      const response = await fetch(`/api/scenarios/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete scenario');
      }

      if (currentScenarioId === id) {
        setResults(null);
        setInputs(null);
        setCurrentScenarioId(null);
      }

      await loadScenarios();

      toast({
        title: 'Success',
        description: 'Scenario deleted',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete scenario',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateReport = () => {
    if (!currentScenarioId) {
      toast({
        title: 'Save Required',
        description: 'Please save the scenario before generating a report',
        variant: 'destructive',
      });
      return;
    }
    setEmailDialogOpen(true);
  };

  const handleEmailSubmit = async (email: string) => {
    if (!currentScenarioId) return;

    const response = await fetch('/api/report/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        scenario_id: currentScenarioId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate report');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roi-report-${inputs.scenario_name.replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: 'Success',
      description: 'Report downloaded successfully',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Invoicing ROI Simulator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your potential savings, payback period, and ROI when switching from manual to automated invoice processing
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <SimulationForm onSimulate={handleSimulate} loading={loading} />

            {results && inputs && (
              <ResultsDisplay
                results={results}
                inputs={inputs}
                onSave={handleSave}
                onGenerateReport={handleGenerateReport}
                saving={saving}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <ScenarioList
              scenarios={scenarios}
              onView={handleViewScenario}
              onDelete={handleDeleteScenario}
            />
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>&copy; 2025 Invoicing ROI Simulator. All rights reserved.</p>
        </footer>
      </div>

      <EmailGateDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        onSubmit={handleEmailSubmit}
      />

      <Toaster />
    </div>
  );
}
