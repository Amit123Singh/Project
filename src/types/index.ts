export interface User {
  email: string;
  name: string;
}

export interface Fund {
  schemeCode: number;
  schemeName: string;
  fundHouse?: string;
  schemeType?: string;
  schemeCategory?: string;
  isin?: string;
  nav?: number;
  date?: string;
}

export interface FundDetail {
  fund: Fund;
  data: Array<{
    date: string;
    nav: string;
  }>;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface FundsContextType {
  selectedFunds: Fund[];
  addFund: (fund: Fund) => void;
  removeFund: (schemeCode: number) => void;
  clearFunds: () => void;
  maxFunds: number;
}