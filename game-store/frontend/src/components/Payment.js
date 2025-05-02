import React, { useState } from 'react';

function Payment({ user }) {
  const [amount, setAmount] = useState('');

  const handlePayment = async () => {
    const res = await fetch('http://localhost:5001/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: user.customer_id,
        amount_paid: amount,
        payment_method: 'Credit Card'
      })
    });

    const data = await res.json();
    if (data.success) {
      alert('Payment successful');
    } else {
      alert('Payment failed');
    }
  };

  return (
    <div>
      <h2>Mock Payment</h2>
      <input placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
}

export default Payment;
