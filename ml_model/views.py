from django.http import JsonResponse
import numpy as np
from .ml_model import IncomePredictor

model = IncomePredictor()
X_train = np.array([[10], [20], [30]])  # Example data
y_train = np.array([100, 200, 300])  # Example labels
model.train(X_train, y_train)  # Train the model

def predict_income(request):
    X_input = np.array([[40]])  # Example input
    try:
        prediction = model.predict(X_input)
        return JsonResponse({"prediction": prediction.tolist()})
    except ValueError as e:
        return JsonResponse({"error": str(e)}, status=500)
