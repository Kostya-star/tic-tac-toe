import { FC, ReactNode } from 'react';
import cls from './Button.module.scss';

type ButtonType = 'success'; //...

interface ButtonProps {
  children: ReactNode;
  type: ButtonType;
  onClick: () => void;
}

// custom reused button
export const Button: FC<ButtonProps> = ({ children, type, onClick }) => {
  return (
    <button className={`${cls.button} ${cls[type]}`} onClick={() => onClick()}>
      {children}
    </button>
  );
};
