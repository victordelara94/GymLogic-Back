/* eslint-disable no-unused-vars */

export interface Repository<User> {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User>;
  create(newData: Omit<User, 'id'>): Promise<User>;
  update(id: string, newData: Partial<User>): Promise<User>;

}
