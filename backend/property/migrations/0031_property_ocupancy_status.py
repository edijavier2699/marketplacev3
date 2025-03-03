# Generated by Django 4.2.16 on 2024-11-15 10:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0030_property_application_ref_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='ocupancy_status',
            field=models.CharField(choices=[('rented', 'Rented'), ('vacant', 'Vacant'), ('occupied', 'Occupied')], default='rented', max_length=25),
        ),
    ]
