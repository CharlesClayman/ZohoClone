import { Guid } from 'guid-typescript';

export interface Term {
  id: Guid;
  termName: string;
  termDays: number;
  customized: boolean;
}
