exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let product;
  try {
    product = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!product.name || !product.price || !product.image) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = process.env.GITHUB_REPO;
  if (!GITHUB_TOKEN || !REPO) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfiguration' }) };
  }

  try {
    const fileUrl = `https://api.github.com/repos/${REPO}/contents/data/products.json`;
    const getFileRes = await fetch(fileUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    const fileData = await getFileRes.json();

    if (!getFileRes.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch products file' }) };
    }

    const currentContent = Buffer.from(fileData.content, 'base64').toString('utf8');
    let products = [];
    try {
      products = JSON.parse(currentContent);
      if (!Array.isArray(products)) products = [];
    } catch {
      products = [];
    }

    product.id = Date.now();
    products.push(product);

    const newContent = Buffer.from(JSON.stringify(products, null, 2)).toString('base64');
    const updateRes = await fetch(fileUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Add product: ${product.name}`,
        content: newContent,
        sha: fileData.sha
      })
    });

    if (!updateRes.ok) {
      const err = await updateRes.json();
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to update file', details: err }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Product added successfully' })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
