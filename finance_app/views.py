# finance_app/views.py
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from firebase_admin import firestore

db = firestore.client()

def home(request):
    if request.method == 'POST':
        test_data = request.POST.get('test_data')
        if test_data:
            # Save data to Firestore
            db.collection('testCollection').add({'data': test_data})
            return HttpResponse('Data saved to Firebase: ' + test_data)

    return render(request, 'home.html')
def get_financial_data(request):
    users_ref = db.collection('testCollection')
    docs = users_ref.stream()

    data = {doc.id: doc.to_dict() for doc in docs}
    return JsonResponse(data)
