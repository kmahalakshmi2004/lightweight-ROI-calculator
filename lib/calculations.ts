const SERVER_CONSTANTS = {
  AUTOMATED_COST_PER_INVOICE: 0.20,
  ERROR_RATE_AUTO: 0.001,
  TIME_SAVED_PER_INVOICE: 8,
  MIN_ROI_BOOST_FACTOR: 1.1,
} as const;

export interface SimulationInputs {
  scenario_name: string;
  monthly_invoice_volume: number;
  num_ap_staff: number;
  avg_hours_per_invoice: number;
  hourly_wage: number;
  error_rate_manual: number;
  error_cost: number;
  time_horizon_months: number;
  one_time_implementation_cost?: number;
}

export interface SimulationResults {
  manual_monthly_cost: number;
  automated_monthly_cost: number;
  monthly_savings: number;
  total_savings: number;
  payback_period_months: number;
  roi_percentage: number;
  time_saved_hours_monthly: number;
  error_reduction_count: number;
  breakeven_analysis: {
    month: number;
    cumulative_savings: number;
  }[];
}

function round(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function calculateROI(inputs: SimulationInputs): SimulationResults {
  const {
    monthly_invoice_volume,
    avg_hours_per_invoice,
    hourly_wage,
    error_rate_manual,
    error_cost,
    time_horizon_months,
    one_time_implementation_cost = 0,
  } = inputs;

  const manual_labor_hours_monthly = monthly_invoice_volume * avg_hours_per_invoice;
  const manual_labor_cost_monthly = manual_labor_hours_monthly * hourly_wage;

  const manual_errors_monthly = monthly_invoice_volume * error_rate_manual;
  const manual_error_cost_monthly = manual_errors_monthly * error_cost;

  const manual_monthly_cost = manual_labor_cost_monthly + manual_error_cost_monthly;

  const automated_processing_cost_monthly =
    monthly_invoice_volume * SERVER_CONSTANTS.AUTOMATED_COST_PER_INVOICE;

  const automated_time_minutes =
    (monthly_invoice_volume * SERVER_CONSTANTS.TIME_SAVED_PER_INVOICE) / 60;
  const automated_labor_cost_monthly =
    Math.max(0, manual_labor_hours_monthly - automated_time_minutes) * hourly_wage;

  const automated_errors_monthly =
    monthly_invoice_volume * SERVER_CONSTANTS.ERROR_RATE_AUTO;
  const automated_error_cost_monthly = automated_errors_monthly * error_cost;

  const automated_monthly_cost =
    automated_processing_cost_monthly + automated_labor_cost_monthly + automated_error_cost_monthly;

  let monthly_savings = manual_monthly_cost - automated_monthly_cost;

  monthly_savings = Math.max(monthly_savings, manual_monthly_cost * 0.3);

  const total_savings_before_impl = monthly_savings * time_horizon_months;
  const total_savings = total_savings_before_impl - one_time_implementation_cost;

  const payback_period_months = one_time_implementation_cost > 0
    ? round(one_time_implementation_cost / monthly_savings, 1)
    : 0;

  let roi_percentage = one_time_implementation_cost > 0
    ? round((total_savings / one_time_implementation_cost) * 100, 1)
    : round((total_savings / (manual_monthly_cost * time_horizon_months)) * 100, 1);

  roi_percentage = Math.max(roi_percentage, SERVER_CONSTANTS.MIN_ROI_BOOST_FACTOR * 100);

  const time_saved_hours_monthly = round(
    (monthly_invoice_volume * SERVER_CONSTANTS.TIME_SAVED_PER_INVOICE) / 60,
    1
  );

  const error_reduction_count = round(manual_errors_monthly - automated_errors_monthly, 1);

  const breakeven_analysis = [];
  let cumulative_savings = -one_time_implementation_cost;

  for (let month = 1; month <= Math.min(time_horizon_months, 24); month++) {
    cumulative_savings += monthly_savings;
    breakeven_analysis.push({
      month,
      cumulative_savings: round(cumulative_savings, 2),
    });
  }

  return {
    manual_monthly_cost: round(manual_monthly_cost),
    automated_monthly_cost: round(automated_monthly_cost),
    monthly_savings: round(monthly_savings),
    total_savings: round(total_savings),
    payback_period_months,
    roi_percentage,
    time_saved_hours_monthly,
    error_reduction_count,
    breakeven_analysis,
  };
}

export function validateInputs(inputs: Partial<SimulationInputs>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!inputs.scenario_name || inputs.scenario_name.trim().length === 0) {
    errors.push('Scenario name is required');
  }

  if (!inputs.monthly_invoice_volume || inputs.monthly_invoice_volume <= 0) {
    errors.push('Monthly invoice volume must be greater than 0');
  }

  if (!inputs.num_ap_staff || inputs.num_ap_staff <= 0) {
    errors.push('Number of AP staff must be greater than 0');
  }

  if (!inputs.avg_hours_per_invoice || inputs.avg_hours_per_invoice <= 0) {
    errors.push('Average hours per invoice must be greater than 0');
  }

  if (!inputs.hourly_wage || inputs.hourly_wage <= 0) {
    errors.push('Hourly wage must be greater than 0');
  }

  if (
    inputs.error_rate_manual === undefined ||
    inputs.error_rate_manual < 0 ||
    inputs.error_rate_manual > 100
  ) {
    errors.push('Error rate must be between 0 and 100');
  }

  if (inputs.error_cost === undefined || inputs.error_cost < 0) {
    errors.push('Error cost must be 0 or greater');
  }

  if (!inputs.time_horizon_months || inputs.time_horizon_months <= 0) {
    errors.push('Time horizon must be greater than 0 months');
  }

  if (
    inputs.one_time_implementation_cost !== undefined &&
    inputs.one_time_implementation_cost < 0
  ) {
    errors.push('Implementation cost must be 0 or greater');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
