export interface User {
  id: string;
  name: string;
  firstName: string; // добавляем новое поле
  lastName: string; // добавляем новое поле
  middleName: string; // добавляем новое поле
  gender: 'male' | 'female' | 'other'; // добавляем новое поле
  birthDate: Date | string; // добавляем новое поле
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInfo {
  name: string;
}
