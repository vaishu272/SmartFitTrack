export const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Backend error";
  const extraDetails = err.extraDetails || "Error from backend...";

  // console.log(message);
  // console.log(extraDetails);
  console.log(err);
  return res.status(status).json({ message, extraDetails });
};
