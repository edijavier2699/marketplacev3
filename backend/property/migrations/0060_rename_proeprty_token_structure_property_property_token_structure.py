# Generated by Django 4.2.16 on 2025-02-24 10:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0059_property_proeprty_token_structure'),
    ]

    operations = [
        migrations.RenameField(
            model_name='property',
            old_name='proeprty_token_structure',
            new_name='property_token_structure',
        ),
    ]
