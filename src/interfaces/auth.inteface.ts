interface Iuser {
  id: number;
  username: string;
  email: string;
  password: string;
  phoneNumber: string,
  authMethod?: string | null; // Optional field
  region: string;
  address: string;
  referralCode?: string | null; // Optional field
  referredBy?: string | null; // Optional field
}

interface LoginParams {
  email?: string;
  password: string;
  username?: string;
}

interface LoginCredentialsData {
  loginSession: string;
  email: string;
}


export { Iuser, LoginParams, LoginCredentialsData };

