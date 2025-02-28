import uuid
import json
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.views import View
from firebase_admin import firestore
from datetime import datetime, timedelta
from rest_framework.decorators import api_view
import google.generativeai as genai
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import requests

db = firestore.client()

genai.configure(api_key="AIzaSyBZFbmzifh7zWSiXZsznz4_YhUoOv8QNFY")
model = genai.GenerativeModel("gemini-1.5-pro-latest")


@api_view(["POST"])
def chat_with_palm(request):
    user_message = request.data.get("message", "")
    response = model.generate_content(user_message)
    return JsonResponse({"response": response.text})


# Class-based view for the home page and test data management
class HomeView(View):
    def get(self, request):
        return render(request, 'home.html')

    def post(self, request):
        test_data = request.POST.get('test_data')
        if test_data:
            db.collection('testCollection').add({'data': test_data})
            return HttpResponse('Data saved to Firebase: ' + test_data)
        return render(request, 'home.html')


# Class-based view to manage user creation using email as the document ID
class AddUserView(View):
    def get(self, request):
        return render(request, 'add_user.html')

    def post(self, request):
        name = request.POST.get('name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        country = request.POST.get('country')
        currency = request.POST.get('currency')
        savings = request.POST.get('savings')
        networth = request.POST.get('networth')

        if name and email and password:
            try:
                # Use the email as the unique ID for the user
                user_data = {
                    'name': name,
                    'email': email,
                    'password': password,  # For security, use hashing in production
                    'country': country,
                    'currency': currency,
                    'savings': float(savings) if savings else 0.0,
                    'networth': float(networth) if networth else 0.0,
                }

                # Add user data to Firebase using the email as the document ID
                db.collection('users').document(email).set(user_data)
                return HttpResponse('User added successfully!')

            except Exception as e:
                print(f"Error saving to Firebase: {e}")
                return HttpResponse('Failed to save user data to Firebase')

        return render(request, 'add_user.html')


# Class-based view to add financial transactions using email as the user reference
class AddTransactionView(View):
    def get(self, request):
        return render(request, 'add_transaction.html')

    def post(self, request):
        email = request.POST.get('email')  # Use email as the identifier
        amount = request.POST.get('amount')
        description = request.POST.get('description')
        transaction_type = request.POST.get('type')  # 'income' or 'expense'

        if email and amount and transaction_type:
            try:
                transaction_id = f"{email}_{amount}"

                transaction_data = {
                    'user_email': email,
                    'amount': float(amount),
                    'description': description,
                    'type': transaction_type,
                    'created_at': datetime.utcnow().isoformat()  # Adding created_at timestamp
                }

                db.collection('transactions').document(transaction_id).set(transaction_data)
                return HttpResponse('Transaction added successfully!')

            except Exception as e:
                print(f"Error saving to Firebase: {e}")
                return HttpResponse('Failed to save transaction to Firebase')

        return render(request, 'add_transaction.html')


# Class-based view to fetch financial data as JSON
class FinancialDataView(View):
    def get(self, request):
        user_email = request.GET.get('user_email')  # Get user_email from query parameters

        if not user_email:
            return JsonResponse({"error": "user_email is required"}, status=400)

        try:
            # Fetch annual income
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

            # Fetch yearly transactions
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

            # Fetch yearly expenses by category
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

            # Generate JSON data
            annual_income = get_annual_income(user_email)
            yearly_transactions = get_yearly_transactions(user_email)
            expenses = get_yearly_expenses_by_category(user_email)

            data = {
                "annual_income": annual_income,
                "yearly_transactions": yearly_transactions,
                "expenses": expenses
            }

            return JsonResponse(data, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def get_financial_data(request):
    if request.method == 'GET':
        user_email = request.GET.get('user_email')  # Get user_email from query parameters

        if not user_email:
            return JsonResponse({"error": "user_email is required"}, status=400)

        try:
            # Generate financial data for the user
            financial_view = FinancialDataView()
            return financial_view.get(request)  # Use the existing method to get financial data
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "GET method required"}, status=405)


# Class-based view to display data on the frontend
class DisplayDataView(View):
    def get(self, request):
        users_ref = db.collection('testCollection')
        docs = users_ref.stream()
        data = [doc.to_dict().get('data') for doc in docs]
        return render(request, 'home.html', {'data': data})


