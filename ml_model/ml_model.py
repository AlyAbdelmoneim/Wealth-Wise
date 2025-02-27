import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

class FinancialModel:
    def __init__(self):
        self.model = LinearRegression()

    def train(self, X_train, y_train):
        self.model.fit(X_train, y_train)

    def predict(self, X_input):
        return self.model.predict(X_input)
