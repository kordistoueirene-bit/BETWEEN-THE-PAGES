import './PhoneFrame.css';

export default function PhoneFrame({ children, theme = 'light' }) {
  return (
    <div className="phone-frame" data-theme={theme}>
      {children}
    </div>
  );
}