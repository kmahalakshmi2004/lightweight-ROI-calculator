'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, AlertTriangle, DollarSign, Download, Save } from 'lucide-react';

interface ResultsDisplayProps {
  results: any;
  inputs: any;
  onSave: () => void;
  onGenerateReport: () => void;
  saving: boolean;
}

export function ResultsDisplay({
  results,
  inputs,
  onSave,
  onGenerateReport,
  saving,
}: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <CardDescription>Key ROI metrics for {inputs.scenario_name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col space-y-2 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 text-green-700">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm font-medium">Monthly Savings</span>
              </div>
              <span className="text-2xl font-bold text-green-900">
                ${results.monthly_savings.toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col space-y-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 text-blue-700">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Total Savings</span>
              </div>
              <span className="text-2xl font-bold text-blue-900">
                ${results.total_savings.toLocaleString()}
              </span>
              <span className="text-xs text-blue-600">
                Over {inputs.time_horizon_months} months
              </span>
            </div>

            <div className="flex flex-col space-y-2 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 text-purple-700">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">ROI</span>
              </div>
              <span className="text-2xl font-bold text-purple-900">
                {results.roi_percentage}%
              </span>
            </div>

            <div className="flex flex-col space-y-2 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center space-x-2 text-amber-700">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">Payback Period</span>
              </div>
              <span className="text-2xl font-bold text-amber-900">
                {results.payback_period_months}
              </span>
              <span className="text-xs text-amber-600">months</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cost Comparison</CardTitle>
            <CardDescription>Monthly processing costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Manual Process</span>
              <span className="text-lg font-bold">
                ${results.manual_monthly_cost.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Automated Process</span>
              <span className="text-lg font-bold text-green-600">
                ${results.automated_monthly_cost.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg border border-green-300">
              <span className="font-semibold text-green-800">Monthly Savings</span>
              <span className="text-lg font-bold text-green-700">
                ${results.monthly_savings.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Efficiency Gains</CardTitle>
            <CardDescription>Operational improvements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="font-medium">Time Saved</p>
                <p className="text-2xl font-bold text-blue-600">
                  {results.time_saved_hours_monthly} hours
                </p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-1" />
              <div>
                <p className="font-medium">Errors Reduced</p>
                <p className="text-2xl font-bold text-amber-600">
                  {results.error_reduction_count}
                </p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cumulative Savings Over Time</CardTitle>
          <CardDescription>
            Break-even analysis showing cumulative savings by month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-6 gap-2 text-sm font-medium text-gray-600 pb-2 border-b">
              <span>Month</span>
              <span className="col-span-2 text-right">Cumulative Savings</span>
              <span>Month</span>
              <span className="col-span-2 text-right">Cumulative Savings</span>
            </div>
            {results.breakeven_analysis.map((item: any, idx: number) => {
              if (idx % 2 === 0) {
                const nextItem = results.breakeven_analysis[idx + 1];
                return (
                  <div key={idx} className="grid grid-cols-6 gap-2 text-sm py-1">
                    <span className="font-medium">{item.month}</span>
                    <span
                      className={`col-span-2 text-right font-semibold ${
                        item.cumulative_savings >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      ${item.cumulative_savings.toLocaleString()}
                    </span>
                    {nextItem && (
                      <>
                        <span className="font-medium">{nextItem.month}</span>
                        <span
                          className={`col-span-2 text-right font-semibold ${
                            nextItem.cumulative_savings >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          ${nextItem.cumulative_savings.toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={onSave} disabled={saving} className="flex-1">
          {saving ? (
            <>
              <Save className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Scenario
            </>
          )}
        </Button>
        <Button onClick={onGenerateReport} variant="outline" className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>
    </div>
  );
}
