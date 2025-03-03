from django.db import models
from django.utils import timezone
import uuid
from django.core.exceptions import ValidationError

class Transaction(models.Model):

    class TransactionType(models.TextChoices):
        BUY = 'buy', 'Buy'
        SELL = 'sell', 'Sell'
        CANCEL = 'cancel', 'Cancel'

    property_id = models.ForeignKey("property.Property", blank=True, null=True, related_name='transactions', on_delete=models.CASCADE)
    transaction_owner_code = models.ForeignKey("users.CustomUser", related_name='transactions', on_delete=models.CASCADE)
    token_code = models.ForeignKey("blockchain.Token", related_name='transactions', on_delete=models.CASCADE)
    transaction_amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_date = models.DateTimeField(default=timezone.now)  # Usamos timezone para mayor control
    additional_details = models.JSONField(null=True, blank=True)
    transaction_tokens_amount = models.BigIntegerField(null=True, blank=True)
    transaction_type = models.CharField(max_length=20, choices=TransactionType.choices, default=TransactionType.BUY)  # Usamos el modelo de TextChoices

    def __str__(self):
        return f"{self.get_transaction_type_display()} - {self.transaction_amount} on {self.transaction_date.strftime('%Y-%m-%d')}"

    def clean(self):
        # Validación extra si es necesario
        if self.transaction_tokens_amount and self.transaction_tokens_amount < 0:
            raise ValidationError("Transaction token amount cannot be negative.")

    class Meta:
        verbose_name = "Token Transaction"
        verbose_name_plural = "Token Transactions"
        ordering = ['-transaction_date']  # Ordenar de recientes a más antiguos
        indexes = [
            models.Index(fields=['transaction_owner_code']),
            models.Index(fields=['transaction_date']),
            models.Index(fields=['property_id']),
        ]
