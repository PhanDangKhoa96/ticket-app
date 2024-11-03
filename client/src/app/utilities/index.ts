import { User } from '@acme/shared-models';

export const getUserName = (users: User[], id: number) =>
  users.find((u) => u.id === id)?.name;