# Class-based view to manage employee information linked to user email
class AddEmployeeView(View):
    def get(self, request):
        return render(request, 'add_employee.html')

    def post(self, request):
        user_email = request.POST.get('user_email')  # Email of the user who owns the employee data
        employee_name = request.POST.get('employee_name')
        job_description = request.POST.get('job_description')
        salary = request.POST.get('salary')
        linked_user_email = request.POST.get('linked_user_email')  # Optional email to link two users

        if user_email and employee_name and salary:
            try:
                employee_id = f"{user_email}_{employee_name}"

                employee_data = {
                    'user_email': user_email,  # Linking to the user who owns the data
                    'employee_name': employee_name,
                    'job_description': job_description,
                    'salary': float(salary) if salary else 0.0,
                    'linked_user_email': linked_user_email,  # Optional linked user
                    'created_at': datetime.utcnow().isoformat()  # Auto-created date
                }

                db.collection('employees').document(employee_id).set(employee_data)
                return HttpResponse('Employee added successfully!')

            except Exception as e:
                print(f"Error saving to Firebase: {e}")
                return HttpResponse('Failed to save employee data to Firebase')

        return render(request, 'add_employee.html')


class LinkedDataView(View):
    def get(self, request):
        user_email = request.GET.get('user_email')  # Main user email
        linked_user_email = request.GET.get('linked_user_email')  # Linked user email

        if not user_email:
            return HttpResponse('User email is required!', status=400)

        try:
            combined_data = {
                'users': [],
                'employees': [],
                'transactions': []
            }

            # Fetch User Data
            for email in [user_email, linked_user_email]:
                if email:
                    user_doc = db.collection('users').document(email).get()
                    if user_doc.exists:
                        user_data = user_doc.to_dict()
                        combined_data['users'].append(user_data)

            # Fetch Employee Data
            employees_ref = db.collection('employees').where('user_email', 'in', [user_email, linked_user_email])
            employee_docs = employees_ref.stream()
            combined_data['employees'] = [doc.to_dict() for doc in employee_docs]

            # Fetch Financial Transactions
            transactions_ref = db.collection('transactions').where('user_email', 'in', [user_email, linked_user_email])
            transaction_docs = transactions_ref.stream()
            combined_data['transactions'] = [doc.to_dict() for doc in transaction_docs]

            return render(request, 'linked_data.html', {'data': combined_data})

        except Exception as e:
            print(f"Error fetching linked data: {e}")
            return HttpResponse('Failed to fetch linked data.', status=500)


# Class-based view to create a link between two users
class LinkUsersView(View):
    def get(self, request):
        return render(request, 'link_users.html')

    def post(self, request):
        email1 = request.POST.get('email1')
        password1 = request.POST.get('password1')
        email2 = request.POST.get('email2')
        password2 = request.POST.get('password2')
        link_password = request.POST.get('link_password')

        if email1 and password1 and email2 and password2 and link_password:
            try:
                # Generate a unique link ID
                link_id = str(uuid.uuid4())

                # Fetch user data from Firebase
                user1_doc = db.collection('users').document(email1).get()
                user2_doc = db.collection('users').document(email2).get()

                if user1_doc.exists and user2_doc.exists:
                    user1_data = user1_doc.to_dict()
                    user2_data = user2_doc.to_dict()

                    # Calculate combined financials
                    combined_networth = user1_data.get('networth', 0.0) + user2_data.get('networth', 0.0)
                    combined_savings = user1_data.get('savings', 0.0) + user2_data.get('savings', 0.0)

                    # Prepare linked users data
                    linked_data = {
                        'email1': email1,
                        'password1': password1,  # For security, consider hashing
                        'email2': email2,
                        'password2': password2,
                        'link_id': link_id,
                        'link_password': link_password,  # Hash for security
                        'combined_networth': combined_networth,
                        'combined_savings': combined_savings,
                        'created_at': datetime.utcnow().isoformat()
                    }

                    # Save the linked users data to Firebase
                    db.collection('linked_users').document(link_id).set(linked_data)
                    return HttpResponse('Users linked successfully!')

                else:
                    return HttpResponse('One or both users do not exist in the database.', status=404)

            except Exception as e:
                print(f"Error linking users: {e}")
                return HttpResponse('Failed to link users.', status=500)

        return render(request, 'link_users.html')


