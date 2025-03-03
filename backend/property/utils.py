from django.db.models import Sum
from .models import  PropertyToken
from blockchain.models import Token


def get_total_tokens_owned(user):
    total_tokens_owned = PropertyToken.objects.filter(owner_user_code=user.id).aggregate(total_tokens=Sum('number_of_tokens'))
    return total_tokens_owned['total_tokens'] or 0
