import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function AuctionDetail() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAuction = async () => {
      const res = await axios.get(`http://localhost:8080/api/auctions/${id}`);
      setAuction(res.data);
    };
    fetchAuction();
  }, [id]);

  const handleBid = async () => {
    const token = localStorage.getItem('token');
    const userEmail = token ? JSON.parse(atob(token.split('.')[1])).sub : null;

    if (!userEmail) {
      alert("Login required");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:8080/api/auctions/${id}/bid`, {
        user: userEmail,
        amount: parseFloat(bidAmount),
      });
      setAuction(res.data); // updated auction with new bids
      setMessage('Bid placed successfully');
      setBidAmount('');
    } catch (err) {
      setMessage('Bid failed. ' + (err.response?.data || ''));
    }
  };

  if (!auction) return <p>Loading...</p>;

  const highestBid = auction.bids?.length
    ? Math.max(...auction.bids.map(b => b.amount))
    : auction.startingPrice;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>{auction.title}</h2>
      <p>{auction.description}</p>
      <p>💰 Current Price: ${highestBid}</p>
      <input
        type="number"
        placeholder="Enter your bid"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        style={{ marginTop: '1rem', padding: '10px' }}
      />
      <button onClick={handleBid} style={{ padding: '10px 20px', marginLeft: '1rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px' }}>
        Place Bid
      </button>
      {message && <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>}

      <h4 style={{ marginTop: '2rem' }}>Bid History</h4>
      <ul>
        {auction.bids?.slice().reverse().map((bid, idx) => (
          <li key={idx}>
            {bid.user} - ${bid.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AuctionDetail;
