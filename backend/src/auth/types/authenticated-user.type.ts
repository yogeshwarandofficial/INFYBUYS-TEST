import { Role } from '@prisma/client';

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
  verifiedAt?: Date | null;
};
