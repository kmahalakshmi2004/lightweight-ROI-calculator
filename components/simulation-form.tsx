'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface SimulationFormProps {
  onSimulate: (inputs: any) => void;
  loading: boolean;
}

export function SimulationForm({ onSimulate, loading }: SimulationFormProps) {
  const [formData, setFormData] = useState({
    scenario_name: '',
    monthly_invoice_volume: '',
    num_ap_staff: '',
    avg_hours_per_invoice: '',
    hourly_wage: '',
    error_rate_manual: '',
    error_cost: '',
    time_horizon_months: '12',
    one_time_implementation_cost: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ROI Simulation Parameters</CardTitle>
        <CardDescription>
          Enter your current invoicing metrics to calculate potential savings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="scenario_name">Scenario Name *</Label>
              <Input
                id="scenario_name"
                name="scenario_name"
                value={formData.scenario_name}
                onChange={handleChange}
                placeholder="e.g., Q4 2025 Baseline"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly_invoice_volume">Monthly Invoice Volume *</Label>
              <Input
                id="monthly_invoice_volume"
                name="monthly_invoice_volume"
                type="number"
                value={formData.monthly_invoice_volume}
                onChange={handleChange}
                placeholder="e.g., 1000"
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="num_ap_staff">Number of AP Staff *</Label>
              <Input
                id="num_ap_staff"
                name="num_ap_staff"
                type="number"
                value={formData.num_ap_staff}
                onChange={handleChange}
                placeholder="e.g., 3"
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avg_hours_per_invoice">Avg. Hours per Invoice *</Label>
              <Input
                id="avg_hours_per_invoice"
                name="avg_hours_per_invoice"
                type="number"
                step="0.01"
                value={formData.avg_hours_per_invoice}
                onChange={handleChange}
                placeholder="e.g., 0.5"
                required
                min="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourly_wage">Hourly Wage ($) *</Label>
              <Input
                id="hourly_wage"
                name="hourly_wage"
                type="number"
                step="0.01"
                value={formData.hourly_wage}
                onChange={handleChange}
                placeholder="e.g., 25.00"
                required
                min="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="error_rate_manual">Manual Error Rate (%) *</Label>
              <Input
                id="error_rate_manual"
                name="error_rate_manual"
                type="number"
                step="0.1"
                value={formData.error_rate_manual}
                onChange={handleChange}
                placeholder="e.g., 5.0"
                required
                min="0"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="error_cost">Cost per Error ($) *</Label>
              <Input
                id="error_cost"
                name="error_cost"
                type="number"
                step="0.01"
                value={formData.error_cost}
                onChange={handleChange}
                placeholder="e.g., 50.00"
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time_horizon_months">Time Horizon (Months) *</Label>
              <Input
                id="time_horizon_months"
                name="time_horizon_months"
                type="number"
                value={formData.time_horizon_months}
                onChange={handleChange}
                placeholder="e.g., 12"
                required
                min="1"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="one_time_implementation_cost">
                One-Time Implementation Cost ($)
              </Label>
              <Input
                id="one_time_implementation_cost"
                name="one_time_implementation_cost"
                type="number"
                step="0.01"
                value={formData.one_time_implementation_cost}
                onChange={handleChange}
                placeholder="e.g., 5000.00 (optional)"
                min="0"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              'Calculate ROI'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