# Function to update combined financials when user data changes
def update_combined_financials(user_email):
    try:
        # Fetch all linked records where the user is involved
        linked_users_ref = db.collection('linked_users')
        linked_docs = linked_users_ref.where('email1', '==', user_email).stream()
        linked_docs = list(linked_docs) + list(linked_users_ref.where('email2', '==', user_email).stream())

        for doc in linked_docs:
            linked_data = doc.to_dict()
            email1 = linked_data['email1']
            email2 = linked_data['email2']

            # Fetch updated user data
            user1_data = db.collection('users').document(email1).get().to_dict() or {}
            user2_data = db.collection('users').document(email2).get().to_dict() or {}

            # Recalculate combined financials
            combined_networth = user1_data.get('networth', 0.0) + user2_data.get('networth', 0.0)
            combined_savings = user1_data.get('savings', 0.0) + user2_data.get('savings', 0.0)

            # Update linked user document with new combined values
            db.collection('linked_users').document(doc.id).update({
                'combined_networth': combined_networth,
                'combined_savings': combined_savings,
                'updated_at': datetime.utcnow().isoformat()
            })

    except Exception as e:
        print(f"Error updating combined financials: {e}")


class AddFixedIncomeView(View):
    def get(self, request):
        return render(request, 'add_fixed_income.html')

    def post(self, request):
        user_email = request.POST.get('user_email')
        job_description = request.POST.get('job_description')
        monthly_salary = request.POST.get('monthly_salary')
        yearly_bonus = request.POST.get('yearly_bonus')

        if user_email and job_description and monthly_salary:
            try:
                income_id = f"{user_email}_fixed_{uuid.uuid4()}"

                fixed_income_data = {
                    'user_email': user_email,
                    'job_description': job_description,
                    'monthly_salary': float(monthly_salary) if monthly_salary else 0.0,
                    'yearly_bonus': float(yearly_bonus) if yearly_bonus else 0.0,
                    'created_at': datetime.utcnow().isoformat()
                }

                db.collection('fixed_income').document(income_id).set(fixed_income_data)
                return HttpResponse('Fixed income added successfully!')

            except Exception as e:
                print(f"Error saving fixed income to Firebase: {e}")
                return HttpResponse('Failed to save fixed income data.', status=500)

        return render(request, 'add_fixed_income.html')


# Class-based view to manage Variable Income
class AddVariableIncomeView(View):
    def get(self, request):
        return render(request, 'add_variable_income.html')

    def post(self, request):
        user_email = request.POST.get('user_email')
        description = request.POST.get('description')
        customer_phone = request.POST.get('customer_phone')
        amount = request.POST.get('amount')

        if user_email and description and amount:
            try:
                income_id = f"{user_email}_variable_{uuid.uuid4()}"

                variable_income_data = {
                    'user_email': user_email,
                    'description': description,
                    'customer_phone': customer_phone,
                    'amount': float(amount) if amount else 0.0,
                    'created_at': datetime.utcnow().isoformat()
                }

                db.collection('variable_income').document(income_id).set(variable_income_data)
                return HttpResponse('Variable income added successfully!')

            except Exception as e:
                print(f"Error saving variable income to Firebase: {e}")
                return HttpResponse('Failed to save variable income data.', status=500)

        return render(request, 'add_variable_income.html')


class AddWorkExpenseView(View):
    def get(self, request):
        return render(request, 'add_work_expense.html')

    def post(self, request):
        user_email = request.POST.get('user_email')
        expense_type = request.POST.get('type')  # Yearly, Monthly, One-Time
        amount = request.POST.get('amount')
        description = request.POST.get('description')
        transaction_date = request.POST.get('transaction_date')

        if user_email and expense_type and amount:
            try:
                expense_id = f"{user_email}_work_{uuid.uuid4()}"
                work_expense_data = {
                    'user_email': user_email,
                    'type': expense_type,
                    'amount': float(amount) if amount else 0.0,
                    'description': description,
                    'transaction_date': transaction_date or datetime.utcnow().isoformat()
                }
                db.collection('work_expenses').document(expense_id).set(work_expense_data)
                return HttpResponse('Work expense added successfully!')

            except Exception as e:
                print(f"Error saving work expense to Firebase: {e}")
                return HttpResponse('Failed to save work expense data.', status=500)

        return render(request, 'add_work_expense.html')


