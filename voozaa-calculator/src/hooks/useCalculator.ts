import { useState, useMemo, useCallback } from 'react';
import { calculate } from '../lib/calculations';
import { DEFAULT_INPUTS } from '../types';
import type { CalculatorInputs, CalculatorOutputs } from '../types';

interface UseCalculatorReturn {
  inputs: CalculatorInputs;
  outputs: CalculatorOutputs;
  updateInput: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  resetInputs: () => void;
}

export function useCalculator(): UseCalculatorReturn {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);

  const outputs = useMemo(() => calculate(inputs), [inputs]);

  const updateInput = useCallback(<K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetInputs = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
  }, []);

  return { inputs, outputs, updateInput, resetInputs };
}
