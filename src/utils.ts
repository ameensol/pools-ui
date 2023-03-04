export const growShrinkProps = {
  _hover: {
    transform: 'scale(1.025)'
  },
  _active: {
    transform: 'scale(0.95)'
  },
  transition: '0.125s ease'
};

export const pinchString = (
  s: string,
  n: number | [number, number]
): string => {
  if (Array.isArray(n)) {
    return `${s.slice(0, n[0])}...${s.slice(s.length - n[1])}`;
  }
  return `${s.slice(0, n)}...${s.slice(s.length - n)}`;
};

const decimalNumber = new RegExp(
  `(^[0-9]{1,60}.[0-9]{1,18}$|^[.]{1}[0-9]{1,18}$|^[0-9]{1,60}[.]{1}$)`
);
export const isDecimalNumber = (n: string): Boolean => {
  if (!n) return false;
  return decimalNumber.test(n);
};
