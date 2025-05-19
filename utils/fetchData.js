// utils/fetchData.js
export const fetchData = async (url, { sorting = [], ...options } = {}) => {
  console.log(`Fetching data from ${url}...`);

  try {
    // Construct query parameters for sorting if sorting is provided
    const params = new URLSearchParams();
    sorting.forEach(sort => {
      const direction = sort.desc ? 'desc' : 'asc';
      params.append('sort', `${sort.id},${direction}`);
    });

    // Construct the full URL with query parameters
    const queryUrl = params.toString() ? `${url}?${params.toString()}` : url;
    console.log("Constructed URL:", queryUrl);

    // Perform the fetch request
    const res = await fetch(queryUrl, options);

    // Check if the response status is OK
    if (!res.ok) {
      const errorText = await res.text(); // Read the response text for more details
      throw new Error(`Error fetching data: ${res.statusText} (${res.status}) - ${errorText}`);
    }

    // Parse and return the JSON response
    const data = await res.json();
    console.log("Data fetched successfully", data);
    return data;
  } catch (error) {
    // Log and handle the error
    console.error("Error in fetchData:", error);
    return null; // Handle error accordingly
  }
};
