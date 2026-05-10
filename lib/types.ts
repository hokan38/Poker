export type ActionInfo = {
  label: string;
  frequency?: number | null;
  ev?: number | null;
  best?: boolean;
};

export type ScenarioInfo = {
  format?: string | null;
  street?: string | null;
  heroPosition?: string | null;
  heroHand?: string | null;
  board?: string | null;
  potBb?: number | null;
  effectiveBb?: number | null;
  actionHistory?: string | null;
  decisionPoint?: string | null;
};

export type ExplainSuccess = {
  ok: true;
  scenario: ScenarioInfo;
  actions: ActionInfo[];
  verdict: string;
  explanation: string;
  keyTakeaways?: string[];
};

export type ExplainFailure = {
  ok: false;
  reason: string;
};

export type ExplainResult = ExplainSuccess | ExplainFailure;
