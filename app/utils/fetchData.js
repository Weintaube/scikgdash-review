export const fetchData = async (url, { sorting = [], params = {} } = {}) => {
  console.log(`Fetching data from ${url}...`);

  try {
    // Initialize URLSearchParams to build the query string
    const queryParams = new URLSearchParams();

    // Add sorting parameters
    sorting.forEach(sort => {
      const direction = sort.desc ? 'desc' : 'asc';
      queryParams.append('sort', `${sort.id},${direction}`);
    });

    // Add other params
    Object.keys(params).forEach(key => {
      queryParams.append(key, params[key]);
    });

    // Construct the full URL with query parameters
    const queryUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
    console.log("Constructed URL:", queryUrl);

    // Perform the fetch request
    const res = await fetch(queryUrl);

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
