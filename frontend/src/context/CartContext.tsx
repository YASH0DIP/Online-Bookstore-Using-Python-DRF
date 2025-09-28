import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  author: string;
  price: number;
  rating: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: CartItem) => void;
  removeFromCart: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  incrementItem: (bookId: number) => void;
  decrementItem: (bookId: number) => void;
  clearCart: () => void;
}



const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev =>
      prev.some(i => i.id === item.id)
        ? prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
        : [...prev, item]
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const incrementItem = (id: number) => {
    setCartItems(prev =>
      prev.map(i =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decrementItem = (id: number) => {
    setCartItems(prev =>
      prev
        .map(i =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter(i => i.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (bookId: number, quantity: number) => {
  setCartItems(prev =>
    prev.map(item => item.id === bookId ? { ...item, quantity } : item)
  );
};

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        incrementItem,
        decrementItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
