import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { StarIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContext";

const BookDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState<any>({});

  const [reviews, setReviews] = useState<string[]>(["Great Book"]);
  const [newReview, setNewReview] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8000/api/book/${id}/`)
      .then((res) => {
      setBook(res.data)});

    axios.get(`http://localhost:8000/api/book/${id}/reviews/`)
      .then((res) => setReviews(res.data.map((r: any) => r.review_data)));
  }, [id]);



  const handleAddReview = async () => {
    if (token) {
      if(newReview.trim()){
      await axios.post(
        `http://localhost:8000/api/book/${id}/review/`,
        { review_data: newReview },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews([...reviews, newReview]);
      setNewReview("");
      }
      else{
        alert("Write review first!!!");
      }
    }
    else {
      navigate('/login');
    }
  };


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">📖 Book Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-white p-2 shadow-md rounded-xl">
          <div className="h-48 w-auto p-2 flex justify-center items-start md:h-auto md:w-auto">
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-96 h-full object-fill rounded shadow md:w-auto"
            />
          </div>

          <div className="p-2 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-2 md:text-2xl">{book.title}</h2>
              <p className="text-gray-600 mb-1 italic text-xs md:text-sm">by {book.author}</p>
              <p className="text-gray-600 mb-2 text-xs md:text-sm">ISBN: {book.isbn}</p>

              <div className="flex items-center gap-1 text-yellow-500 my-2">
                {Array.from({ length: Math.floor(book.rating) }).map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5" />
                ))}
                <span className="text-gray-500 ml-1 text-sm">({book.rating})</span>
              </div>

              <div className="mt-2">
                <div className="text-lg font-bold text-green-600 md:text-2xl">₹{book.price}</div>
                <div className="text-sm text-gray-400 line-through">₹{book.original_price}</div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-700">{book.description}</p>
              </div>
            </div>

            { (book.stock!==0) ?
              <button
              className="mt-6 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded text-sm font-semibold transition"
              onClick={() => {
                // console.log(book);
                addToCart({
                  id: book.id,
                  name: book.title,
                  price: parseFloat(book.price),
                  quantity: 1,
                  image: book.cover_url,
                  author: book.author,
                  rating: book.rating,
                  stock: book.stock,
                })
                navigate("/cart");
              }}
            >
              🛒 Add to Cart
            </button>
            :
              <button
              disabled
              className="mt-6 bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded text-sm font-semibold transition"
            >
              🛒 Out of stock
            </button>
            }
          </div>
        </div>

        <div className="bg-gray-50 shadow-inner rounded-xl p-6 flex flex-col justify-between h-[450px]">
          <div className="overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">🗣️ Reviews</h3>
            <div className="">
            {reviews.length > 0 ? (
              <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                {reviews.map((review, index) => (
                  <li key={index}>{review}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No reviews yet.</p>
            )}

            </div>

            <div className="mt-4">
              <textarea
                rows={3}
                placeholder="Write a review..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
              <button
                onClick={handleAddReview}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
