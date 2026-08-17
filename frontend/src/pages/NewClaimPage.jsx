import { Upload, X, Car, User, FileText } from "lucide-react";
import { useState } from "react";

function NewClaimPage() {
  const [images, setImages] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <main className="new-claim-page">

      <div className="new-claim-header">
        <div>
          <h2>New Claim</h2>
          <p>Enter claim details and upload vehicle damage images.</p>
        </div>
      </div>

      <div className="claim-form-card">

        <div className="form-section-title">
          <User size={20} />
          <div>
            <h3>Claim Information</h3>
            <p>Basic information about the insurance claim.</p>
          </div>
        </div>

        <div className="form-grid">

          <div className="form-group">
            <label>Claim ID</label>
            <input type="text" placeholder="Enter Claim ID" />
          </div>

          <div className="form-group">
            <label>Policy ID</label>
            <input type="text" placeholder="Enter Policy ID" />
          </div>

          <div className="form-group">
            <label>Customer Name</label>
            <input type="text" placeholder="Enter customer name" />
          </div>

          <div className="form-group">
            <label>Vehicle Number</label>
            <input type="text" placeholder="TN01 AB 1234" />
          </div>

        </div>

        <div className="form-section-title vehicle-title">
          <Car size={20} />
          <div>
            <h3>Vehicle Information</h3>
            <p>Provide the vehicle details related to the claim.</p>
          </div>
        </div>

        <div className="form-grid">

          <div className="form-group">
            <label>Vehicle Make</label>
            <input type="text" placeholder="Example: Hyundai" />
          </div>

          <div className="form-group">
            <label>Vehicle Model</label>
            <input type="text" placeholder="Example: Creta" />
          </div>

          <div className="form-group">
            <label>Vehicle Year</label>
            <input type="number" placeholder="2024" />
          </div>

          <div className="form-group">
            <label>Accident Date</label>
            <input type="date" />
          </div>

        </div>

        <div className="form-section-title vehicle-title">
          <FileText size={20} />
          <div>
            <h3>Vehicle Damage Evidence</h3>
            <p>Upload images of the damaged vehicle.</p>
          </div>
        </div>

        <label className="upload-box">

          <Upload size={30} />

          <h4>Upload vehicle images</h4>

          <p>
            Drag and drop images here or click to browse
          </p>

          <small>
            JPG, JPEG or PNG • Maximum 10 MB per image
          </small>

          <input
            type="file"
            accept="image/png,image/jpeg"
            multiple
            onChange={handleImageUpload}
            hidden
          />

        </label>

        {images.length > 0 && (

          <div className="uploaded-images">

            {images.map((image, index) => (

              <div className="image-preview" key={index}>

                <img
                  src={URL.createObjectURL(image)}
                  alt="Vehicle damage"
                />

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                >
                  <X size={15} />
                </button>

              </div>

            ))}

          </div>

        )}

        <div className="form-actions">

          <button className="cancel-btn">
            Cancel
          </button>

          <button className="analyze-btn">
            Analyze Claim
          </button>

        </div>

      </div>

    </main>
  );
}

export default NewClaimPage;