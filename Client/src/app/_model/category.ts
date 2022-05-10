import { Guid } from 'guid-typescript';

export interface Category {
  id: Guid;
  name: string;
  description: string;
}
