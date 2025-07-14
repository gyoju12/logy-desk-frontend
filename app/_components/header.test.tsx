// app/_components/header.test.tsx
import { render, screen } from '@testing-library/react';
import Header from './header';

// next/navigation 모듈을 모의(mock) 처리합니다.
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
}));

describe('Header Component', () => {
  it('"Logy-Desk" 텍스트가 렌더링되어야 합니다.', () => {
    render(<Header />);
    
    const titleElement = screen.getByText(/Logy-Desk/i);
    
    expect(titleElement).toBeInTheDocument();
  });
});
