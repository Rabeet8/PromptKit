export type ModelOption = string;

export interface HeaderProps {
  title: string;
  onBack?: () => void;
  onSettingsPress?: () => void;
}

export interface ModelDropdownProps {
  label: string;
  value: string;
  options: ModelOption[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  loading?: boolean;
  maxMenuHeight?: number;
}

export interface InputCardProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
}

export interface InputRowProps {
  left: InputCardProps;
  right: InputCardProps;
}

export interface CacheSliderProps {
  label: string;
  value: number;           // 0–100
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export interface CostCardProps {
  title: string;
  monthlyCost: string;     // display string
  dailyCost?: string;
  yearlyCost?: string;
}

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

// API Response Types
export interface LintResponse {
  score: number;
  issues: string[];
  improved_prompt: string;
  analysis: string;
}

export interface TokenizeResponse {
  tokens: number;
  characters: number;
  approx: boolean;
}

export interface SchemaResponse {
  schema: any;
  valid_example: any;
  invalid_example: any;
}

export interface ModelsResponse {
  models: string[];
}

export interface CostResponse {
  daily_cost: number;
  monthly_cost: number;
  monthly_cost_with_cache: number;
}
