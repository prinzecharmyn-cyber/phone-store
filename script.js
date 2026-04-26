fetch('data/products.json')
  .then(res => res.json())
  .then(products => {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    if (products.length === 0) {
      grid.innerHTML = '<p style="text-align:center;width:100%;">No products yet. Check back later!</p>';
      return;
    }

    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';

      const whatsappMessage = `Hello, I'm interested in the ${product.name} priced at ₦${product.price}`;
      const whatsappLink = `https://wa.me/2348038919878?text=${encodeURIComponent(whatsappMessage)}`;
      // 👆 Replace 234XXXXXXXXXX with the vendor’s WhatsApp number

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="price">₦${Number(product.price).toLocaleString()}</div>
          <p class="description">${product.description}</p>
        </div>
        <div class="buttons">
          <a href="${whatsappLink}" target="_blank" class="btn whatsapp">💬 WhatsApp</a>
          <button class="btn chat-live" data-product="${product.name}">📩 Live Chat</button>
        </div>
      `;

      const chatBtn = card.querySelector('.chat-live');
      chatBtn.addEventListener('click', function() {
        const productName = this.dataset.product;
        if (window.tidioChatApi) {
          window.tidioChatApi.setVisitorData({ distinct_id: productName });
          window.tidioChatApi.messageFromVisitor(`Hi, I want to know more about "${productName}"`);
          window.tidioChatApi.open();
        } else {
          alert('Live chat is loading, please try again in a moment.');
        }
      });

      grid.appendChild(card);
    });
  })
  .catch(err => {
    document.getElementById('product-grid').innerHTML = '<p>Failed to load products.</p>';
    console.error(err);
  });
