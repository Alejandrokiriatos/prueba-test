// Initialize products data structure
let products = {
  carnico: [],
  herramientas: [],
  utiles: [],
  aseo: [],
  plomeria: [],
  productos: []
};

// Load products from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  displayProducts('carnico'); // Show first category by default
  setupCategoryTabs();
});

function loadProducts() {
  const storedProducts = localStorage.getItem('adminProducts');
  if (storedProducts) {
    products = JSON.parse(storedProducts);
  } else {
    // Initialize with some sample data if empty
    initializeSampleData();
  }
}

function saveProducts() {
  localStorage.setItem('adminProducts', JSON.stringify(products));
}

function displayProducts(category) {
  const container = document.getElementById('products-list');
  container.innerHTML = '';

  products[category].forEach((product, index) => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.innerHTML = `
      <div class="product-header">
        <div class="product-name">${product.name}</div>
        <div class="product-price">$${product.price}</div>
      </div>
      <div class="product-unit">${product.unit}</div>
      <div class="product-description">${product.description}</div>
      <div class="product-actions">
        <button class="edit-button" onclick="showEditModal('${category}', ${index})">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="delete-button" onclick="deleteProduct('${category}', ${index})">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    `;
    container.appendChild(productCard);
  });
}

function setupCategoryTabs() {
  const tabs = document.querySelectorAll('.category-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      displayProducts(tab.dataset.category);
    });
  });
}

function showEditModal(category, index) {
  const modal = document.getElementById('edit-modal');
  const product = products[category][index];
  
  document.getElementById('edit-category').value = category;
  document.getElementById('edit-name').value = product.name;
  document.getElementById('edit-price').value = product.price;
  document.getElementById('edit-unit').value = product.unit;
  document.getElementById('edit-description').value = product.description;

  document.getElementById('edit-form').onsubmit = (e) => {
    e.preventDefault();
    updateProduct(category, index);
  };

  modal.style.display = 'flex';
}

function showAddProductModal() {
  const modal = document.getElementById('add-modal');
  
  document.getElementById('add-form').onsubmit = (e) => {
    e.preventDefault();
    addNewProduct();
  };

  modal.style.display = 'flex';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function updateProduct(category, index) {
  products[category][index] = {
    name: document.getElementById('edit-name').value,
    price: parseFloat(document.getElementById('edit-price').value),
    unit: document.getElementById('edit-unit').value,
    description: document.getElementById('edit-description').value
  };

  saveProducts();
  displayProducts(category);
  closeModal('edit-modal');
}

function addNewProduct() {
  const category = document.getElementById('add-category').value;
  const newProduct = {
    name: document.getElementById('add-name').value,
    price: parseFloat(document.getElementById('add-price').value),
    unit: document.getElementById('add-unit').value,
    description: document.getElementById('add-description').value
  };

  products[category].push(newProduct);
  saveProducts();
  
  if (document.querySelector('.category-tab.active').dataset.category === category) {
    displayProducts(category);
  }
  
  closeModal('add-modal');
  document.getElementById('add-form').reset();
}

function deleteProduct(category, index) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    products[category].splice(index, 1);
    saveProducts();
    displayProducts(category);
  }
}

function initializeSampleData() {
  // Add sample products if needed
  products = {
    carnico: [
      {
        name: "CARNE DE RES",
        price: 2500,
        unit: "1 KG",
        description: "Carne de res de primera calidad, ideal para cualquier preparación."
      }
    ],
    herramientas: [
      {
        name: "MARTILLO",
        price: 1200,
        unit: "1 Unidad",
        description: "Martillo resistente para trabajos de construcción y reparación."
      }
    ],
    utiles: [],
    aseo: [],
    plomeria: [],
    productos: []
  };
  saveProducts();
}

// Close modal when clicking outside
window.onclick = (event) => {
  const modals = document.getElementsByClassName('modal');
  for (let modal of modals) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  }
};