import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/react';
import { useState } from 'react';

export default function CommentModal({ isOpen, onClose, onSubmit }) {
  const [description, setDescription] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [commentType, setCommentType] = useState('General'); // Default value

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const resourceType = resourceUrl.split('/')[3] || null; // Assuming the type is the fourth part of the URL
      const resourceId = resourceUrl.split('/')[4] || null; // Assuming the ID is the fifth part of the URL
      let resourceTitle = ''; // Local variable to hold the title
  
      console.log("Type and ID of resource:", resourceType, resourceId);
  
      if (resourceType && resourceId) {
        let response;
  
        // Fetch based on resource type
        if (resourceType === "paper") {
          response = await fetch(`https://orkg.org/api/papers/${resourceId}`);
        } else if (resourceType === "comparison") {
          response = await fetch(`https://orkg.org/api/comparisons/${resourceId}`);
        } else if (resourceType === "class") {
          response = await fetch(`https://orkg.org/api/classes/${resourceId}`);
        } else if (resourceType === "template") {
          response = await fetch(`https://orkg.org/api/templates/${resourceId}`);
        } else if (resourceType === "u") { // user
          response = await fetch(`https://orkg.org/api/contributors/${resourceId}`);
        } else if (resourceType === "observatory") {
          response = await fetch(`https://orkg.org/api/observatories/${resourceId}`);
        }
  
        if (response && response.ok) {
          const result = await response.json();
          console.log("Response JSON:", result);
  
          // Extract the appropriate title based on resource type
          if (resourceType === "paper" || resourceType === "comparison") {
            resourceTitle = result.title;
          } else if (resourceType === "class" || resourceType === "template") {
            resourceTitle = result.label;
          } else if (resourceType === "u") { // user
            resourceTitle = result.display_name;
          } else if (resourceType === "observatory") {
            resourceTitle = result.name;
          }
  
          console.log("Fetched Title:", resourceTitle);
        }
      }
  
      // Create the comment object with the local variables
      const comment = {
        resourceType,
        resourceId,
        resourceTitle,
        resourceUrl,
        commentType,
        description,
      };
  
      console.log("Generated comment:", comment);
  
      // Pass the comment to the parent via onSubmit
      onSubmit(comment);
  
      // Clear the form fields
      setDescription('');
      setResourceUrl('');
      setCommentType('General');
      onClose();
  
    } catch (error) {
      console.error("Error fetching data for comments database:", error); // Log the actual error
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true"></div> {/* Semi-transparent background */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-lg p-6 bg-white rounded shadow-lg">
          <DialogTitle className="text-lg font-bold">Add Comment</DialogTitle>
          <DialogDescription className="mt-2">
            Fill in the details of the comment below.
          </DialogDescription>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="resourceUrl" className="block text-sm font-medium text-gray-700">
                Resource URL
              </label>
              <input
                id="resourceUrl"
                type="url"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                placeholder="https://orkg.org"
                className="w-full border rounded p-2 mt-1"
                required
              />
            </div>
            <div>
              <label htmlFor="commentType" className="block text-sm font-medium text-gray-700">
                Comment Type
              </label>
              <select
                id="commentType"
                value={commentType}
                onChange={(e) => setCommentType(e.target.value)}
                className="w-full border rounded p-2 mt-1"
                required
              >
                <option value="General">General</option>
                <option value="Feedback">Feedback</option>
                <option value="Question">Question</option>
                <option value="Issue">Issue</option>
              </select>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter your comment here..."
                rows="4"
                className="w-full border rounded p-2 mt-1"
                required
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Submit
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
