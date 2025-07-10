const USER_KEY = 'mutual_fund_user';
const SELECTED_FUNDS_KEY = 'selected_funds';

export const saveUser = (user: { email: string; name: string }) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): { email: string; name: string } | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const clearUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const saveSelectedFunds = (funds: any[]) => {
  localStorage.setItem(SELECTED_FUNDS_KEY, JSON.stringify(funds));
};

export const getSelectedFunds = (): any[] => {
  const funds = localStorage.getItem(SELECTED_FUNDS_KEY);
  return funds ? JSON.parse(funds) : [];
};

export const clearSelectedFunds = () => {
  localStorage.removeItem(SELECTED_FUNDS_KEY);
};