# Class-based view to manage Luxury Expenses
class AddLuxuryExpenseView(View):
    def get(self, request):
        return render(request, 'add_luxury_expense.html')

    def post(self, request):
        user_email = request.POST.get('user_email')
        expense_type = request.POST.get('type')  # Monthly, Yearly
        amount = request.POST.get('amount')
        description = request.POST.get('description')
        transaction_date = request.POST.get('transaction_date')

        if user_email and expense_type and amount:
            try:
                expense_id = f"{user_email}_luxury_{uuid.uuid4()}"
                luxury_expense_data = {
                    'user_email': user_email,
                    'type': expense_type,
                    'amount': float(amount) if amount else 0.0,
                    'description': description,
                    'transaction_date': transaction_date or datetime.utcnow().isoformat()
                }
                db.collection('luxury_expenses').document(expense_id).set(luxury_expense_data)
                return HttpResponse('Luxury expense added successfully!')

            except Exception as e:
                print(f"Error saving luxury expense to Firebase: {e}")
                return HttpResponse('Failed to save luxury expense data.', status=500)

        return render(request, 'add_luxury_expense.html')


# Class-based view to manage Living Expenses
class AddLivingExpenseView(View):
    def get(self, request):
        return render(request, 'add_living_expense.html')

    def post(self, request):
        user_email = request.POST.get('user_email')
        expense_type = request.POST.get('type')  # Weekly, Monthly, Yearly
        amount = request.POST.get('amount')
        description = request.POST.get('description')
        transaction_date = request.POST.get('transaction_date')

        if user_email and expense_type and amount:
            try:
                expense_id = f"{user_email}_living_{uuid.uuid4()}"
                living_expense_data = {
                    'user_email': user_email,
                    'type': expense_type,
                    'amount': float(amount) if amount else 0.0,
                    'description': description,
                    'transaction_date': transaction_date or datetime.utcnow().isoformat()
                }
                db.collection('living_expenses').document(expense_id).set(living_expense_data)
                return HttpResponse('Living expense added successfully!')

            except Exception as e:
                print(f"Error saving living expense to Firebase: {e}")
                return HttpResponse('Failed to save living expense data.', status=500)

        return render(request, 'add_living_expense.html')


