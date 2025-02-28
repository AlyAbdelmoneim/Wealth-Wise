import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta

# Initialize Firebase
cred = credentials.Certificate("/home/amrkhaled/Desktop/servicefile1.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

print("✅ Connected to Firebase!")


# Function to get user's total annual income
def get_annual_income(user_email):
    fixed_income_ref = db.collection("fixed_income").where("user_email", "==", user_email)
    docs = fixed_income_ref.stream()

    for doc in docs:
        data = doc.to_dict()
        monthly_salary = data.get("monthly_salary", 0)
        yearly_bonus = data.get("yearly_bonus", 0)

        annual_income = (monthly_salary * 12) + yearly_bonus
        return int(annual_income)

    print(f"⚠ No fixed income data found for user: {user_email}")
    return 0


# Function to get total transactions amount in the last year
def get_yearly_transactions(user_email):
    one_year_ago = datetime.now() - timedelta(days=365)

    transactions_ref = db.collection("variable_income").where("user_email", "==", user_email)
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


# Function to visualize income vs. transactions
def plot_income_vs_transactions(user_email):
    annual_income = get_annual_income(user_email)
    yearly_transactions = get_yearly_transactions(user_email)

    categories = ["Annual Income", "Yearly Transactions"]
    values = [annual_income, yearly_transactions]

    plt.figure(figsize=(8, 5))
    sns.barplot(x=categories, y=values, palette="viridis")
    plt.title(f"Income vs Transactions for User {user_email}")
    plt.ylabel("Amount in Currency")
    plt.tight_layout()
    plt.savefig('income_vs_transactions.png')
    plt.close()
    print("✅ Income vs Transactions plot saved as 'income_vs_transactions.png'")


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


# Function to visualize expenses by category
def plot_expense_categories(user_email):
    expenses = get_yearly_expenses_by_category(user_email)

    print("Expenses Dictionary:", expenses)

    categories = ["Work", "Luxury", "Living", "Total"]
    values = [
        expenses['work_expenses'],
        expenses['luxury_expenses'],
        expenses['living_expenses'],
        expenses['total_expenses']
    ]

    plt.figure(figsize=(10, 6))
    sns.barplot(x=categories, y=values, palette="viridis")

    for i, value in enumerate(values):
        plt.text(i, value + 500, f'{value:,}', ha='center', fontsize=10)

    plt.title(f"Yearly Expenses by Category for User {user_email}")
    plt.ylabel("Amount in Currency")
    plt.tight_layout()
    plt.savefig('expense_categories.png')
    plt.close()
    print("✅ Expense categories plot saved as 'expense_categories.png'")


# Example usage
user_email = "kareem.elfeel@gmail.com"
annual_income = get_annual_income(user_email)
print("Annual Income:", annual_income)

# Display the income vs transactions visualization
plot_income_vs_transactions(user_email)

# Get and display expense categories
expenses = get_yearly_expenses_by_category(user_email)
print("\nYearly Expenses:")
for category, amount in expenses.items():
    print(f"{category.replace('_', ' ').title()}: {amount}")

# Display the expense categories visualization
plot_expense_categories(user_email)
