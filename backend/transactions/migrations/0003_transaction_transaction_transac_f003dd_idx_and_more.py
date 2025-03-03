# Generated by Django 4.2.16 on 2025-02-05 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transactions', '0002_transaction_transaction_transac_ce1ccb_idx'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='transaction',
            index=models.Index(fields=['transaction_date'], name='transaction_transac_f003dd_idx'),
        ),
        migrations.AddIndex(
            model_name='transaction',
            index=models.Index(fields=['property_id'], name='transaction_propert_605749_idx'),
        ),
    ]
