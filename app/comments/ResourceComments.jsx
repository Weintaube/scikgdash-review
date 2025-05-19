// ResourceComments.jsx (Server Side)
import Client from "./Client";

export default async function ResourceComments() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  console.log("BACKEND_URL:", BACKEND_URL);

  // Function to fetch resources with comments
  const fetchResourcesWithComments = async () => {
    "use server";
    if (!BACKEND_URL) {
      console.warn("BACKEND_URL not set, skipping fetch.");
      return [];
    }
    try {
      const res = await fetch(`${BACKEND_URL}/resources-with-comments`);
      if (!res.ok) throw new Error("Network response was not ok");
      const result = await res.json();
      return result;
    } catch (error) {
      console.error("Error fetching data:", error.message);
      return [];
    }
  };

  // Function to handle adding a comment
  async function addComment(submittedData) {
    "use server";

    if (!BACKEND_URL) {
      console.warn("BACKEND_URL not set, skipping comment creation.");
      return [];
    }

    try {
      const {
        resourceType,
        resourceId,
        resourceTitle,
        resourceUrl,
        commentType,
        description,
      } = submittedData;

      let resourceIdDB;

      // Check if resource exists
      const checkResponse = await fetch(
        `${BACKEND_URL}/resources/check?url=${encodeURIComponent(resourceUrl)}`
      );
      if (checkResponse.ok) {
        const existing = await checkResponse.json();
        resourceIdDB = existing.id;
      } else if (checkResponse.status === 404) {
        // Create new resource
        const createResponse = await fetch(`${BACKEND_URL}/resources`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: resourceTitle,
            type: resourceType,
            url: resourceUrl,
          }),
        });
        if (!createResponse.ok) throw new Error("Failed to create resource");
        const newResource = await createResponse.json();
        resourceIdDB = newResource.id;
      } else {
        throw new Error("Failed to check or create resource");
      }

      // Add comment
      const commentResponse = await fetch(
        `${BACKEND_URL}/resources/${resourceIdDB}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            typeRes: resourceType,
            uri: resourceUrl,
            typeComm: commentType,
            description: description,
          }),
        }
      );
      if (!commentResponse.ok) throw new Error("Failed to add comment");

      // Return updated list
      return await fetchResourcesWithComments();
    } catch (error) {
      console.error("Error in addComment:", error.message);
      return []; // fallback: no crash, just empty state
    }
  }

  const data = await fetchResourcesWithComments();

  return <Client data={data} addComment={addComment} />;
}
