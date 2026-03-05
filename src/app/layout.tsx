import {ReactNode} from 'react';
import './globals.css';

type Props = {
  children: ReactNode;
};

export default function GlobalLayout({children}: Props) {
  return children;
}
