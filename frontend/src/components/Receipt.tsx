import React from 'react';
import type { ISale } from '../types';

interface ReceiptProps {
  sale: ISale;
}

const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(({ sale }, ref) => {
  const isPaid = sale.paymentStatus === 'paid';
  const tagline = "...Good Hair, Good Mood...";

  const colors = {
    brandPink: '#C2185B',
    ink: '#09090B',
    slate: '#71717A',
    surface: '#FFFFFF',
    background: '#FAFAFA',
    border: '#E4E4E7',
  };

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        maxWidth: '420px',
        margin: '0 auto',
        backgroundColor: colors.surface,
        color: colors.ink,
        fontFamily: "'DM Sans', 'Inter', sans-serif",
        padding: '0',
        position: 'relative',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}
    >
      {/* Top Brand Accent Line */}
      <div style={{ height: '8px', backgroundColor: colors.brandPink, width: '100%' }} />

      {/* Header Section */}
      <div style={{ padding: '40px 32px 32px', textAlign: 'center', backgroundColor: colors.background }}>
        <div style={{ 
          width: '64px', height: '64px', margin: '0 auto 20px', 
          borderRadius: '50%', overflow: 'hidden', border: `2px solid ${colors.brandPink}`,
          boxShadow: `0 0 20px rgba(255,20,147,0.15)`
        }}>
          <img src="/logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
        </div>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: 900, letterSpacing: '-1px', fontStyle: 'italic', textTransform: 'uppercase' }}>
          Derin<span style={{ color: colors.brandPink }}>Strands</span>
        </h1>
        <p style={{ margin: 0, fontSize: '10px', color: colors.slate, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
          {tagline}
        </p>
      </div>

      {/* Dashed Divider */}
      <div style={{ 
        height: '1px', width: '100%', 
        backgroundImage: `linear-gradient(to right, ${colors.border} 50%, transparent 50%)`, 
        backgroundSize: '12px 1px', backgroundRepeat: 'repeat-x' 
      }} />

      {/* Customer & Order Info */}
      <div style={{ padding: '32px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: '9px', fontWeight: 800, color: colors.slate, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Billed To</p>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: colors.ink }}>{sale.buyerName}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0 0 4px', fontSize: '9px', fontWeight: 800, color: colors.slate, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Date</p>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: colors.ink }}>
            {new Date(sale.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Dashed Divider */}
      <div style={{ 
        height: '1px', width: '100%', 
        backgroundImage: `linear-gradient(to right, ${colors.border} 50%, transparent 50%)`, 
        backgroundSize: '12px 1px', backgroundRepeat: 'repeat-x' 
      }} />

      {/* Items Section */}
      <div style={{ padding: '32px' }}>
        <p style={{ margin: '0 0 20px', fontSize: '9px', fontWeight: 800, color: colors.slate, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order Details</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sale.items.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ paddingRight: '16px' }}>
                <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 800, color: colors.ink }}>{item.name}</p>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: colors.slate }}>
                  {item.quantity} × ₦{item.price.toLocaleString()}
                </p>
              </div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 900, color: colors.ink }}>
                ₦{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Thick Solid Divider */}
      <div style={{ height: '2px', backgroundColor: colors.ink, width: 'calc(100% - 64px)', margin: '0 auto' }} />

      {/* Total Section */}
      <div style={{ padding: '24px 32px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 900, color: colors.ink, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total {isPaid ? 'Paid' : 'Due'}
          </p>
          <p style={{ margin: 0, fontSize: '28px', fontWeight: 900, color: colors.brandPink, letterSpacing: '-1px' }}>
            ₦{sale.totalPrice.toLocaleString()}
          </p>
        </div>

        {/* Status Badge */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            padding: '8px 24px', borderRadius: '100px', 
            backgroundColor: isPaid ? '#DCFCE7' : '#FFEDD5',
            color: isPaid ? '#15803D' : '#C2410C',
            fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
            {isPaid ? 'Payment Successful' : 'Payment Pending'}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        padding: '32px', backgroundColor: colors.background, 
        textAlign: 'center', borderTop: `1px solid ${colors.border}`
      }}>
        {/* Fake Barcode Effect */}
        <div style={{ 
          height: '40px', width: '200px', margin: '0 auto 24px',
          backgroundImage: `repeating-linear-gradient(to right, ${colors.ink}, ${colors.ink} 2px, transparent 2px, transparent 6px, ${colors.ink} 6px, ${colors.ink} 10px, transparent 10px, transparent 12px)`,
          opacity: 0.2
        }} />
        
        <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 900, color: colors.ink }}>
          Thank you for choosing DerinStrands! 💗
        </p>
        <p style={{ margin: '0 0 16px', fontSize: '11px', fontWeight: 700, color: colors.slate }}>
          IG: @derinstrands • derinstrands@gmail.com
        </p>
        <p style={{ margin: 0, fontSize: '9px', fontWeight: 800, color: colors.slate, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Ref: {sale._id.slice(-8).toUpperCase()}
        </p>
      </div>

    </div>
  );
});

Receipt.displayName = 'Receipt';
export default Receipt;
