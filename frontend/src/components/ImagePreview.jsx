import { X, ZoomIn } from "lucide-react";

/**
 * ImagePreview Component
 * Reusable thumbnail image preview with optional remove and zoom actions.
 */
function ImagePreview({
  src,
  alt = "Evidence preview",
  label,
  onRemove,
  onZoom,
  className = ""
}) {
  if (!src) return null;

  return (
    <div
      className={`image-preview ${className}`.trim()}
      style={{ position: "relative" }}
    >
      <img src={src} alt={alt} />

      {label && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(17, 24, 39, 0.75)",
            color: "white",
            fontSize: "10px",
            padding: "2px 6px",
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {label}
        </div>
      )}

      {onZoom && (
        <button
          type="button"
          onClick={onZoom}
          title="Zoom image"
          style={{
            position: "absolute",
            left: "5px",
            top: "5px",
            background: "rgba(17, 24, 39, 0.7)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          <ZoomIn size={13} />
        </button>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          title="Remove image"
          aria-label="Remove image"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export default ImagePreview;
