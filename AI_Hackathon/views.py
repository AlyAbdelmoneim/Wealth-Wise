# AI_Hackathon/views.py
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views import View
from firebase_admin import firestore
import uuid

db = firestore.client()

# Class-based view for the home page and test data management
class HomeView(View):
    def get(self, request):
        return render(request, 'home.html')

    def post(self, request):
        test_data = request.POST.get('test_data')
        if test_data:
            # Save test data to Firestore
            db.collection('testCollection').add({'data': test_data})
            return HttpResponse('Data saved to Firebase: ' + test_data)
        return render(request, 'home.html')

# Class-based view to manage user creation
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
                # Generate a unique user ID
                user_id = str(uuid.uuid4())

                # Prepare user data
                user_data = {
                    'name': name,
                    'email': email,
                    'password': password,  # For security, use hashing in production
                    'country': country,
                    'currency': currency,
                    'savings': float(savings) if savings else 0.0,
                    'networth': float(networth) if networth else 0.0,
                }

                # Add data to Firebase Firestore
                db.collection('users').document(user_id).set(user_data)
                return HttpResponse('User added successfully!')

            except Exception as e:
                print(f"Error saving to Firebase: {e}")
                return HttpResponse('Failed to save user data to Firebase')

        return render(request, 'add_user.html')

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
        # Fetch all documents from Firestore
        users_ref = db.collection('testCollection')
        docs = users_ref.stream()

        # Extract data into a list
        data = [doc.to_dict().get('data') for doc in docs]
        return render(request, 'home.html', {'data': data})
