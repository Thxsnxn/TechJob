export async function sendContactRequest(data) {
  console.log("Mock Contact API received:", data);

  // หน่วงเวลาให้เหมือน response จริง
  await new Promise((res) => setTimeout(res, 1000));

  return {
    success: true,
    message: "Contact request saved (mock).",
    data,
  };
}
