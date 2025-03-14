# Generated by Django 4.2.16 on 2025-02-03 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0053_remove_property_rental_income_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='rent_amount',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='The monthly rent amount for the property.', max_digits=10, null=True),
        ),
    ]
