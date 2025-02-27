import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

class IncomePredictor:
    def __init__(self):
        self.model = LinearRegression()
        self.is_trained = False  # Track whether the model is trained

    def train(self, X_train, y_train):
        self.model.fit(X_train, y_train)
        self.is_trained = True

    def predict(self, X_input):
        if not self.is_trained:
            raise ValueError("Model is not trained. Call `train()` first.")
        return self.model.predict(X_input)

class RetirementPlanner:
    def __init__(self):
        self.model = LinearRegression()
        self.is_trained = False  # Track whether the model is trained

    def train(self, X_train, y_train):
        self.model.fit(X_train, y_train)
        self.is_trained = True

    def predict(self, X_input):
        if not self.is_trained:
            raise ValueError("Model is not trained. Call `train()` first.")
        return self.model.predict(X_input)