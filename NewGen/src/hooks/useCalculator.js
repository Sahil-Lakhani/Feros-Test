import { useState, useMemo, useCallback } from 'react';
import { calculate } from '../calculator/calculations';
import { DEFAULT_INPUTS } from '../calculator/types';

export function useCalculator() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);

  const outputs = useMemo(() => calculate(inputs), [inputs]);

  const updateInput = useCallback((key, value) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetInputs = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
  }, []);

  return { inputs, outputs, updateInput, resetInputs };
}
