export const UserRegex = {
  USERNAME_SOFT: /^[a-zA-Z0-9_-]*$/,
  USERNAME: /^[a-zA-Z0-9_]{4,20}$/,
  EMAIL:
    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_'+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/i,
} as const;
