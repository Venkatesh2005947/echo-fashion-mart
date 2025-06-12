
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'mens' | 'womens' | 'accessories';
  description: string;
  sizes: string[];
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AppContextType {
  user: User | null;
  cart: CartItem[];
  orders: Order[];
  products: Product[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (shippingAddress: any) => string;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getCartTotal: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic White Shirt',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=400',
    category: 'mens',
    description: 'A timeless white shirt perfect for any occasion',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true
  },
  {
    id: '2',
    name: 'Elegant Black Dress',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    category: 'womens',
    description: 'Sophisticated black dress for evening events',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true
  },
  {
    id: '3',
    name: 'Designer Handbag',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
    category: 'accessories',
    description: 'Luxury handbag crafted from premium leather',
    sizes: ['One Size'],
    inStock: true
  },
  {
    id: '4',
    name: 'Casual Denim Jeans',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    category: 'mens',
    description: 'Comfortable denim jeans for everyday wear',
    sizes: ['30', '32', '34', '36'],
    inStock: true
  },
  {
    id: '5',
    name: 'Floral Summer Dress',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
    category: 'womens',
    description: 'Light and airy summer dress with floral pattern',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true
  },
  {
    id: '6',
    name: 'Leather Watch',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
    category: 'accessories',
    description: 'Classic leather watch with minimalist design',
    sizes: ['One Size'],
    inStock: true
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(mockProducts);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedCart = localStorage.getItem('cart');
    const savedOrders = localStorage.getItem('orders');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    if (email === 'admin@store.com' && password === 'admin') {
      setUser({ id: '1', email, name: 'Admin User', isAdmin: true });
      return true;
    } else if (email && password) {
      setUser({ id: '2', email, name: 'Customer', isAdmin: false });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (product: Product, size: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id && item.size === size);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.size === size)));
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const placeOrder = (shippingAddress: any): string => {
    const orderId = Date.now().toString();
    const newOrder: Order = {
      id: orderId,
      userId: user?.id || 'guest',
      items: [...cart],
      total: getCartTotal(),
      status: 'pending',
      shippingAddress,
      createdAt: new Date()
    };
    setOrders(prev => [...prev, newOrder]);
    clearCart();
    return orderId;
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  return (
    <AppContext.Provider value={{
      user,
      cart,
      orders,
      products,
      login,
      logout,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      addProduct,
      updateOrderStatus,
      getCartTotal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
