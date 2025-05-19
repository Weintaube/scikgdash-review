import { fetchData } from '../../utils/fetchData';
import Client from './Client';

export default async function StatementsPerPaper() {
  // Define initial sorting and other query parameters
  const initialSorting = [{ id: 'created_at', desc: false }];
  const params = {
    size: 10,
    //filter: 'some_filter_value', // Add filters or any other params hereS
  };
  
  // Fetch initial data with sorting and additional parameters
  const url = 'https://orkg.org/api/papers/statement-counts';
  const data = await fetchData(url, { sorting: initialSorting, params });
  //console.log("Data fetched from server:", data);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Client initialData={data.content} initialSorting={initialSorting} />
    </div>
  );
}
