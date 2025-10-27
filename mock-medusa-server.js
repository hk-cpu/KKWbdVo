const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 9000;

// Mock data for products
const mockProducts = [
  {
    id: 'prod_1',
    title: 'Summer Dress',
    description: 'Lightweight summer dress',
    thumbnail: 'https://placehold.co/300x400',
    handle: 'summer-dress',
    collection_id: 'coll_1',
    variants: [
      {
        id: 'variant_1',
        title: 'Small',
        prices: [
          {
            currency_code: 'usd',
            amount: 4999
          }
        ]
      },
      {
        id: 'variant_2',
        title: 'Medium',
        prices: [
          {
            currency_code: 'usd',
            amount: 4999
          }
        ]
      }
    ]
  },
  {
    id: 'prod_2',
    title: 'Winter Jacket',
    description: 'Warm winter jacket',
    thumbnail: 'https://placehold.co/300x400',
    handle: 'winter-jacket',
    collection_id: 'coll_1',
    variants: [
      {
        id: 'variant_3',
        title: 'Large',
        prices: [
          {
            currency_code: 'usd',
            amount: 12999
          }
        ]
      }
    ]
  }
];

// Mock data for collections
const mockCollections = [
  {
    id: 'coll_1',
    title: 'Summer Collection',
    handle: 'summer-collection'
  }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  console.log(`[${new Date().toISOString()}] ${method} ${pathname}`);
  
  // Route handling
  if (pathname === '/store/products' && method === 'GET') {
    // Return products list
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      products: mockProducts,
      count: mockProducts.length,
      offset: 0,
      limit: 10
    }));
  } else if (pathname.startsWith('/store/products/') && method === 'GET') {
    // Return specific product
    const productId = pathname.split('/')[3];
    const product = mockProducts.find(p => p.id === productId || p.handle === productId);
    
    if (product) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ product }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Product not found' }));
    }
  } else if (pathname === '/store/collections' && method === 'GET') {
    // Return collections list
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      collections: mockCollections,
      count: mockCollections.length,
      offset: 0,
      limit: 10
    }));
  } else if (pathname.startsWith('/store/collections/') && method === 'GET') {
    // Return specific collection
    const collectionId = pathname.split('/')[3];
    const collection = mockCollections.find(c => c.id === collectionId || c.handle === collectionId);
    
    if (collection) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ collection }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Collection not found' }));
    }
  } else if (pathname === '/store/carts' && method === 'POST') {
    // Create a new cart
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      cart: {
        id: 'cart_123',
        items: [],
        total: 0
      }
    }));
  } else if (pathname.startsWith('/store/carts/') && method === 'GET') {
    // Return cart
    const cartId = pathname.split('/')[3];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      cart: {
        id: cartId,
        items: [],
        total: 0
      }
    }));
  } else if (pathname.startsWith('/store/carts/') && pathname.endsWith('/line-items') && method === 'POST') {
    // Add item to cart
    const cartId = pathname.split('/')[3];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      cart: {
        id: cartId,
        items: [],
        total: 0
      }
    }));
  } else {
    // Default response
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Mock Medusa API Server' }));
  }
});

server.listen(PORT, () => {
  console.log(`Mock Medusa server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
});