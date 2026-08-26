import fs from 'fs';

async function multipartRequest(method, path, filePath, type, token) {
  const fileBuffer = fs.readFileSync(filePath);
  const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append('file', blob, 'test-image.jpg');
  formData.append('type', type);

  const res = await fetch(`http://127.0.0.1:3000${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  let data;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = text;
  }
  console.log('Status:', res.status);
  console.log('Response:', data);
}

// We need a token and a listing ID to test this...
// But wait, what if the backend log already has the error because I modified listings.service.ts? 
// If I could just run the full test-listing-media.js, it creates users, listings, and then uploads media. Let's fix test-listing-media.js!
