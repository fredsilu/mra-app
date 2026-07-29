import type { Timestamp } from 'firebase/firestore';

export type TimelineItemType =
  | 'case_created'
  | 'case_suspended'
  | 'case_reactivated'
  | 'case_closed'
  | 'counselor_changed'
  | 'activity';

export interface TimelineItem {
  id: string;

  type: TimelineItemType;

  date: Timestamp;

  title: string;

  description: string;

  caseId: string;

  referenceId: string;
}