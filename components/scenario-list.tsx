'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Scenario {
  id: string;
  scenario_name: string;
  monthly_invoice_volume: number;
  results: {
    monthly_savings: number;
    roi_percentage: number;
    total_savings: number;
  };
  created_at: string;
}

interface ScenarioListProps {
  scenarios: Scenario[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ScenarioList({ scenarios, onView, onDelete }: ScenarioListProps) {
  if (scenarios.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Scenarios</CardTitle>
          <CardDescription>Your saved ROI scenarios will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-8">
            No scenarios saved yet. Run a simulation and save it to see it here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Scenarios</CardTitle>
        <CardDescription>
          {scenarios.length} {scenarios.length === 1 ? 'scenario' : 'scenarios'} saved
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{scenario.scenario_name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">
                    {scenario.monthly_invoice_volume.toLocaleString()} invoices/mo
                  </Badge>
                  <Badge variant="default" className="bg-green-600">
                    ${scenario.results.monthly_savings.toLocaleString()}/mo savings
                  </Badge>
                  <Badge variant="outline">{scenario.results.roi_percentage}% ROI</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Created {new Date(scenario.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onView(scenario.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(scenario.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
