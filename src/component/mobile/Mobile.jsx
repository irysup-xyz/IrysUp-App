import { useMobile } from '../../context/MobileContext';

const Mobile = ({ children }) => {
  const { isMobile } = useMobile();

  if (isMobile) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#495057' }}>
          IrysUp is not available on mobile yet, please wait for the next update.
        </h2>
      </div>
    );
  }

  return children;
};

export default Mobile;