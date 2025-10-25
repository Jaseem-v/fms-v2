'use client';

import { useState } from 'react';
import FormModal from '@/components/layout/FormModal';

interface GreenFloatingButtonProps {
  websiteUrl: string;
  totalProblems: number;
}

export default function GreenFloatingButton({ websiteUrl, totalProblems }: GreenFloatingButtonProps) {
  const [showFormModal, setShowFormModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowFormModal(true)}
        className=" sticky-button"
        title="Get Another Free Audit"
      >
       Free Audit
      </button>

      <FormModal
        totalProblems={totalProblems}
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        websiteUrl={websiteUrl}
        isSampleReport={false}
        pageType="homepage"
      />
    </>
  );
}
