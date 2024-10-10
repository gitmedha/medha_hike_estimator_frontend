import { useState } from "react";
import { urlPath } from "../../constants";
import { FaFileImage } from "react-icons/fa";
import { ProgressBar } from "react-bootstrap";

const ImageUploader = ({
  handler,
  id = "file_uploader",
  label = "Upload Logo",
  initialValue = {},
}) => {
  const [imageUrl, setImageUrl] = useState(initialValue.url ? urlPath(initialValue.url.substring(1)) : null);
  const [imageId, setImageId] = useState(initialValue.id || null);
  const [uploadProgress, setProgress] = useState(0);
  const [isUploading, setUploading] = useState(false);

  const onUploadProgress = ({ loaded, total }) => {
    let progress = ((loaded / total) * 100).toFixed(2);
    setProgress(progress);
  };

  return (
    <div>
      {!isUploading && !imageUrl && (
        <div className="uploader-container">
          <div className="imageUploader">
            <p className="upload-helper-text">Click Here To Upload Image</p>
            <div className="upload-helper-icon">
              <FaFileImage size={30} color={"#257b69"} />
            </div>
            <input
              id={id}
              type="file"
              multiple={false}
              name="file-uploader"
              className="uploaderInput"
            />
          </div>
          <label htmlFor={id} className="text--primary latto-bold text-center">
            {label}
          </label>
        </div>
      )}
      {isUploading && !imageUrl && (
        <ProgressBar variant="success" now={uploadProgress} />
      )}
      {imageUrl && (
        <img src={imageUrl} className="uploaded-img" alt={"uploaded-pic"} />
      )}
    </div>
  );
};

export default ImageUploader;
