import { NextRequest, NextResponse } from 'next/server';
import { validateEmail } from '@/lib/calculations';
import { storage } from '@/lib/storage';

function generateHTMLReport(
  scenario: {
    scenario_name: string;
    monthly_invoice_volume: number;
    num_ap_staff: number;
    avg_hours_per_invoice: number;
    hourly_wage: number;
    error_rate_manual: number;
    error_cost: number;
    time_horizon_months: number;
    one_time_implementation_cost: number;
    results: any;
  },
  email: string
): string {
  const { results } = scenario;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ROI Report - ${scenario.scenario_name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a202c;
      background: #f7fafc;
      padding: 40px 20px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 48px 40px;
      text-align: center;
    }
    .header h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .header p {
      font-size: 16px;
      opacity: 0.9;
    }
    .content {
      padding: 40px;
    }
    .section {
      margin-bottom: 40px;
    }
    .section h2 {
      font-size: 24px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e2e8f0;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .metric-card {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
    }
    .metric-label {
      font-size: 13px;
      color: #718096;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .metric-value {
      font-size: 28px;
      font-weight: 700;
      color: #2d3748;
    }
    .metric-value.success {
      color: #38a169;
    }
    .metric-value.highlight {
      color: #667eea;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #4a5568;
    }
    .info-value {
      color: #2d3748;
    }
    .footer {
      background: #f7fafc;
      padding: 30px 40px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      color: #718096;
      font-size: 14px;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Invoicing ROI Analysis</h1>
      <p>${scenario.scenario_name}</p>
    </div>

    <div class="content">
      <div class="section">
        <h2>Executive Summary</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Monthly Savings</div>
            <div class="metric-value success">$${results.monthly_savings.toLocaleString()}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Total Savings (${scenario.time_horizon_months} months)</div>
            <div class="metric-value success">$${results.total_savings.toLocaleString()}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">ROI</div>
            <div class="metric-value highlight">${results.roi_percentage}%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Payback Period</div>
            <div class="metric-value">${results.payback_period_months} months</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Cost Comparison</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Manual Process (Monthly)</div>
            <div class="metric-value">$${results.manual_monthly_cost.toLocaleString()}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Automated Process (Monthly)</div>
            <div class="metric-value">$${results.automated_monthly_cost.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Efficiency Gains</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Time Saved (Monthly)</div>
            <div class="metric-value">${results.time_saved_hours_monthly} hours</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Errors Reduced (Monthly)</div>
            <div class="metric-value">${results.error_reduction_count}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Scenario Parameters</h2>
        <div class="info-row">
          <span class="info-label">Monthly Invoice Volume</span>
          <span class="info-value">${scenario.monthly_invoice_volume.toLocaleString()}</span>
        </div>
        <div class="info-row">
          <span class="info-label">AP Staff Count</span>
          <span class="info-value">${scenario.num_ap_staff}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Avg. Hours per Invoice</span>
          <span class="info-value">${scenario.avg_hours_per_invoice}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Hourly Wage</span>
          <span class="info-value">$${scenario.hourly_wage}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Manual Error Rate</span>
          <span class="info-value">${(scenario.error_rate_manual * 100).toFixed(1)}%</span>
        </div>
        <div class="info-row">
          <span class="info-label">Cost per Error</span>
          <span class="info-value">$${scenario.error_cost}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Implementation Cost</span>
          <span class="info-value">$${scenario.one_time_implementation_cost.toLocaleString()}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Time Horizon</span>
          <span class="info-value">${scenario.time_horizon_months} months</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Generated for ${email} on ${new Date().toLocaleDateString()}</p>
      <p style="margin-top: 8px; font-weight: 600;">Invoicing ROI Simulator</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, scenario_id } = body;

    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!scenario_id) {
      return NextResponse.json(
        { error: 'Scenario ID is required' },
        { status: 400 }
      );
    }

    const scenario = await storage.scenarios.getById(scenario_id);

    if (!scenario) {
      return NextResponse.json(
        { error: 'Scenario not found' },
        { status: 404 }
      );
    }

    await storage.leads.create(email, scenario_id);

    const htmlReport = generateHTMLReport(scenario, email);

    return new NextResponse(htmlReport, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="roi-report-${scenario.scenario_name.replace(/\s+/g, '-')}.html"`,
      },
    });
  } catch (error) {
    console.error('Generate report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
