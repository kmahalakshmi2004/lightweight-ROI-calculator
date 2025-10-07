import { SimulationInputs, SimulationResults } from './calculations';

export interface Scenario {
  id: string;
  scenario_name: string;
  monthly_invoice_volume: number;
  num_ap_staff: number;
  avg_hours_per_invoice: number;
  hourly_wage: number;
  error_rate_manual: number;
  error_cost: number;
  time_horizon_months: number;
  one_time_implementation_cost: number;
  results: SimulationResults;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  email: string;
  scenario_id?: string;
  created_at: string;
}

const scenarios = new Map<string, Scenario>();
const leads = new Map<string, Lead>();

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const storage = {
  scenarios: {
    async create(
      inputs: SimulationInputs,
      results: SimulationResults
    ): Promise<Scenario> {
      const id = generateId();
      const now = new Date().toISOString();
      const scenario: Scenario = {
        id,
        scenario_name: inputs.scenario_name,
        monthly_invoice_volume: inputs.monthly_invoice_volume,
        num_ap_staff: inputs.num_ap_staff,
        avg_hours_per_invoice: inputs.avg_hours_per_invoice,
        hourly_wage: inputs.hourly_wage,
        error_rate_manual: inputs.error_rate_manual,
        error_cost: inputs.error_cost,
        time_horizon_months: inputs.time_horizon_months,
        one_time_implementation_cost: inputs.one_time_implementation_cost || 0,
        results,
        created_at: now,
        updated_at: now,
      };
      scenarios.set(id, scenario);
      return scenario;
    },

    async getAll(): Promise<Scenario[]> {
      return Array.from(scenarios.values()).sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },

    async getById(id: string): Promise<Scenario | null> {
      return scenarios.get(id) || null;
    },

    async delete(id: string): Promise<boolean> {
      return scenarios.delete(id);
    },
  },

  leads: {
    async create(email: string, scenario_id?: string): Promise<Lead> {
      const id = generateId();
      const lead: Lead = {
        id,
        email,
        scenario_id,
        created_at: new Date().toISOString(),
      };
      leads.set(id, lead);
      return lead;
    },

    async getAll(): Promise<Lead[]> {
      return Array.from(leads.values()).sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
  },
};
