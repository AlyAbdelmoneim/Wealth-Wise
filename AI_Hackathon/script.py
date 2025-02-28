import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
import json

# Initialize Firebase
cred = credentials.Certificate("/home/amrkhaled/Desktop/servicefile1.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

print("✅ Connected to Firebase!")

# Function to get user's total annual income (Fixed + Variable)
def get_annual_income(user_email):
    fixed_income_ref = db.collection("fixed_income").where("user_email", "==", user_email)
    fixed_income_docs = fixed_income_ref.stream()

    monthly_salary_total = 0
    yearly_bonus_total = 0

    for doc in fixed_income_docs:
        data = doc.to_dict()
        monthly_salary_total += data.get("monthly_salary", 0)
        yearly_bonus_total += data.get("yearly_bonus", 0)

    one_year_ago = datetime.now() - timedelta(days=365)
    variable_income_ref = db.collection("variable_income").where("user_email", "==", user_email)
    variable_income_docs = variable_income_ref.stream()

    variable_income_total = 0
    for doc in variable_income_docs:
        data = doc.to_dict()
        created_at = data.get("created_at")

        if created_at:
            created_at_dt = datetime.fromisoformat(created_at)
            if created_at_dt >= one_year_ago:
                variable_income_total += data.get("amount", 0)

    annual_income = (monthly_salary_total * 12) + yearly_bonus_total + variable_income_total
    return int(annual_income)

# Function to get total transactions amount in the last year
def get_yearly_transactions(user_email):
    one_year_ago = datetime.now() - timedelta(days=365)

    transactions_ref = db.collection("transactions").where("user_email", "==", user_email)
    docs = transactions_ref.stream()

    total_amount = 0
    for doc in docs:
        data = doc.to_dict()
        created_at = data.get("created_at")

        if created_at:
            created_at_dt = datetime.fromisoformat(created_at)
            if created_at_dt >= one_year_ago:
                total_amount += data.get("amount", 0)

    return int(total_amount)

# Function to get expenses by category for the last year
def get_yearly_expenses_by_category(user_email):
    one_year_ago = datetime.now() - timedelta(days=365)

    categories = ['work_expenses', 'luxury_expenses', 'living_expenses']
    expenses = {category: 0 for category in categories}

    for category in categories:
        expenses_ref = db.collection(category).where("user_email", "==", user_email)
        docs = expenses_ref.stream()

        for doc in docs:
            data = doc.to_dict()
            created_at = data.get("transaction_date")

            if created_at:
                created_at_dt = datetime.fromisoformat(created_at)
                if created_at_dt >= one_year_ago:
                    expenses[category] += data.get("amount", 0)

    expenses['total_expenses'] = sum(expenses.values())
    return expenses

# Function to generate JSON data for the frontend
def generate_json_data(user_email):
    annual_income = get_annual_income(user_email)
    yearly_transactions = get_yearly_transactions(user_email)
    expenses = get_yearly_expenses_by_category(user_email)

    data = {
        "annual_income": annual_income,
        "yearly_transactions": yearly_transactions,
        "expenses": expenses
    }

    return json.dumps(data, indent=4)

# Example usage
user_email = "kareem.elfeel@gmail.com"
json_data = generate_json_data(user_email)
print(json_data)






