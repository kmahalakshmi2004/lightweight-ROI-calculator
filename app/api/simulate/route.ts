import { NextRequest, NextResponse } from 'next/server';
import { calculateROI, validateInputs, SimulationInputs } from '@/lib/calculations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const inputs: Partial<SimulationInputs> = {
      scenario_name: body.scenario_name,
      monthly_invoice_volume: Number(body.monthly_invoice_volume),
      num_ap_staff: Number(body.num_ap_staff),
      avg_hours_per_invoice: Number(body.avg_hours_per_invoice),
      hourly_wage: Number(body.hourly_wage),
      error_rate_manual: Number(body.error_rate_manual) / 100,
      error_cost: Number(body.error_cost),
      time_horizon_months: Number(body.time_horizon_months),
      one_time_implementation_cost: body.one_time_implementation_cost
        ? Number(body.one_time_implementation_cost)
        : 0,
    };

    const validation = validateInputs(inputs);

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const results = calculateROI(inputs as SimulationInputs);

    return NextResponse.json({
      inputs: {
        ...inputs,
        error_rate_manual: inputs.error_rate_manual! * 100,
      },
      results,
    });
  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
