Run npm install, then npm run dev, and open http://localhost:5173

## Features

- Search by brand name, results shown as cards
- Detail page for each medicine
- Loading, empty and error states
- Responsive on mobile and desktop

## Performance

- Debounce: waits 400ms after typing stops before calling the API
- Cancellation: AbortController stops old requests from overwriting new 
- Cache: repeated searches are served from memory
- memo: used only on the results list since the page re-renders on every keystroke


- Live URL : https://medibuddy-assign-final1.onrender.com
