export interface IFormLoginValues {
  email: string;
  password: string;
}

export interface IStateBase {
  status: string;
  message: string;
}

export interface IStateWithErrors extends IStateBase {
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

export type IState = IStateBase | IStateWithErrors | null | undefined;

export interface IRoleModule {
  id: number;
  name: string;
  longName: string;
  createdAt: string;
  updatedAt: string;
  roles: IRole[]
}

export interface IRole {
  id: number;
  name: string;
  longName: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: number;
  email: string;
  name: string;
  phone: string;
  isActive: boolean;
  password?: string;
  passwordConfirmation?: string;
  createdAt: string;
  updatedAt: string;
  roles: IRole[] | number[];
}

export interface IPassword {
  password: string;
  passwordConfirmation: string;
}




