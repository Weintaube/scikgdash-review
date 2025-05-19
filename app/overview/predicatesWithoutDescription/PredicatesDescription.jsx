import { fetchData } from '../../utils/fetchData';
import Client from './Client';

export default async function PredicatesDescription() {
  // Define initial sorting and other query parameters
  const initialSorting = [{ id: 'created_at', desc: false }];
  const params = {
    size: 10,
    //filter: 'some_filter_value', // Add filters or any other params here
  };
  
  // Fetch initial data with sorting and additional parameters
  const url = 'https://orkg.org/api/curation/predicates-without-descriptions';
  const data = await fetchData(url, { sorting: initialSorting, params });

  const totalNumberPredicates = await fetchData('https://orkg.org/api/predicates');
  const totalNumber = totalNumberPredicates.totalElements;
  console.log("TOTAL NUMBER", totalNumber);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Client initialData={data} totalNumber={totalNumber} initialSorting={initialSorting} />
    </div>
  );
}
