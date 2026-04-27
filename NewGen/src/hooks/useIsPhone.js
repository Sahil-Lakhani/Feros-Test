import { useEffect, useState } from 'react';

const QUERY = '(max-width: 640px)';

export default function useIsPhone() {
  const [isPhone, setIsPhone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mql = window.matchMedia(QUERY);
    const update = () => setIsPhone(mql.matches);

    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  return isPhone;
}
