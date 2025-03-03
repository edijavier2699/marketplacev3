from .models import Transaction
from rest_framework import serializers


class TransactionSerializer(serializers.ModelSerializer):
    transaction_owner_email = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields =[ 'transaction_owner_email', 'transaction_type','transaction_amount', 'transaction_date' ,'transaction_tokens_amount']

    def get_transaction_owner_email(self, obj):
        return obj.transaction_owner_code.email if obj.transaction_owner_code else None
