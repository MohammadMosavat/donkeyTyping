import axiosInstance from "../api/axiosInstance";

export const fetchWord = async (
  number: number,
  length: number
): Promise<string[]> => {
  try {
    // Call the API with query parameters
    const response = await axiosInstance.get("/word", {
      params: {
        number, // ?number=5
      },
    });

    // Process and filter the response data
    const data: string[] = response.data; // API returns an array of words
    const filteredWords = data.filter((word) => word.length <= length);

    return filteredWords;
  } catch (error) {
    console.error("Error fetching the word:", error);
    return []; // Return empty array on error
  }
};
