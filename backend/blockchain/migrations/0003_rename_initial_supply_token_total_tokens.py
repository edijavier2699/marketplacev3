# Generated by Django 4.2.16 on 2025-01-13 12:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blockchain', '0002_rename_total_tokens_token_initial_supply_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='token',
            old_name='initial_supply',
            new_name='total_tokens',
        ),
    ]