class FinancialOperationsView(View):
    def get(self, request):
        user_email = request.session.get('user_email', None)
        return render(request, 'financial_operations.html', {'user_email': user_email})

    def post(self, request):
        user_email = request.session.get('user_email', None) or request.POST.get('user_email')
        action = request.POST.get('action')
        apply_tax_deduction = request.POST.get('apply_tax_deduction', 'no') == 'yes'

        if not user_email:
            return HttpResponse('User email is required!', status=400)

        request.session['user_email'] = user_email

        try:
            today = datetime.utcnow()
            one_month_ago = today - timedelta(days=30)

            income_data = {}
            profit_data = {}
            cash_flow_data = {}
            tax_data = {}

            # Income Calculation
            if action == 'calculate_income':
                fixed_income_ref = db.collection('fixed_income').where('user_email', '==', user_email)
                fixed_income_docs = fixed_income_ref.stream()
                monthly_fixed_salary = sum([doc.to_dict().get('monthly_salary', 0.0) for doc in fixed_income_docs])

                variable_income_ref = db.collection('variable_income').where('user_email', '==', user_email)
                variable_income_docs = variable_income_ref.stream()

                variable_income_last_month = 0.0

                for doc in variable_income_docs:
                    data = doc.to_dict()
                    amount = data.get('amount', 0.0)
                    transaction_date_str = data.get('created_at', None)

                    if transaction_date_str:
                        transaction_date = datetime.fromisoformat(transaction_date_str)

                        if transaction_date >= one_month_ago:
                            variable_income_last_month += amount

                total_income_one_month = monthly_fixed_salary + variable_income_last_month

                income_data = {
                    'monthly_fixed_salary': monthly_fixed_salary,
                    'variable_income_last_month': variable_income_last_month,
                    'month_income': total_income_one_month
                }

            # Profit and Loss Calculation
            elif action == 'calculate_profit_loss':
                fixed_income_ref = db.collection('fixed_income').where('user_email', '==', user_email)
                fixed_income_docs = fixed_income_ref.stream()
                monthly_fixed_salary = sum([doc.to_dict().get('monthly_salary', 0.0) for doc in fixed_income_docs])

                variable_income_ref = db.collection('variable_income').where('user_email', '==', user_email)
                variable_income_docs = variable_income_ref.stream()

                variable_income_last_month = 0.0

                for doc in variable_income_docs:
                    data = doc.to_dict()
                    amount = data.get('amount', 0.0)
                    transaction_date_str = data.get('created_at', None)

                    if transaction_date_str:
                        transaction_date = datetime.fromisoformat(transaction_date_str)

                        if transaction_date >= one_month_ago:
                            variable_income_last_month += amount

                work_expense_ref = db.collection('work_expenses').where('user_email', '==', user_email)
                work_expense_docs = work_expense_ref.stream()

                work_expense_last_month = 0.0

                for doc in work_expense_docs:
                    data = doc.to_dict()
                    amount = data.get('amount', 0.0)
                    transaction_date_str = data.get('transaction_date', None)

                    if transaction_date_str:
                        transaction_date = datetime.fromisoformat(transaction_date_str)

                        if transaction_date >= one_month_ago:
                            work_expense_last_month += amount

                profit_and_loss = (monthly_fixed_salary + variable_income_last_month) - work_expense_last_month

                profit_data = {
                    'monthly_income': monthly_fixed_salary,
                    'variable_income_last_month': variable_income_last_month,
                    'work_expense_last_month': work_expense_last_month,
                    'profit_and_loss': profit_and_loss
                }

            # Current Cash Flow
            elif action == 'calculate_cash_flow':
                user_doc = db.collection('users').document(user_email).get()
                if user_doc.exists:
                    user_data = user_doc.to_dict()
                    savings = user_data.get('savings', 0.0)
                    networth = user_data.get('networth', 0.0)
                    total_cash_flow = savings + networth

                    cash_flow_data = {
                        'savings': savings,
                        'networth': networth,
                        'total_cash_flow': total_cash_flow
                    }

            # Taxation Calculation
            elif action == 'calculate_taxation':
                fixed_income_ref = db.collection('fixed_income').where('user_email', '==', user_email)
                fixed_income_docs = fixed_income_ref.stream()
                monthly_fixed_salary = sum([doc.to_dict().get('monthly_salary', 0.0) for doc in fixed_income_docs])

                variable_income_ref = db.collection('variable_income').where('user_email', '==', user_email)
                variable_income_docs = variable_income_ref.stream()

                variable_income_last_month = 0.0

                for doc in variable_income_docs:
                    data = doc.to_dict()
                    amount = data.get('amount', 0.0)
                    transaction_date_str = data.get('created_at', None)

                    if transaction_date_str:
                        transaction_date = datetime.fromisoformat(transaction_date_str)

                        if transaction_date >= one_month_ago:
                            variable_income_last_month += amount

                total_income = monthly_fixed_salary + variable_income_last_month

                tax_rate = 0.0
                if total_income > 1200000:
                    tax_rate = 27.5
                elif total_income > 400000:
                    tax_rate = 25
                elif total_income > 200000:
                    tax_rate = 22.5
                elif total_income > 70000:
                    tax_rate = 20
                elif total_income > 55000:
                    tax_rate = 15
                elif total_income > 40000:
                    tax_rate = 10

                tax_data = {
                    'monthly_fixed_salary': monthly_fixed_salary,
                    'variable_income_last_month': variable_income_last_month,
                    'total_income': total_income,
                    'tax_rate': tax_rate
                }

                if apply_tax_deduction:
                    tax_amount = (tax_rate / 100) * total_income
                    db.collection('users').document(user_email).update({
                        'networth': firestore.Increment(-tax_amount)
                    })

            return render(request, 'financial_operations.html', {
                'income_data': income_data,
                'profit_data': profit_data,
                'cash_flow_data': cash_flow_data,
                'tax_data': tax_data,
                'user_email': user_email
            })

        except Exception as e:
            print(f"Error processing financial operations: {e}")
            return HttpResponse('Failed to process financial operations.', status=500)


