import { Upload, X, Car, User, FileText } from "lucide-react";
import { useState } from "react";
import { submitClaim } from "../services/api";

function NewClaimPage({ onNavigate }) {
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    claim_id: "",
    policy_id: "",
    customer_name: "",
    vehicle_number: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    accident_date: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    setImages((previous) => [
      ...previous,
      ...files,
    ]);
  };

  const removeImage = (index) => {
    setImages((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const imageUrl = images.length > 0
        ? URL.createObjectURL(images[0])
        : "";

      const claimData = {
        ...formData,
        image_url: imageUrl,
        description: "Vehicle damage image uploaded for AI analysis.",
      };

      const createdClaim = await submitClaim(claimData);

      console.log("New claim created:", createdClaim);

      // Save the newly created claim ID
      // and open its investigation page.
      if (onNavigate) {
        onNavigate(
          "investigation",
          createdClaim.claim_id
        );
      }

    } catch (err) {
      console.error(err);

      setError(
        "Unable to submit the claim. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="new-claim-page">

      {/* Header */}

      <div className="new-claim-header">

        <div>
          <h2>New Claim</h2>

          <p>
            Enter claim details and upload vehicle damage images.
          </p>
        </div>

      </div>


      {/* Error */}

      {error && (
        <div
          style={{
            marginBottom: "15px",
            padding: "12px",
            background: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}


      {/* Form */}

      <form
        className="claim-form-card"
        onSubmit={handleSubmit}
      >

        {/* Claim Information */}

        <div className="form-section-title">

          <User size={20} />

          <div>
            <h3>Claim Information</h3>

            <p>
              Basic information about the insurance claim.
            </p>
          </div>

        </div>


        <div className="form-grid">

          <div className="form-group">

            <label>Claim ID</label>

            <input
              type="text"
              name="claim_id"
              value={formData.claim_id}
              onChange={handleChange}
              placeholder="Enter Claim ID"
            />

          </div>


          <div className="form-group">

            <label>Policy ID</label>

            <input
              type="text"
              name="policy_id"
              value={formData.policy_id}
              onChange={handleChange}
              placeholder="Enter Policy ID"
            />

          </div>


          <div className="form-group">

            <label>Customer Name</label>

            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="Enter customer name"
            />

          </div>


          <div className="form-group">

            <label>Vehicle Number</label>

            <input
              type="text"
              name="vehicle_number"
              value={formData.vehicle_number}
              onChange={handleChange}
              placeholder="TN01 AB 1234"
            />

          </div>

        </div>


        {/* Vehicle Information */}

        <div className="form-section-title vehicle-title">

          <Car size={20} />

          <div>
            <h3>Vehicle Information</h3>

            <p>
              Provide the vehicle details related to the claim.
            </p>
          </div>

        </div>


        <div className="form-grid">

          <div className="form-group">

            <label>Vehicle Make</label>

            <input
              type="text"
              name="vehicle_make"
              value={formData.vehicle_make}
              onChange={handleChange}
              placeholder="Example: Hyundai"
            />

          </div>


          <div className="form-group">

            <label>Vehicle Model</label>

            <input
              type="text"
              name="vehicle_model"
              value={formData.vehicle_model}
              onChange={handleChange}
              placeholder="Example: Creta"
            />

          </div>


          <div className="form-group">

            <label>Vehicle Year</label>

            <input
              type="number"
              name="vehicle_year"
              value={formData.vehicle_year}
              onChange={handleChange}
              placeholder="2024"
            />

          </div>


          <div className="form-group">

            <label>Accident Date</label>

            <input
              type="date"
              name="accident_date"
              value={formData.accident_date}
              onChange={handleChange}
            />

          </div>

        </div>


        {/* Evidence */}

        <div className="form-section-title vehicle-title">

          <FileText size={20} />

          <div>
            <h3>Vehicle Damage Evidence</h3>

            <p>
              Upload images of the damaged vehicle.
            </p>
          </div>

        </div>


        <label className="upload-box">

          <Upload size={30} />

          <h4>
            Upload vehicle images
          </h4>

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


        {/* Uploaded Images */}

        {images.length > 0 && (

          <div className="uploaded-images">

            {images.map((image, index) => (

              <div
                className="image-preview"
                key={index}
              >

                <img
                  src={URL.createObjectURL(image)}
                  alt="Vehicle damage"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeImage(index)
                  }
                >
                  <X size={15} />
                </button>

              </div>

            ))}

          </div>

        )}


        {/* Buttons */}

        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              onNavigate && onNavigate("dashboard")
            }
          >
            Cancel
          </button>


          <button
            type="submit"
            className="analyze-btn"
            disabled={loading}
          >
            {loading
              ? "Analyzing..."
              : "Analyze Claim"}
          </button>

        </div>

      </form>

    </main>
  );
}

export default NewClaimPage;