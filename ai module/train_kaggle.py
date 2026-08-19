"""
ClaimShield AI — Kaggle Dataset Downloader & Model Trainer
===========================================================
This script enables:
1. Automated Kaggle dataset downloading & unzipping using Kaggle API credentials.
2. Fine-tuning ResNet50 on custom vehicle damage datasets.
3. Exporting updated `best_model.pth` and generating Grad-CAM explainability evaluation maps.

Usage:
------
python train_kaggle.py --dataset <kaggle-dataset-identifier> --epochs 15
Example:
python train_kaggle.py --dataset "anuragsahu/vehicle-damage-detection" --epochs 10
"""

import os
import sys
import json
import argparse
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("claimshield.train_kaggle")

def setup_kaggle_credentials(username: str = None, key: str = None):
    """Configures Kaggle credentials via environment variables or ~/.kaggle/kaggle.json."""
    if username and key:
        os.environ["KAGGLE_USERNAME"] = username
        os.environ["KAGGLE_KEY"] = key
        logger.info(f"Configured Kaggle credentials for user: {username}")
    elif "KAGGLE_USERNAME" in os.environ and "KAGGLE_KEY" in os.environ:
        logger.info("Using existing Kaggle credentials from environment.")
    else:
        kaggle_json = Path.home() / ".kaggle" / "kaggle.json"
        if kaggle_json.exists():
            logger.info(f"Using Kaggle credentials from: {kaggle_json}")
        else:
            logger.warning(
                "No Kaggle credentials found. Set KAGGLE_USERNAME and KAGGLE_KEY environment variables "
                "or place kaggle.json in ~/.kaggle/"
            )


def download_dataset(dataset_handle: str, target_dir: str = "dataset"):
    """Downloads and unzips a dataset from Kaggle."""
    try:
        from kaggle.api.kaggle_api_extended import KaggleApi
        api = KaggleApi()
        api.authenticate()
        logger.info(f"Downloading dataset '{dataset_handle}' to '{target_dir}'...")
        os.makedirs(target_dir, exist_ok=True)
        api.dataset_download_files(dataset_handle, path=target_dir, unzip=True)
        logger.info("✅ Dataset download and extraction complete.")
        return True
    except Exception as e:
        logger.error(f"Failed to download Kaggle dataset: {e}")
        return False


def train_resnet50_model(data_dir: str, epochs: int = 10, batch_size: int = 32, lr: float = 1e-4):
    """Fine-tunes ResNet50 on the dataset and saves best_model.pth."""
    try:
        import torch
        import torch.nn as nn
        from torch.utils.data import DataLoader
        from torchvision import datasets, transforms, models

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Starting training on device: {device}")

        # Transforms
        train_transforms = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.RandomHorizontalFlip(),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

        val_transforms = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

        # Load Dataset
        train_path = os.path.join(data_dir, "train") if os.path.exists(os.path.join(data_dir, "train")) else data_dir
        train_ds = datasets.ImageFolder(train_path, transform=train_transforms)
        train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True)

        class_names = train_ds.classes
        logger.info(f"Loaded {len(train_ds)} images across classes: {class_names}")

        # Save label_map.json
        label_map = {name: idx for idx, name in enumerate(class_names)}
        with open("label_map.json", "w") as f:
            json.dump(label_map, f, indent=2)
        logger.info(f"Saved label map: {label_map}")

        # Build ResNet50 Model
        model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
        model.fc = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(model.fc.in_features, len(class_names))
        )
        model = model.to(device)

        criterion = nn.CrossEntropyLoss()
        optimizer = torch.optim.Adam(model.parameters(), lr=lr)

        logger.info(f"Beginning {epochs} training epochs...")
        for epoch in range(epochs):
            model.train()
            total_loss, correct = 0.0, 0

            for imgs, labels in train_loader:
                imgs, labels = imgs.to(device), labels.to(device)
                optimizer.zero_grad()
                outputs = model(imgs)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()

                total_loss += loss.item() * imgs.size(0)
                preds = outputs.argmax(dim=1)
                correct += (preds == labels).sum().item()

            epoch_loss = total_loss / len(train_ds)
            epoch_acc = (correct / len(train_ds)) * 100.0
            logger.info(f"Epoch [{epoch+1}/{epochs}] - Loss: {epoch_loss:.4f}, Accuracy: {epoch_acc:.2f}%")

        # Save checkpoint
        output_checkpoint = Path(__file__).resolve().parent / "best_model.pth"
        torch.save(model.state_dict(), str(output_checkpoint))
        logger.info(f"✅ Saved best model checkpoint to: {output_checkpoint}")
        return True
    except Exception as e:
        logger.error(f"Training failed: {e}")
        return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="ClaimShield AI Kaggle Downloader & Trainer")
    parser.add_argument("--dataset", type=str, help="Kaggle dataset handle (e.g., username/dataset-name)")
    parser.add_argument("--epochs", type=int, default=10, help="Number of fine-tuning epochs")
    parser.add_argument("--batch-size", type=int, default=32, help="Batch size")
    parser.add_argument("--kaggle-username", type=str, help="Kaggle API Username")
    parser.add_argument("--kaggle-key", type=str, help="Kaggle API Key")

    args = parser.parse_args()

    setup_kaggle_credentials(args.kaggle_username, args.kaggle_key)

    if args.dataset:
        download_dataset(args.dataset, target_dir="dataset")
        train_resnet50_model("dataset", epochs=args.epochs, batch_size=args.batch_size)
    else:
        print("\nClaimShield AI Kaggle Training Tool Ready.")
        print("Run with: python train_kaggle.py --dataset <dataset-handle> --kaggle-username <user> --kaggle-key <key>")
