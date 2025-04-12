export interface LoginHistory {
  id: number;
  userId: ForeignKey<User['id']>;
  ip: string;
  userAgent: string;
  createdAt: Date;
}