@method_decorator(csrf_exempt, name='dispatch')
class ChatbotAPI(View):
    def post(self, request):
        user_email = request.POST.get('user_email')
        user_message = request.POST.get('message')

        if not user_email or not user_message:
            return HttpResponseBadRequest("User email and message are required!")

        try:
            print(f"Received Email: {user_email}")
            print(f"Received Message: {user_message}")

            # Fetch user data from Firestore
            user_doc = db.collection('users').document(user_email).get()

            if not user_doc.exists:
                # Fetch all users from the Firestore 'users' collection
                users_ref = db.collection('users')
                docs = users_ref.stream()

                # Collect all users' emails for debugging
                all_users = [doc.id for doc in docs]
                print("All Users in Firestore:", all_users)

                return JsonResponse({
                    'error': 'User not found!',
                    'available_users': all_users
                }, status=404)

            user_data = user_doc.to_dict()
            print(f"Fetched User Data: {user_data}")

            # Create a context-rich prompt including user data
            context_prompt = f"""
                            User Profile:
                            - Name: {user_data.get('name', 'Unknown')}
                            - Country: {user_data.get('country', 'Unknown')}
                            - Currency: {user_data.get('currency', 'Unknown')}
                            - Savings: {user_data.get('savings', 'Unknown')}
                            - Net Worth: {user_data.get('netWorth', 'Unknown')}
                            - Age: {user_data.get('age', 'Unknown')}
                            - Job: {user_data.get('jobDescription', 'Unknown')} ({user_data.get('position', 'Unknown')})
                            - Risk Tolerance: {user_data.get('riskTolerance', 'Unknown')}
                            - Hobbies: {user_data.get('freeTime', 'Unknown')}
                            - Additional Info: {user_data.get('additionalInfo', 'Unknown')}

                            Based on this user profile, please provide a personalized response to:
                            {user_message}
                            """

            # Prepare the payload for Google Generative Language API
            payload = {
                "contents": [{
                    "parts": [{"text": context_prompt}]
                }]
            }
            print("Payload Sent to API:", payload)

            api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB0CmGwxQLrrtK2XqV6t76E6VS-XxIZImQ"

            headers = {'Content-Type': 'application/json'}

            # Send request to the Google API with a timeout and handle exceptions
            response = requests.post(api_url, headers=headers, data=json.dumps(payload), timeout=30)

            # Check the full response for debugging
            print("Full API Response:", response.text)

            if response.status_code == 200:
                try:
                    # Ensure the response is parsed as JSON
                    api_response = response.json()
                    print("Parsed API Response:", api_response)

                    # Extract the generated text - proper path for Gemini 2.0
                    if 'candidates' in api_response and len(api_response['candidates']) > 0:
                        candidate = api_response['candidates'][0]
                        if 'content' in candidate and 'parts' in candidate['content']:
                            parts = candidate['content']['parts']
                            if len(parts) > 0 and 'text' in parts[0]:
                                generated_text = parts[0]['text']
                                return JsonResponse({'response': generated_text})

                    # Fallback extraction method
                    if 'contents' in api_response and len(api_response['contents']) > 0:
                        content = api_response['contents'][0]
                        if 'parts' in content and len(content['parts']) > 0:
                            generated_text = content['parts'][0].get('text', 'No text in response')
                            return JsonResponse({'response': generated_text})

                    return JsonResponse({'response': 'Could not extract text from API response'})

                except json.JSONDecodeError as e:
                    print(f"JSON Decode Error: {e}")
                    return JsonResponse({'error': f'Failed to parse API response: {str(e)}'}, status=500)

            else:
                print(f"API Request Failed: {response.status_code} - {response.text}")
                return JsonResponse({'error': f'Failed to get response from API: {response.text}'}, status=500)

        except Exception as e:
            print(f"Error in ChatbotAPI: {e}")
            return JsonResponse({'error': f'Internal server error: {str(e)}'}, status=500)