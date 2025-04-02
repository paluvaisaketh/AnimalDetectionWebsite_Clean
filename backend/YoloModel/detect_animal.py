import sys
from ultralytics import YOLO

def detect_animal(image_path):
    # Load YOLO model (specify the path to your trained YOLO model file)
    model = YOLO("yolov8n.pt")  # Use 'yolov8n.pt' for a lightweight model
    animal_class_ids = list(range(16, 30))  # Replace with actual animal class IDs in your model

    # Run the detection
    results = model(image_path)
    for result in results:
        for box in result.boxes:
            if box.cls in animal_class_ids:
                return "Animal detected"
    return "No animal detected"

if __name__ == "__main__":
    image_path = sys.argv[1] if len(sys.argv) > 1 else None
    if not image_path:
        print("No image path provided.")
    else:
        print(detect_animal(image_path))
