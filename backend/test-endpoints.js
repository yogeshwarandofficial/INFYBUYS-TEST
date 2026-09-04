async function runTests() {
  const baseUrl = 'http://localhost:3000/listings';
  
  const testUrls = [
    `${baseUrl}?search=restaurant`,
    `${baseUrl}?minPrice=100000&maxPrice=500000`,
    `${baseUrl}?listingType=SALE`,
    `${baseUrl}?sort=price_low`,
  ];

  for (const url of testUrls) {
    console.log(`\nTesting: GET ${url}`);
    try {
      const response = await fetch(url);
      const json = await response.json();
      console.log(`Status: ${response.status}`);
      if (json.data && Array.isArray(json.data)) {
        console.log(`Found ${json.data.length} listings.`);
        if (json.data.length > 0) {
            console.log('Sample item:', JSON.stringify(json.data[0], null, 2));
        }
      } else {
        console.log('Response:', JSON.stringify(json, null, 2));
      }
    } catch (e) {
      console.error(`Error fetching ${url}:`, e.message);
    }
  }
}

runTests();
