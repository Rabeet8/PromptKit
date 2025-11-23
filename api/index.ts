
export async function handleApi<T>(promise: Promise<any>): Promise<T> {
  try {
    const { data } = await promise;
    return data;
  } catch (error: any) {
    console.log("API Error:", error.response?.data || error.message);

    throw {
      message: error.response?.data?.message || "Something went wrong",
      status: error.response?.status,
      raw: error,
    };
  }
}
