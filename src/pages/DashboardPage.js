import React, { useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import API from "../services/api";

const Dashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [auctionData, setAuctionData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    auctionType: 'normal',
    startDate: '',
    endDate: ''
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allAuctions, setAllAuctions] = useState([]);
  const [userEmail, setUserEmail] = useState("User");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.sub || decoded.email || "User");
      } catch (e) {
        console.error("Token decode failed");
      }
    }
    fetchAllAuctions();
  }, []);

  const fetchAllAuctions = async () => {
    try {
      const res = await API.get("/auctions/all");
      setAllAuctions(res.data);
    } catch (err) {
      console.error("Failed to fetch auctions", err);
    }
  };

  const handleCreateAuction = async () => {
    try {
      await API.post("/auctions/create", { ...auctionData, userEmail });
      alert("Auction created!");
      setShowModal(false);
      setAuctionData({ title: "", description: "", startingPrice: "", auctionType: 'normal', startDate: '', endDate: '' });
      fetchAllAuctions();
    } catch (err) {
      alert("Failed to create auction");
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    if (!value) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await API.get(`/auctions/search?keyword=${value}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const handleBid = async (auction) => {
  const bid = prompt("Enter your bid amount:");
  if (!bid) return;

  try {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const user = decoded.sub || decoded.email;

    await API.post("/bids/place", {
      auctionId: auction.id,
      itemTitle: auction.title,
      userId: user,
      amount: parseFloat(bid)
    });

    alert("Bid placed successfully!");
    fetchAllAuctions();
  } catch (err) {
    console.error("Failed to place bid:", err.response?.data || err.message);
    alert("auction created .");
  }
};


  const displayedAuctions = searchKeyword ? searchResults : allAuctions;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f8ff', padding: '24px', fontFamily: 'sans-serif', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
        <div
          style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#c7d2fe', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#1f2937' }}
          onClick={() => setShowProfile((prev) => !prev)}
        >
          {userEmail.charAt(0).toUpperCase()}
        </div>
        {showProfile && (
          <div style={{ position: 'absolute', right: 0, top: '50px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px', minWidth: '180px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)', zIndex: 10 }}>
            <div style={{ padding: '8px 12px' }}>👤 {userEmail}</div>
            <hr />
            <button
              style={{ padding: '8px 12px', width: '100%', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
            >Logout</button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', paddingTop: '60px' }}>
        <input
          type="text"
          placeholder="Search auctions..."
          value={searchKeyword}
          onChange={handleSearch}
          style={{ width: '100%', maxWidth: '600px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
        />
      </div>

      <div style={{ marginTop: '24px' }}>
        <h3>{searchKeyword ? "Search Results:" : "All Auctions:"}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {displayedAuctions.map(auction => (
            <div key={auction.id} style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{auction.title}</h2>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>{auction.description}</p>
              <p style={{ color: '#4b5563' }}>💰 Starting at {auction.startingPrice}</p>
              {auction.sellerEmail && <p style={{ color: '#9ca3af', fontSize: '13px' }}>👤 Seller: {auction.sellerEmail}</p>}
              <button onClick={() => handleBid(auction.id)} style={{ marginTop: '8px', padding: '8px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Place Bid</button>
            </div>
          ))}
          {displayedAuctions.length === 0 && <p>No auctions found.</p>}
        </div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        style={{ position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px', backgroundColor: '#3b82f6', color: '#fff', fontSize: '24px', borderRadius: '9999px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer' }}
      >
        +
      </button>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '400px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '1rem' }}>Create New Auction</h2>
            <input placeholder="Title" value={auctionData.title} onChange={e => setAuctionData({ ...auctionData, title: e.target.value })} style={{ marginBottom: '10px', width: '100%', padding: '8px' }} />
            <textarea placeholder="Description" value={auctionData.description} onChange={e => setAuctionData({ ...auctionData, description: e.target.value })} style={{ marginBottom: '10px', width: '100%', padding: '8px' }} />
            <input type="number" placeholder="Starting Price" value={auctionData.startingPrice} onChange={e => setAuctionData({ ...auctionData, startingPrice: e.target.value })} style={{ marginBottom: '10px', width: '100%', padding: '8px' }} />
            <select value={auctionData.auctionType} onChange={e => setAuctionData({ ...auctionData, auctionType: e.target.value })} style={{ marginBottom: '10px', width: '100%', padding: '8px' }}>
              <option value="normal">Normal Auction</option>
              <option value="live">Live Auction</option>
            </select>
            {auctionData.auctionType === 'live' && (
              <>
                <input type="datetime-local" value={auctionData.startDate} onChange={e => setAuctionData({ ...auctionData, startDate: e.target.value })} placeholder="Start Date" style={{ marginBottom: '10px', width: '100%', padding: '8px' }} />
                <input type="datetime-local" value={auctionData.endDate} onChange={e => setAuctionData({ ...auctionData, endDate: e.target.value })} placeholder="End Date" style={{ marginBottom: '10px', width: '100%', padding: '8px' }} />
              </>
            )}
            <button onClick={handleCreateAuction} style={{ backgroundColor: '#2563eb', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '6px', marginRight: '8px' }}>Create</button>
            <button onClick={() => setShowModal(false)} style={{ padding: '8px 16px' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
