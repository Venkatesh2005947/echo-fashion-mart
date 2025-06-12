
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface CartModalProps {
  open: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ open, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, placeOrder, user } = useApp();
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address: '',
    city: '',
    phone: ''
  });
  const { toast } = useToast();

  const handleQuantityChange = (productId: string, size: string, quantity: number) => {
    updateCartQuantity(productId, size, quantity);
  };

  const handleRemoveItem = (productId: string, size: string) => {
    removeFromCart(productId, size);
  };

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to place an order.",
        variant: "destructive",
      });
      return;
    }
    setShowCheckout(true);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = placeOrder(shippingAddress);
    toast({
      title: "Order placed successfully!",
      description: `Your order #${orderId} has been placed. Payment will be collected on delivery.`,
    });
    onClose();
    setShowCheckout(false);
    setShippingAddress({ name: '', address: '', city: '', phone: '' });
  };

  if (cart.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Cart</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button onClick={onClose} className="mt-4">
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showCheckout) {
    return (
      <Dialog open={open} onOpenChange={() => {
        onClose();
        setShowCheckout(false);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Checkout - Cash on Delivery</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={shippingAddress.name}
                onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                required
              />
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total: ${getCartTotal().toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">Cash on Delivery</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCheckout(false)}
                className="flex-1"
              >
                Back to Cart
              </Button>
              <Button type="submit" className="flex-1">
                Place Order
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Your Cart ({cart.length} items)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {cart.map((item, index) => (
            <div key={`${item.product.id}-${item.size}`} className="flex items-center space-x-4 p-4 border rounded-lg">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                <p className="font-semibold">${item.product.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.product.id, item.size, item.quantity - 1)}
                >
                  -
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(item.product.id, item.size, item.quantity + 1)}
                >
                  +
                </Button>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveItem(item.product.id, item.size)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between items-center pt-4">
            <span className="text-xl font-bold">Total: ${getCartTotal().toFixed(2)}</span>
            <Button onClick={handleCheckout} className="ml-4">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CartModal;
