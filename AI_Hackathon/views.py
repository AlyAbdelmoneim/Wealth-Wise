# AI_Hackathon/views.py
import uuid

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views import View
from firebase_admin import firestore
from datetime import datetime

db = firestore.client()

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
        users_ref = db.collection('testCollection')
        docs = users_ref.stream()
        data = {doc.id: doc.to_dict() for doc in docs}
        return JsonResponse(data)

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
                link_id = str(uuid.uuid4())
                linked_data = {
                    'email1': email1,
                    'password1': password1,
                    'email2': email2,
                    'password2': password2,
                    'link_id': link_id,
                    'link_password': link_password,
                    'created_at': datetime.utcnow().isoformat()
                }
                db.collection('linked_users').document(link_id).set(linked_data)
                return HttpResponse('Users linked successfully!')

            except Exception as e:
                print(f"Error linking users: {e}")
                return HttpResponse('Failed to link users.', status=500)
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

# 📂 Class-based view to manage Variable Income
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