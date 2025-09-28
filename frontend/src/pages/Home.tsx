import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCartIcon, EyeIcon, StarIcon } from "@heroicons/react/24/solid";
import { BookIcon } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [books, setBooks] = useState<any[]>([]);
  const [searchText,setSearchText] = useState("");
  const [searchResult,setSearchResult] = useState<any[]>([]);

  const handleSearch = ()=>{
    const filteredBooks = books.filter((book) => 
      book.title.toLowerCase().includes(searchText.toLowerCase())
      || book.author.toLowerCase().includes(searchText.toLowerCase())
      || String(book.price).includes(searchText)
    )

    console.log(filteredBooks);
    if(searchText!==""){
      setSearchResult(filteredBooks);
    }
    else{
      setSearchResult([]);
    }
  }

  useEffect(() => {
    axios.get("http://localhost:8000/api/books/")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <h1 className="font-bold mb-3 text-center text-blue-700 md:text-2xl md:mb-4">
          📚 Explore Our Book Collection
        </h1>
        <div className="text-lg mb-3 text-center w-auto md:mb-4">
            <input type="text" placeholder="Search by name, author, price" 
            className="border text-gray-700 border-gray-300 px-1 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 inline text-xs w-48 md:text-sm md:w-52 lg:w-64" value={searchText} onChange={(e)=> setSearchText(e.target.value)}/>
            &nbsp;&nbsp;&nbsp;
            <button className="bg-blue-600 text-white px-2 py-2 rounded hover:bg-blue-700 text-sm md:px-3 lg:px-4 font-semibold" onClick={handleSearch}>Search</button>
        </div>
      </div>
      <hr className="text-gray-600"/>
      <br />
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        { books.length>0 ? (searchResult.length>0 ? searchResult : books).map((book) => 
          <div
            key={book.id}
            className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
          >
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full z-10">
              {Math.round(((parseFloat(book.original_price) - parseFloat(book.price)) / parseFloat(book.original_price)) * 100)}% OFF
            </span>

            <img
              src={book.cover_url}
              alt={book.title}
              className="w-auto h-48 object-fill rounded-xl rounded-b-none hover:scale-105 transition-transform duration-300 md:h-64"
            />

            <div className="p-4 flex flex-col justify-between flex-grow">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-semibold text-gray-800">{book.title}</h2>
                <span className="text-green-600 font-bold text-base">₹{book.price}</span>
              </div>

              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-600 italic">{book.author}</p>
                <div className="text-sm text-gray-400 line-through">
                  ₹{book.original_price}
                </div>
              </div>

              <div className="flex items-center gap-1 text-yellow-500 text-sm mb-4">
                {Array.from({ length: Math.floor(book.rating) }).map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4" />
                ))}
                <span className="text-gray-500 ml-1">({book.rating})</span>
              </div>

              <div className="mt-auto flex justify-between gap-2">
                <button
                  className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-xs px-1 py-1 rounded-md w-1/2 transition md:text-sm md:px-3 md:py-2"
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <EyeIcon className="w-5 h-5" />
                  View Details
                </button>
                { (book.stock!==0) ?
                <button
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs px-1 py-1 rounded-md w-1/2 transition md:text-sm md:px-3 md:py-2"
                  onClick={() => {
                    addToCart({
                      id: book.id,
                      name: book.title,
                      price: parseFloat(book.price),
                      quantity: 1,
                      image: book.cover_url,
                      author: book.author,
                      rating: book.rating,
                      stock: book.stock,
                    });
                    alert("Book added into the cart");
                  }}
                >
                  <ShoppingCartIcon className="w-5 h-5" />
                  Add to Cart
                </button>
              : <button
                  disabled
                  className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white text-xs px-1 py-1 rounded-md w-1/2 transition md:text-sm md:px-3 md:py-2"
                >
                  <BookIcon className="w-5 h-5" />
                  Out of stock
                </button>
              }
              </div>
            </div>
          </div>
        ) : 
          <p className="text-center col-span-full text-gray-500">No books available.</p>
        }
      </div>
    </div>
  );
};

export default Home;
