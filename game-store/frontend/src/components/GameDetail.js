import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function GameDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [avgRating, setAvgRating] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  const fetchReviews = async () => {
    const res = await fetch(`http://localhost:5001/api/reviews/${id}`);
    const data = await res.json();
    setReviews(data);
    if (data.length > 0) {
      const total = data.reduce((sum, r) => sum + r.rating, 0);
      setAvgRating((total / data.length).toFixed(1));
    } else {
      setAvgRating(null);
    }
  };

  useEffect(() => {
    const fetchGame = async () => {
      const res = await fetch(`http://localhost:5001/api/games/${id}`);
      const data = await res.json();
      setGame(data);
    };

    fetchGame();
    fetchReviews();
  }, [id]);

  const submitReview = async () => {
    const res = await fetch('http://localhost:5001/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: user.customer_id,
        game_id: id,
        rating,
        review_text: reviewText
      })
    });

    if (res.ok) {
      await fetchReviews(); // refresh review list
      setRating('');
      setReviewText('');
      alert('Review submitted!');
    } else {
      alert('Failed to submit review');
    }
  };

  const handlePurchase = async () => {
    const res = await fetch('http://localhost:5001/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: user.customer_id,
        amount_paid: game.price,
        payment_method: 'Credit Card'
      })
    });

    const data = await res.json();
    if (data.success) {
      alert('Purchase complete!');
    } else {
      alert('Purchase failed.');
    }
  };

  const paginatedReviews = reviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  return (
    <div className="game-detail">
      <button onClick={() => navigate('/')}>← Back to Games</button>
      {game ? (
        <>
          <div className="detail-box">
            <h2>{game.title}</h2>
            <p><strong>Platform:</strong> {game.platform}</p>
            <p><strong>Genre:</strong> {game.genre}</p>
            <p><strong>Developer:</strong> {game.developer}</p>
            <p><strong>Release Date:</strong> {new Date(game.release_date).toLocaleDateString()}</p>
            <p><strong>Description:</strong> {game.description}</p>
          </div>

          <div className="purchase-box">
            <p><strong>Price:</strong> ${game.price}</p>
            <p><strong>In Stock:</strong> {game.stock_quantity}</p>
            <p><strong>Average Rating:</strong> {avgRating || 'No reviews yet'}</p>
            <button onClick={handlePurchase}>Purchase</button>
          </div>

          <div className="review-section">
            <h3>Reviews</h3>
            {paginatedReviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              <ul>
                {paginatedReviews.map((review, index) => (
                  <li key={index}>
                    <strong>Rating:</strong> {review.rating}<br />
                    {review.review_text}
                  </li>
                ))}
              </ul>
            )}
            {totalPages > 1 && (
              <div>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} disabled={currentPage === i + 1}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user && (
            <div className="review-form">
              <h3>Write a Review</h3>
              <input
                type="number"
                min="1"
                max="5"
                placeholder="Rating (1-5)"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
              <textarea
                placeholder="Your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <button onClick={submitReview}>Submit</button>
            </div>
          )}
        </>
      ) : (
        <p>Loading game details...</p>
      )}
    </div>
  );
}

export default GameDetail;
