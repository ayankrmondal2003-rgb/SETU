import React from 'react';
import { useTranslation } from '../../context/LanguageContext';

/** Translate interface copy declaratively, without modifying React-owned DOM. */
export const LocalizedText: React.FC<{ text: string }> = ({ text }) => {
  const { translate } = useTranslation();
  return <>{translate(text)}</>;
};
