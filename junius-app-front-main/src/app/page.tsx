'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Loading from 'src/app/loading';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div>
      <Loading />
    </div>
  );
}
