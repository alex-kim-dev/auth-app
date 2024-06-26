import type { NavigateFunction, To } from 'react-router-dom';

let navigate: NavigateFunction | null = null;

export const setNavigator = (navigatorFn: NavigateFunction) => {
  navigate = navigatorFn;
};

export const navigateTo = (to: To) => {
  if (navigate) navigate(to);
};
