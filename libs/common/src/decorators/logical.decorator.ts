import { SetMetadata } from '@nestjs/common';
import { Logical } from '../enums/logical.enum';
export const LOGICAL_KEY = 'Logical';
export const Logicals = (logical: Logical = Logical.AND) =>
  SetMetadata(LOGICAL_KEY, logical);
