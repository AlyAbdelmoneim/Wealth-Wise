from django.http import JsonResponse
from rest_framework.decorators import api_view
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Load the model and tokenizer once at startup
model_name = "AdaptLLM/finance-chat"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Move model to GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

@api_view(["POST"])
def chat_with_model(request):
    """
    API endpoint to get responses from the finance-chat LLM.
    """
    user_input = request.data.get("message", "")

    if not user_input:
        return JsonResponse({"error": "No input provided"}, status=400)

    # System prompt for better responses
    system_prompt = """\nYou are a helpful finance assistant. 
    Provide accurate financial insights based on the given context.\n"""

    full_prompt = f"<s>[INST] <<SYS>>{system_prompt}<</SYS>>\n\n{user_input} [/INST]"

    # Tokenize input
    inputs = tokenizer(full_prompt, return_tensors="pt", add_special_tokens=False).to(device)

    # Generate output
    outputs = model.generate(**inputs, max_length=200)

    # Decode response
    response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return JsonResponse({"response": response_text})
