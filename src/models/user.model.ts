export interface RegisterUserModel {
  userFirstName: string;
  userLastName: string;
  email: string;
  password: string;
}

export interface LoginUserModel {
  userEmail: string;
  userPassword: string;
}
