# Generated by Django 4.2.16 on 2025-02-24 10:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0057_propertyupdates_update_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='property_manager',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
