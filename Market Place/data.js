const MOCK_DATA_SHARED = [
    { id: 1, title: 'Laptop Pro 15" 2026', price: 1299.99, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtp6SEK3e79-kgmVVotocQAQmFj94q3g1MmugnMcS8Qkt-IM2P3L0E28U&s=10', category: 'electronics', brand: 'TechBrand' },
    { id: 2, title: 'Auriculares Inalámbricos Noise Cancelling', price: 299.00, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK2O62h_3e-l2o3_v8xP5fK7M0L0L0L0L0L0L0L0L0L0L0L0L0L0L0L0&s=10', category: 'electronics', brand: 'SoundMax' },
    { id: 3, title: 'Smartwatch Fitness Tracker', price: 199.50, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK2O62h_3e-l2o3_v8xP5fK7M0L0L0L0L0L0L0L0L0L0L0L0L0L0L0L0&s=10', category: 'electronics', brand: 'FitTime' },
    { id: 4, title: 'Cámara Mirrorless 4K', price: 850.00, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK2O62h_3e-l2o3_v8xP5fK7M0L0L0L0L0L0L0L0L0L0L0L0L0L0L0L0&s=10', category: 'electronics', brand: 'PhotoGen' },
    { id: 5, title: 'Monitor Curvo 34" Ultrawide', price: 450.00, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK2O62h_3e-l2o3_v8xP5fK7M0L0L0L0L0L0L0L0L0L0L0L0L0L0L0L0&s=10', category: 'electronics', brand: 'ViewPro' },
    { id: 6, title: 'Teclado Mecánico RGB', price: 120.00, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK2O62h_3e-l2o3_v8xP5fK7M0L0L0L0L0L0L0L0L0L0L0L0L0L0L0L0&s=10', category: 'electronics', brand: 'TechBrand' },
    { id: 7, title: 'Chaqueta de Invierno Impermeable', price: 89.99, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK2O62h_3e-l2o3_v8xP5fK7M0L0L0L0L0L0L0L0L0L0L0L0L0L0L0L0&s=10', category: 'clothing', brand: 'StyleWear' },
    { id: 8, title: 'Zapatillas Deportivas Running', price: 110.00, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK2O62h_3e-l2o3_v8xP5fK7M0L0L0L0L0L0L0L0L0L0L0L0L0L0L0L0&s=10', category: 'clothing', brand: 'RunFast' }
];

function seedProducts() {
    if (!localStorage.getItem(STORE_KEYS.PRODUCTS)) {
        localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(MOCK_DATA_SHARED));
    }
}
seedProducts();

function getProducts() {
    return JSON.parse(localStorage.getItem(STORE_KEYS.PRODUCTS)) || [];
}
