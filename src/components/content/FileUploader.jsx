import api from "../../apis";
import { useState } from "react";
import { urlPath } from "../../constants";
import { FaFileUpload } from "react-icons/fa";
import { ProgressBar } from "react-bootstrap";
import { FILE_UPLOAD } from "../../graphql";

const FileUploader = ({
  handler,
  id = "file_uploader",
  label = "Upload",
  initialValue = {},
}) => {
  const [fileUrl, setFileUrl] = useState(initialValue.url ? urlPath(initialValue.url.substring(1)) : null);
  const [fileId, setFileId] = useState(initialValue.id || null);
  const [uploadProgress, setProgress] = useState(0);
  const [isUploading, setUploading] = useState(false);

  const onUploadProgress = ({ loaded, total }) => {
    let progress = ((loaded / total) * 100).toFixed(2);
    setProgress(progress);
  };

  const handleChange = async (e) => {
    try {
      setUploading(true);
      let formdata = new FormData();
      const queryString = {
        query: FILE_UPLOAD,
        variables: {
          file: null,
        },
      };

      formdata.append("operations", JSON.stringify(queryString));
      formdata.append(
        "map",
        JSON.stringify({
          0: ["variables.file"],
        })
      );

      formdata.append("0", e.target.files[0], e.target.files[0].name);

      let { data } = await api.post("/graphql", formdata, {
        onUploadProgress,
        headers: { "Content-Type": "multipart/form-data" },
      });

      await setFileUrl(urlPath(data.data.upload.url.substring(0)));
      await setFileId(Number(data.data.upload.id));

      handler({
        id: fileId || Number(data.data.upload.id),
        path: fileUrl || urlPath(data.data.upload.url.substring(1)),
      });
    } catch (err) {
      
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {!isUploading && !fileUrl && (
        <div className="uploader-container">
          <div className="imageUploader">
            <p className="upload-helper-text">Click Here To Upload </p>
            <div className="upload-helper-icon">
              <FaFileUpload size={30} color={"#257b69"} />
            </div>
            <input
              id={id}
              accept=".pdf, .docx"
              type="file"
              multiple={false}
              name="file-uploader"
              onChange={handleChange}
              className="uploaderInput"
            />
          </div>
          <label  className="text--primary latto-bold text-center">
            {label}
          </label>
        </div>
      )}
      {isUploading && !fileUrl && (
        <ProgressBar variant="success" now={uploadProgress} />
      )}
      {fileUrl && (
        <a className="alert alert-success" >File uploaded </a>

      )}
    </div>
  );
};

export default FileUploader;
