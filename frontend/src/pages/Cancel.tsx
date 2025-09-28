
  import { Link } from 'react-router-dom';
  import { XCircleIcon } from '@heroicons/react/24/solid';

  const Cancel = () => {
    return (
      <div className="flex items-center justify-center bg-red-50 px-4 py-4">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
          <XCircleIcon className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Payment Cancelled</h2>
          <p className="text-gray-600 mb-4">
            Your transaction was not completed. You can try again anytime.
          </p>
          <Link
            to="/cart"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    );
  };

  export default Cancel;
