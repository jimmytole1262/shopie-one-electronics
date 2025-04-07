// Simple cart client implementation
import { createRoot } from 'react-dom/client';
import { createElement, useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';

function CartComponent() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, updateItemQuantity, clearCart, totalPrice } = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return createElement('div', null, 'Loading cart...');
  }

  // Empty cart state
  if (items.length === 0) {
    return createElement(
      'div', 
      { className: 'text-center py-12' },
      [
        createElement('div', { 
          className: 'inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4',
          key: 'icon'
        }, 
          createElement('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            width: 24,
            height: 24,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            className: 'h-8 w-8 text-slate-500'
          }, [
            createElement('circle', { cx: 8, cy: 21, r: 1, key: 'circle1' }),
            createElement('circle', { cx: 19, cy: 21, r: 1, key: 'circle2' }),
            createElement('path', { d: 'M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12', key: 'path' })
          ])
        ),
        createElement('h2', { className: 'text-2xl font-semibold mb-2', key: 'title' }, 'Your cart is empty'),
        createElement('p', { className: 'text-gray-500 mb-6', key: 'desc' }, 'Looks like you haven\'t added anything to your cart yet.'),
        createElement('a', { 
          href: '/', 
          className: 'bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium',
          key: 'link'
        }, 'Start Shopping')
      ]
    );
  }

  // Calculate derived values
  const subtotal = totalPrice();
  const shipping = items.length > 0 ? 9.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Cart items display
  const cartItems = items.map(item => 
    createElement('div', { key: item.id, className: 'p-4 border-b' },
      createElement('div', { className: 'flex justify-between items-center' },
        [
          createElement('div', { className: 'flex items-center gap-4', key: 'product' },
            [
              createElement('div', { className: 'w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden', key: 'img' },
                createElement('img', { 
                  src: item.image || '/placeholder.svg', 
                  alt: item.name,
                  className: 'object-cover w-full h-full'
                })
              ),
              createElement('div', { key: 'details' },
                [
                  createElement('h3', { className: 'font-medium', key: 'name' }, item.name),
                  createElement('p', { className: 'text-sm text-gray-500', key: 'price' }, `$${item.price.toFixed(2)}`)
                ]
              )
            ]
          ),
          createElement('div', { className: 'flex items-center gap-4', key: 'actions' },
            [
              createElement('div', { className: 'flex items-center gap-2', key: 'quantity' },
                [
                  createElement('button', { 
                    className: 'h-8 w-8 rounded-full border flex items-center justify-center hover:bg-gray-100',
                    onClick: () => updateItemQuantity(item.id, Math.max(1, item.quantity - 1)),
                    disabled: item.quantity <= 1,
                    key: 'minus'
                  }, '-'),
                  createElement('span', { key: 'count' }, item.quantity),
                  createElement('button', { 
                    className: 'h-8 w-8 rounded-full border flex items-center justify-center hover:bg-gray-100',
                    onClick: () => updateItemQuantity(item.id, item.quantity + 1),
                    key: 'plus'
                  }, '+')
                ]
              ),
              createElement('button', { 
                className: 'text-red-500 hover:text-red-700',
                onClick: () => removeItem(item.id),
                key: 'remove'
              }, 
                createElement('svg', {
                  xmlns: 'http://www.w3.org/2000/svg',
                  width: 20,
                  height: 20,
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  strokeWidth: 2,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round'
                }, [
                  createElement('path', { d: 'M3 6h18', key: 'p1' }),
                  createElement('path', { d: 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6', key: 'p2' }),
                  createElement('path', { d: 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2', key: 'p3' }),
                  createElement('line', { x1: 10, y1: 11, x2: 10, y2: 17, key: 'l1' }),
                  createElement('line', { x1: 14, y1: 11, x2: 14, y2: 17, key: 'l2' })
                ])
              )
            ]
          )
        ]
      )
    )
  );

  // Summary section
  const summary = createElement('div', { className: 'bg-gray-50 p-6 rounded-lg mt-6' },
    [
      createElement('h2', { className: 'text-xl font-semibold mb-4', key: 'title' }, 'Order Summary'),
      createElement('div', { className: 'space-y-3', key: 'details' },
        [
          createElement('div', { className: 'flex justify-between', key: 'subtotal' },
            [
              createElement('span', { className: 'text-gray-600', key: 'label' }, 'Subtotal'),
              createElement('span', { key: 'value' }, `$${subtotal.toFixed(2)}`)
            ]
          ),
          createElement('div', { className: 'flex justify-between', key: 'shipping' },
            [
              createElement('span', { className: 'text-gray-600', key: 'label' }, 'Shipping'),
              createElement('span', { key: 'value' }, `$${shipping.toFixed(2)}`)
            ]
          ),
          createElement('div', { className: 'flex justify-between', key: 'tax' },
            [
              createElement('span', { className: 'text-gray-600', key: 'label' }, 'Tax (8%)'),
              createElement('span', { key: 'value' }, `$${tax.toFixed(2)}`)
            ]
          ),
          createElement('div', { className: 'border-t pt-3 mt-3 flex justify-between font-semibold', key: 'total' },
            [
              createElement('span', { key: 'label' }, 'Total'),
              createElement('span', { key: 'value' }, `$${total.toFixed(2)}`)
            ]
          )
        ]
      ),
      createElement('button', { 
        className: 'w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium',
        key: 'checkout'
      }, 'Proceed to Checkout'),
      createElement('button', { 
        className: 'w-full mt-3 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-md font-medium',
        onClick: clearCart,
        key: 'clear'
      }, 'Clear Cart')
    ]
  );

  // Main cart container
  return createElement(
    'div', 
    { className: 'space-y-6' },
    [
      createElement('div', { className: 'bg-white rounded-lg shadow-md overflow-hidden', key: 'items' }, cartItems),
      summary
    ]
  );
}

// Export a function that renders the cart into a container
export default function renderCart(container) {
  const root = createRoot(container);
  root.render(createElement(CartComponent));
}
