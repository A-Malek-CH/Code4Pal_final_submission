import React, { useState } from "react";
import axios from "axios";

const ImageUpload = ({ productId }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `http://localhost:8080/products/${productId}/upload-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setMessage("✅ Uploaded: " + res.data.imageUrl);
      console.log("Saved in DB:", res.data);
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("❌ Upload failed");
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload}>Upload Image</button>
      <p>{message}</p>
    </div>
  );
};

export default ImageUpload;
