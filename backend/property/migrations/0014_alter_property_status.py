# Generated by Django 4.2.16 on 2024-09-12 14:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0013_propertytoken_token_transaction_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='property',
            name='status',
            field=models.CharField(choices=[('listing', 'Listing'), ('published', 'Published'), ('draft', 'Draft'), ('coming_soon', 'Coming Soon'), ('rejected', 'Rejected'), ('under_review', 'Under Review')], default='listing', help_text='The current status of the property listing.', max_length=20),
        ),
    ]
