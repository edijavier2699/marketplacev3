# Generated by Django 4.2.16 on 2024-10-08 10:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0023_propertymetrics'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='transaction',
            options={'ordering': ['-transaction_date'], 'verbose_name': 'Token Transaction', 'verbose_name_plural': 'Token Transactions'},
        ),
    ]
