import type { InquiryState } from '@/domain/inquiry';
import type { Locale } from '@/domain/locale';
import { getFeatureCopy } from '@/i18n/features';
import { getEnhancementCopy } from '@/i18n/enhancements';

export function createInquiryViewModel(state: InquiryState, locale: Locale) {
  const copy = getEnhancementCopy(locale);
  return {
    busy: state === 'submitting',
    buttonLabel:
      state === 'submitting'
        ? copy.sending
        : state === 'unconfirmed'
          ? copy.retry
          : getFeatureCopy(locale).send,
    message: state === 'unconfirmed' ? copy.submissionError : '',
  };
}
